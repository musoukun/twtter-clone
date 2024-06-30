import React, { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";

const PostForm: React.FC = () => {
	const [content, setContent] = useState("");
	const setPosts = useSetRecoilState(postsState);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No token found");
			}
			const res = await axios.post(
				"http://localhost:5000/api/posts",
				{ content },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setPosts((prevPosts) => [res.data, ...prevPosts]);
			setContent("");
		} catch (error) {
			console.error("Error creating post:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4">
			<textarea
				className="w-full p-2 border rounded"
				rows={3}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="What's happening?"
			/>
			<button
				type="submit"
				className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				Post
			</button>
		</form>
	);
};

export default PostForm;
