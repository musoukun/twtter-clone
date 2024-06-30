/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";

interface SearchResult {
	users: any[];
	tweets: any[];
}

const Search: React.FC = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult>({
		users: [],
		tweets: [],
	});
	const navigate = useNavigate();

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`http://localhost:5000/api/search?query=${query}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setResults(response.data.data);
		} catch (error) {
			console.error("Error searching:", error);
			setResults({ users: [], tweets: [] }); // エラー時は空の結果をセット
		}
	};

	return (
		<div>
			<form onSubmit={handleSearch} className="mb-4">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search users or tweets..."
					className="w-full p-2 border rounded"
				/>
				<button
					type="submit"
					className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Search
				</button>
			</form>
			<div className="mb-4">
				<h2 className="text-xl font-bold">Users</h2>
				{results.users && results.users.length > 0 ? (
					results.users.map((user) => (
						<div key={user._id} className="mb-2">
							<span
								className="cursor-pointer text-blue-500 hover:underline"
								onClick={() => navigate(`/profile/${user._id}`)}
							>
								{user.username}
							</span>
						</div>
					))
				) : (
					<p>No users found</p>
				)}
			</div>
			<div>
				<h2 className="text-xl font-bold">Tweets</h2>
				{results.tweets && results.tweets.length > 0 ? (
					results.tweets.map((tweet) => (
						<Post key={tweet._id} post={tweet} />
					))
				) : (
					<p>No tweets found</p>
				)}
			</div>
		</div>
	);
};

export default Search;
