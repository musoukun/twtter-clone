import React from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PostProps {
	post: {
		_id: string;
		content: string;
		author: {
			_id: string;
			username: string;
		};
		likes: string[];
		comments: {
			_id: string;
			content: string;
			author: {
				_id: string;
				username: string;
			};
		}[];
	};
}

const Post: React.FC<PostProps> = ({ post }) => {
	const setPosts = useSetRecoilState(postsState);
	const [isLiked, setIsLiked] = React.useState(false);
	const navigate = useNavigate();

	React.useEffect(() => {
		const userId = localStorage.getItem("userId");
		setIsLiked(post.likes.includes(userId || ""));
	}, [post.likes]);

	const handleLike = async () => {
		try {
			const res = await axios.post(
				`http://localhost:5000/api/posts/${post._id}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setPosts((prevPosts) =>
				prevPosts.map((p) => (p._id === post._id ? res.data : p))
			);
			setIsLiked(!isLiked);
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	return (
		<div className="border p-4 mb-4 rounded">
			<p
				className="font-bold cursor-pointer hover:underline"
				onClick={() => navigate(`/profile/${post.author._id}`)}
			>
				{post.author.username}
			</p>
			<p>{post.content}</p>
			<div className="mt-2">
				<motion.button
					onClick={handleLike}
					className={`mr-2 text-2xl ${isLiked ? "text-red-500" : "text-gray-500"}`}
					whileTap={{ scale: 0.9 }}
					aria-label={isLiked ? "Unlike post" : "Like post"}
				>
					<motion.span
						initial={{ scale: 1 }}
						animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
						transition={{ duration: 0.3 }}
					>
						❤
					</motion.span>
				</motion.button>
				<span>{post.likes.length}</span>
				<span className="ml-4">Comments: {post.comments.length}</span>
			</div>
		</div>
	);
};

export default Post;
