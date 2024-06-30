import express from "express";
import { auth, AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Post from "../models/Post";

const router = express.Router();

router.get("/", auth, async (req: AuthRequest, res) => {
	try {
		const { query } = req.query;
		if (typeof query !== "string") {
			return res
				.status(400)
				.json({ success: false, message: "Invalid query" });
		}

		const users = await User.find({
			username: { $regex: query, $options: "i" },
		}).select("username _id");

		const posts = await Post.find({
			content: { $regex: query, $options: "i" },
		})
			.populate("author", "username")
			.limit(10);

		res.json({ success: true, data: { users, posts } });
	} catch (error) {
		console.error("Error searching:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

export default router;
