/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { postsState, userState } from "../atoms/userAtom";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";
import { Navigate, useNavigate } from "react-router-dom";
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
	const posts = useRecoilValue(postsState) || [];
	const navigate = useNavigate();
	const setUser = useSetRecoilState(userState);

	useEffect(() => {
		const fetchPosts = async () => {
			const currentUser = await getCurrentUser();
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

		const getUser = async () => {
			const user = await getCurrentUser();
			if (user) {
				setUser(user as any);
				console.log("avatar: " + user.avatar);
				console.log("user: " + user);
			}
		};

		getUser();
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
					<div
						key={post._id}
						onClick={() => navigate(`/tweet/${post._id}`)}
					>
						<Post post={post} />
					</div>
				))}
			</div>
			<div className="w-1/4">
				<RecommendedUsers />
			</div>
		</div>
	);
};

export default Home;
