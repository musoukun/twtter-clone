import express from "express";
import { auth } from "../middleware/auth";
import Post from "../models/Post";

const router = express.Router();

// 投稿の作成
router.post("/", auth, async (req: any, res) => {
	try {
		const newPost = new Post({
			content: req.body.content,
			author: req.userId,
		});
		const post = await newPost.save();
		res.status(201).json(post);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// すべての投稿の取得
router.get("/", async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate("author", "username");
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// いいね機能
router.post("/:id/like", auth, async (req: any, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.likes.includes(req.userId)) {
			post.likes = post.likes.filter(
				(id) => id.toString() !== req.userId
			);
		} else {
			post.likes.push(req.userId);
		}
		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// コメントの追加
router.post("/:id/comment", auth, async (req: any, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		post.comments.push({
			content: req.body.content,
			author: req.userId,
			createdAt: new Date(),
		});
		await post.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
