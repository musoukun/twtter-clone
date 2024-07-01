/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";
import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/authService";

interface PostType {
	_id: string;
	content: string;
	author: {
		_id: string;
		username: string;
	};
	likes: string[];
	replies: any[];
}

const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const setPosts = useSetRecoilState(postsState);
	const currentUser = getCurrentUser();
	const posts = useRecoilValue(postsState) || [];

	useEffect(() => {
		const fetchPosts = async () => {
			if (!currentUser) return;
			try {
				setLoading(true);
				const response = await axios.get(
					"http://localhost:5000/api/posts/timeline",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				console.log(response.data);
				setPosts(response.data);
			} catch (error: any) {
				console.error("Error fetching posts:", error);
				setError(
					error.response?.data?.message || "Failed to load posts"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (!isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="flex">
			<div className="w-3/4 pr-4">
				<h1 className="text-2xl font-bold mb-4">Home</h1>
				<PostForm />
				{posts.map((post: PostType) => (
					<Post key={post._id} post={post} />
				))}
			</div>
			<div className="w-1/4">
				<RecommendedUsers />
			</div>
		</div>
	);
};

export default Home;
