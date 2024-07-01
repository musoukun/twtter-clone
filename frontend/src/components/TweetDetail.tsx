/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import ErrorMessage from "./ErrorMessage";
import Loading from "./LoadingComponent";

const TweetDetail: React.FC = () => {
	const { tweetId } = useParams<{
		username: string;
		tweetId: string;
	}>();
	const [tweet, setTweet] = useState<any>(null);
	const [isLiked, setIsLiked] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const currentUser = useRecoilValue(userState);
	const [loading, setLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTweet = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/tweets/${tweetId}`
				);
				setTweet(response.data);
				setIsLiked(response.data.likes.includes(currentUser?.id));
			} catch (error) {
				console.error("Error fetching tweet:", error);
				setError("Tweet could not be loaded. Please try again later.");
			}
		};
		fetchTweet();
	}, [tweetId, currentUser]);

	const handleReply = async () => {
		try {
			const response = await axios.post(
				`http://localhost:5000/api/tweets/${tweetId}/reply`,
				{
					content: replyContent,
				}
			);
			setReplyContent("");
			// リプライを追加した後にツイートを更新
			setTweet({
				...tweet,
				replies: [...tweet.replies, response.data],
			});
		} catch (error) {
			console.error("Error replying to tweet:", error);
		}
	};

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} />;
	if (!tweet) return null;

	return (
		<div className="bg-twitter-dark text-twitter-light p-4">
			{/* ... 他の要素 ... */}
			<div className="mt-6">
				<textarea
					value={replyContent}
					onChange={(e) => setReplyContent(e.target.value)}
					placeholder="返信を入力"
					className="w-full p-2 bg-twitter-dark border border-gray-700 rounded-lg focus:outline-none focus:border-twitter-blue"
					rows={3}
				/>
				<button
					onClick={handleReply}
					className="mt-2 px-4 py-2 bg-twitter-blue text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
				>
					返信
				</button>
			</div>
			{/* リプライ一覧を表示 */}
			<div className="mt-6">
				<h3 className="text-xl font-bold mb-4">Replies</h3>
				{tweet.replies.map((reply: any) => (
					<div
						key={reply._id}
						className="border-t border-gray-700 py-4"
					>
						<p className="font-bold">{reply.author.username}</p>
						<p>{reply.content}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default TweetDetail;
