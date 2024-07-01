import express from "express";
import mongoose, { Document, ObjectId } from "mongoose";
import { AuthRequest, auth } from "../middleware/auth";
import Post, { IPost } from "../models/Post";
import User, { IUser } from "../models/User";

const router = express.Router();

// 投稿の作成
router.post("/", auth, async (req: AuthRequest, res) => {
	try {
		const newPost = new Post({
			content: req.body.content,
			author: req.userId as ObjectId | string,
		});
		const post = await newPost.save();
		await post.populate("author", "username");
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

// タイムラインの投稿を取得
router.get("/timeline", auth, async (req: AuthRequest, res) => {
	try {
		console.log(req.userId);
		const currentUser = await User.findById(req.userId);
		const currentUserId: any = currentUser?._id;

		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		const followingIds = currentUser.following;
		followingIds.push(currentUserId);

		const posts = await Post.find({ author: { $in: followingIds } })
			.sort({ createdAt: -1 })
			.populate("author", "username")
			.populate({
				path: "replies.author",
				select: "username avatar",
			})
			.limit(50);

		console.log(posts);

		res.json(posts);
	} catch (error) {
		console.error("Error fetching timeline posts:", error);
		res.status(500).json({ message: "Server error" });
	}
});
// Tweet詳細の取得
router.get("/:id", auth, async (req: AuthRequest, res) => {
	try {
		const post = await Post.findById(req.params.id).populate(
			"author",
			"username"
		);
		// 返信者のuser情報も含めて取得
		const user = await post?.populate("replies.author", "username avatar");

		if (!post) {
			return res.status(404).json({ message: "Tweet not found" });
		}
		console.log("post : " + post);
		//post と userを返す
		res.json({ post, user });
	} catch (error) {
		console.error("Error fetching tweet:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// いいね機能の更新
router.post("/:id/like", auth, async (req: AuthRequest, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Tweet not found" });
		}

		const userId = req.userId as any;
		const likeIndex = post.likes.indexOf(userId);
		if (likeIndex > -1) {
			post.likes.splice(likeIndex, 1);
		} else {
			post.likes.push(userId);
		}

		await post.save();
		await post.populate("author", "username");
		res.json(post);
	} catch (error) {
		console.error("Error liking/unliking tweet:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// 返信機能
router.post("/:postId/reply", auth, async (req: AuthRequest, res) => {
	try {
		const { postId } = req.params;
		const { content } = req.body;
		const userId = req.userId;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		// authorのIDからUserを取得
		const authorUser =
			await User.findById(userId).select("username avatar");

		const reply = {
			content,
			author: user._id,
			authorUser,
			createdAt: new Date(),
		};

		post.replies.push(reply as any);
		await post.save();

		const populatedPost = await Post.findById(postId).populate({
			path: "replies.author",
			select: "username avatar",
		});

		res.json(populatedPost?.replies.pop());
	} catch (error) {
		console.error("Error replying to post:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
