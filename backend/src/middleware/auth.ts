import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
	"97f70a0c030394ecb183c4e92443c55d57d7dfd0dba67e895df6171d1cb3557c";

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface AuthRequest extends Request {
	userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
	console.log("JWT_SECRET:", JWT_SECRET);
	const authHeader = req.header("Authorization");
	console.log("Auth Header:", authHeader);

	const token = authHeader && authHeader.split(" ")[1];
	console.log("Extracted Token:", token);

	if (!token) {
		return res
			.status(401)
			.json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
		console.log("Decoded Token:", decoded);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.error("Token verification failed:", error);
		if (error instanceof jwt.JsonWebTokenError) {
			console.log("JWT Error Name:", error.name);
			console.log("JWT Error Message:", error.message);
		}
		res.status(401).json({ message: "Token is not valid" });
	}
};
