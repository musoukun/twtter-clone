/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";

interface Tweet {
	_id: string;
	content: string;
	author: {
		_id: string;
		username: string;
	};
	likes: string[];
	comments: any[];
}

interface Mention {
	_id: string;
	content: string;
	author: {
		_id: string;
		username: string;
	};
}

const TweetDetail: React.FC = () => {
	const { tweetId } = useParams<{ tweetId: string }>();
	const [tweet, setTweet] = useState<Tweet | null>(null);
	const [mentions, setMentions] = useState<Mention[]>([]);

	useEffect(() => {
		const fetchTweet = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`http://localhost:5000/api/tweets/${tweetId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setTweet(response.data);
			} catch (error) {
				console.error("Error fetching tweet:", error);
			}
		};

		const fetchMentions = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`http://localhost:5000/api/tweets/${tweetId}/mentions`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setMentions(response.data);
			} catch (error) {
				console.error("Error fetching mentions:", error);
			}
		};

		fetchTweet();
		fetchMentions();
	}, [tweetId]);

	if (!tweet) return <div>Loading...</div>;

	return (
		<div>
			<Post post={tweet} />
			<h2 className="text-xl font-bold mt-4">Mentions</h2>
			{mentions.map((mention) => (
				<div key={mention._id} className="border-t p-4">
					<p>{mention.content}</p>
					<p className="text-sm text-gray-500">
						by {mention.author.username}
					</p>
				</div>
			))}
		</div>
	);
};

export default TweetDetail;
