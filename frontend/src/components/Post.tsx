import React from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";

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
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	return (
		<div className="border p-4 mb-4 rounded">
			<p className="font-bold">{post.author.username}</p>
			<p>{post.content}</p>
			<div className="mt-2">
				<button onClick={handleLike} className="mr-2 text-blue-500">
					Like ({post.likes.length})
				</button>
				<span>Comments: {post.comments.length}</span>
			</div>
		</div>
	);
};

export default Post;
