import React, { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";
import PostForm from "../components/PostForm";
import Post from "../components/Post";
import RecommendedUsers from "../components/RecommendedUsers";
import Header from "../components/Header";

const Home: React.FC = () => {
	const [posts, setPosts] = useRecoilState(postsState);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/posts/timeline",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setPosts(response.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchPosts();
	}, [setPosts]);

	return (
		<div className="flex">
			<div className="w-3/4 pr-4">
				<h1 className="text-2xl font-bold mb-4">Home</h1>

				{/* <Header /> */}
				<PostForm />
				{posts.map((post) => (
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
