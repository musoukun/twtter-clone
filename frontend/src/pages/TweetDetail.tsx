/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TweetMenu from "../components/TweetMenu";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { getCurrentUser } from "../services/authService"; // getCurrentUser をインポート

const TweetDetail: React.FC = () => {
	const { tweetId } = useParams<{
		username: string;
		tweetId: string;
	}>();
	const [tweet, setTweet] = useState<any>(null);
	const [isLiked, setIsLiked] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const setUser = useSetRecoilState(userState);
	const currentUser = useRecoilValue(userState);

	useEffect(() => {
		const fetchUser = async () => {
			const currentUser = await getCurrentUser();
			if (currentUser) {
				setUser(currentUser as any);
			}
		};

		fetchUser();
	}, [setUser]);

	useEffect(() => {
		const fetchTweet = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/posts/${tweetId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				// ポピュレートされたデータを設定
				setTweet(response.data.post);
				setIsLiked(response.data.likes.includes(currentUser?.id));
			} catch (error) {
				console.error("Error fetching tweet:", error);
			}
		};
		fetchTweet();
	}, [tweetId, currentUser]);

	const handleLike = async () => {
		try {
			const response = await axios.post(
				`http://localhost:5000/api/posts/${tweetId}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setIsLiked(!isLiked);
			setTweet((prevTweet: any) => ({
				...prevTweet,
				likes: response.data.likes,
			}));
		} catch (error) {
			console.error("Error liking tweet:", error);
		}
	};

	const handleReply = async () => {
		try {
			const response = await axios.post(
				`http://localhost:5000/api/posts/${tweetId}/reply`,
				{ content: replyContent },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setReplyContent("");
			setTweet((prevTweet: any) => ({
				...prevTweet,
				replies: [...prevTweet.replies, response.data],
			}));
		} catch (error) {
			console.error("Error replying to tweet:", error);
		}
	};

	if (!tweet) return <div>Loading...</div>;

	return (
		<div className="bg-white text-black p-4">
			<div className="flex justify-between items-center mb-4">
				<Link
					to={`/${tweet.author.username}`}
					className="flex items-center"
				>
					<img
						src={`http://localhost:5000${tweet.author.avatar ?? "/default-avatar.png"}`}
						alt={tweet.author.username}
						className="w-12 h-12 rounded-full mr-3"
					/>
					<span className="font-bold">{tweet.author.username}</span>
				</Link>
				<TweetMenu tweetId={tweet._id} authorId={tweet.author._id} />
			</div>
			<p className="text-xl mb-4">{tweet.content}</p>
			<div className="flex items-center space-x-4">
				<button
					onClick={handleLike}
					className={`flex items-center space-x-1 transition-colors duration-200 ${
						isLiked
							? "text-red-500"
							: "text-gray-400 hover:text-red-500"
					}`}
				>
					<svg
						className="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
							clipRule="evenodd"
						/>
					</svg>
					<span>{tweet.likes.length}</span>
				</button>
			</div>
			<div className="mt-6">
				<div className="flex items-center mb-4">
					<img
						src={`http://localhost:5000${currentUser?.avatar ?? "/default-avatar.png"}`}
						alt="Avatar"
						className="w-8 h-8 rounded-full mr-3"
					/>
					<textarea
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						placeholder="返信を入力"
						className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						rows={3}
					/>
				</div>
				<button
					onClick={handleReply}
					className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
				>
					返信
				</button>
			</div>
			<div className="mt-4">
				{tweet.replies.map((reply: any) => (
					<div
						key={reply._id}
						className="border-t border-gray-200 pt-4 mt-4"
					>
						<div className="flex items-center mb-2">
							<Link
								to={`/${reply.author.username}`}
								className="flex items-center"
							>
								<img
									src={`http://localhost:5000${reply.author.avatar ?? "/default-avatar.png"}`}
									alt={reply.author.username}
									className="w-8 h-8 rounded-full mr-2"
								/>
								<span className="font-bold">
									{reply.author.username}
								</span>
							</Link>
						</div>
						<p>{reply.content}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default TweetDetail;
