import express from "express";
import { AuthRequest, auth } from "../middleware/auth";
import Post from "../models/Post";
import User from "../models/User";

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

// タイムラインの投稿を取得
router.get("/timeline", auth, async (req: AuthRequest, res) => {
	try {
		const currentUser = await User.findById(req.userId);
		const currentUserId: any = currentUser?._id;

		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		const followingIds = currentUser.following;
		followingIds.push(currentUserId); // 自身の投稿も含める

		const posts = await Post.find({ author: { $in: followingIds } })
			.sort({ createdAt: -1 })
			.populate("author", "username")
			.limit(50); // 最新の50件に制限

		res.json(posts);
	} catch (error) {
		console.error("Error fetching timeline posts:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// 新しい投稿を作成
router.post("/", auth, async (req: AuthRequest, res) => {
	try {
		const newPost = new Post({
			content: req.body.content,
			author: req.userId,
		});
		const savedPost = await newPost.save();
		const populatedPost = await Post.findById(savedPost._id).populate(
			"author",
			"username"
		);
		res.status(201).json(populatedPost);
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
