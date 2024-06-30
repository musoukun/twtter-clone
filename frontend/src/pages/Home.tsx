import React from "react";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

const Home: React.FC = () => {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Home</h1>
			<PostForm />
			<PostList />
		</div>
	);
};

export default Home;
