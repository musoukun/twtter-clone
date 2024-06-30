import React, { useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { postsState } from "../atoms/userAtom";
import Post from "./Post";

const PostList: React.FC = () => {
	const [posts, setPosts] = useRecoilState(postsState);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await axios.get("http://localhost:5000/api/posts");
				setPosts(res.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};
		fetchPosts();
	}, [setPosts]);

	return (
		<div>
			{posts.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	);
};

export default PostList;
