import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/users";
import searchRoutes from "./routes/search";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // フロントエンドのURL
		methods: ["GET", "POST"],
	},
});

app.use(cors());
app.use(express.json());

// MongoDB接続
mongoose
	.connect(
		process.env.MONGODB_URI ||
			"mongodb://root:example@localhost:27017/twitter_clone?authSource=admin"
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// ルーティング
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes); // この行が追加されていることを確認

// WebSocket接続
io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});

	// 新しい投稿があったときのイベント
	socket.on("newPost", (post) => {
		io.emit("newPost", post);
	});

	// 新しいコメントがあったときのイベント
	socket.on("newComment", (comment) => {
		io.emit("newComment", comment);
	});
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
