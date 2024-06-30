import express, { Request, Response } from "express";
import { auth } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";
import mongoose from "mongoose";

interface AuthRequest extends Request {
	userId?: string;
}

const router = express.Router();

// ユーザープロフィールの取得
router.get("/:id", auth, async (req: AuthRequest, res: Response) => {
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
router.put("/me", auth, async (req: AuthRequest, res: Response) => {
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
router.post("/:id/follow", auth, async (req: AuthRequest, res: Response) => {
	if (req.params.id === req.userId) {
		return res.status(400).json({ message: "You cannot follow yourself" });
	}

	try {
		const userToFollow = await User.findById(req.params.id);
		const currentUser = await User.findById(req.userId);

		if (!userToFollow || !currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		if (
			currentUser.following.includes(
				new mongoose.Types.ObjectId(
					userToFollow._id as unknown as string
				)
			)
		) {
			return res
				.status(400)
				.json({ message: "You are already following this user" });
		}

		currentUser.following.push(userToFollow._id as any);
		userToFollow.followers.push(currentUser._id as any);

		await currentUser.save();
		await userToFollow.save();

		res.json({ message: "User followed successfully" });
	} catch (error) {
		console.error("Error following user:", error);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/:id/unfollow", auth, async (req: AuthRequest, res: Response) => {
	if (req.params.id === req.userId) {
		return res
			.status(400)
			.json({ message: "You cannot unfollow yourself" });
	}

	try {
		const userToUnfollow = await User.findById(req.params.id);
		const currentUser = await User.findById(req.userId);

		if (!userToUnfollow || !currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		if (
			!currentUser.following.includes(
				new mongoose.Types.ObjectId(userToUnfollow._id as string)
			)
		) {
			return res
				.status(400)
				.json({ message: "You are not following this user" });
		}

		currentUser.following = currentUser.following.filter(
			(id) => id.toString() !== userToUnfollow._id?.toString()
		);
		userToUnfollow.followers = userToUnfollow.followers.filter(
			(id) => id.toString() !== currentUser._id?.toString()
		);

		await currentUser.save();
		await userToUnfollow.save();

		res.json({ message: "User unfollowed successfully" });
	} catch (error) {
		console.error("Error unfollowing user:", error);
		res.status(500).json({ message: "Server error" });
	}
});

// ユーザーの投稿を取得
router.get("/:id/posts", auth, async (req: AuthRequest, res: Response) => {
	try {
		const posts = await Post.find({ author: req.params.id })
			.sort({ createdAt: -1 })
			.populate("author", "username");
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/recommended", auth, async (req: AuthRequest, res) => {
	try {
		const currentUser = await User.findById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		const recommendedUsers = await User.aggregate([
			{ $match: { _id: { $ne: currentUser._id } } },
			{ $sample: { size: 5 } },
			{ $project: { _id: 1, username: 1 } },
		]);

		res.json(recommendedUsers);
	} catch (error) {
		console.error("Error fetching recommended users:", error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
