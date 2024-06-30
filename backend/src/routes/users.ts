import express from "express";
import { auth } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";
import mongoose from "mongoose";

interface AuthRequest extends Request {
	userId?: string;
}

const router = express.Router();

// ユーザープロフィールの取得
router.get("/:id", auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// ユーザープロフィールの更新
router.put("/me", auth, async (req: any, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.userId, req.body, {
			new: true,
		}).select("-password");
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// ユーザーのフォロー
router.post("/:id/follow", auth, async (req, res) => {
	const authReq = req as unknown as AuthRequest;
	if (req.params.id === authReq.userId) {
		return res.status(400).json({ message: "You cannot follow yourself" });
	}

	try {
		const userToFollow = await User.findById(req.params.id);
		const currentUser = await User.findById(authReq.userId);

		const userToFollowId: any = userToFollow?._id;
		const currentUserId: any = currentUser?._id;

		if (!userToFollow || !currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		if (currentUser.following.includes(userToFollowId)) {
			return res
				.status(400)
				.json({ message: "You are already following this user" });
		}

		currentUser.following.push(userToFollowId);
		userToFollow.followers.push(currentUserId);

		await currentUser.save();
		await userToFollow.save();

		res.json({ message: "User followed successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/:id/unfollow", auth, async (req, res) => {
	const authReq = req as unknown as AuthRequest;
	if (req.params.id === authReq.userId) {
		return res
			.status(400)
			.json({ message: "You cannot unfollow yourself" });
	}

	try {
		const userToUnfollow = await User.findById(req.params.id);
		const currentUser = await User.findById(authReq.userId);

		const userToUnfollowId: any = userToUnfollow?._id;
		const currentUserId: any = currentUser?._id;

		if (!userToUnfollow || !currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!currentUser.following.includes(userToUnfollowId)) {
			return res
				.status(400)
				.json({ message: "You are not following this user" });
		}

		currentUser.following = currentUser.following.filter(
			(id) => !id.equals(userToUnfollowId)
		);
		userToUnfollow.followers = userToUnfollow.followers.filter(
			(id) => !id.equals(currentUserId)
		);

		await currentUser.save();
		await userToUnfollow.save();

		res.json({ message: "User unfollowed successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// ユーザーの投稿を取得
router.get("/:id/posts", auth, async (req, res) => {
	try {
		const posts = await Post.find({ author: req.params.id })
			.sort({ createdAt: -1 })
			.populate("author", "username");
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
