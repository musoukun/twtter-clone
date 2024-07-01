import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { auth } from "../middleware/auth";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

const JWT_SECRET =
	"97f70a0c030394ecb183c4e92443c55d57d7dfd0dba67e895df6171d1cb3557c";

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

interface AuthRequest extends Request {
	userId?: string;
}

router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		let user = await User.findOne({ $or: [{ email }, { username }] });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}
		user = new User({ username, email, password, following: [] });
		await user.save();
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});
		res.status(201).json({
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				following: user.following,
			},
		});
	} catch (error: any) {
		console.error("Registration error:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});
		res.json({
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				following: user.following,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/me", auth, async (req: AuthRequest, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json({
			id: user._id,
			username: user.username,
			email: user.email,
			following: user.following,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
