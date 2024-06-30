import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.header("Authorization");
	console.log("Auth Header:", authHeader); // デバッグログ

	const token = authHeader && authHeader.split(" ")[1];
	console.log("Extracted Token:", token); // デバッグログ

	if (!token) {
		return res
			.status(401)
			.json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your_jwt_secret"
		) as { userId: string };
		console.log("Decoded Token:", decoded); // デバッグログ
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.error("Token verification failed:", error);
		res.status(401).json({ message: "Token is not valid" });
	}
};
