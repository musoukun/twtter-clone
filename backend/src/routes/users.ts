import express, { Request, Response } from "express";
import { auth } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

interface AuthRequest extends Request {
	userId?: string;
}

// Multer設定
const storage = multer.diskStorage({
	destination: function (
		req: any,
		file: any,
		cb: (error: Error | null, destination: string) => void
	) {
		cb(null, path.join(__dirname, "..", "uploads")); // 正しいパスを設定
	},
	filename: function (
		req: AuthRequest,
		file: { fieldname: string; originalname: any },
		cb: (error: Error | null, filename: string) => void
	) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extname = path.extname(file.originalname);
		const filename = `${req.userId}-${uniqueSuffix}${extname}`;
		cb(null, filename);
	},
});

const router = express.Router();

// 推奨ユーザーの取得
router.get("/recommended", auth, async (req: AuthRequest, res) => {
	try {
		if (!req.userId) {
			console.error("User ID not found in request");
			return res
				.status(401)
				.json({ message: "User ID not found in request" });
		}

		const currentUser = await User.findById(req.userId);
		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		console.log("Current User ID:", currentUser._id);

		const recommendedUsers = await User.aggregate([
			{
				$match: {
					_id: {
						$ne: new mongoose.Types.ObjectId(
							currentUser._id as any
						),
					},
				},
			},
			{ $sample: { size: 5 } },
			{ $project: { _id: 1, username: 1 } },
		]);

		console.log("Recommended Users:", recommendedUsers);

		res.json(recommendedUsers);
	} catch (error: any) {
		console.error("Error fetching recommended users:", error);
		res.status(500).json({
			message: "Server error",
			error: error.message,
			stack:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	}
});

// ユーザープロフィールの取得
router.get("/:id", auth, async (req: AuthRequest, res: Response) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		console.log("User:", user);
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
			(id: { toString: () => any }) =>
				id.toString() !== userToUnfollow._id?.toString()
		);
		userToUnfollow.followers = userToUnfollow.followers.filter(
			(id: { toString: () => any }) =>
				id.toString() !== currentUser._id?.toString()
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

const upload = multer({
	storage: storage,
	fileFilter: function (
		req: any,
		file: { originalname: any; mimetype: string },
		cb: multer.FileFilterCallback
	) {
		const fileTypes = /jpeg|jpg|png/;
		const extname = fileTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		const mimetype = fileTypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error("Images only!"));
		}
	},
});

// アイコンアップロードエンドポイント
router.post(
	"/me/avatar",
	auth,
	upload.single("avatar"),
	async (req: AuthRequest, res: Response) => {
		try {
			if (!req.userId) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			const user = await User.findById(req.userId);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			if (req.file) {
				user.avatar = `/uploads/${req.file.filename}`;
			}
			await user.save();
			res.json({ avatar: user.avatar });
		} catch (error) {
			res.status(500).json({ message: "Server error" });
		}
	}
);

export default router;
