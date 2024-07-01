/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import axios from "axios";

interface TweetMenuProps {
	tweetId: string | undefined;
	authorId: string;
}

const TweetMenu: React.FC<TweetMenuProps> = ({ tweetId, authorId }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const currentUser = useRecoilValue(userState);
	const setUser = useSetRecoilState(userState);

	const handleFollow = async () => {
		try {
			const response = await axios.post(
				`http://localhost:5000/api/users/${authorId}/follow`
			);
			// setUser(response.data);
		} catch (error) {
			console.error("Error following/unfollowing user:", error);
		}
	};

	return (
		<div className="tweet-menu">
			<button
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className="menu-button"
			>
				⋯
			</button>
			{isMenuOpen && (
				<div className="menu-dropdown">
					{currentUser?.following.includes(authorId) ? (
						<button onClick={handleFollow}>フォロー解除</button>
					) : (
						<button onClick={handleFollow}>フォローする</button>
					)}
					{/* Add other menu items as needed */}
				</div>
			)}
		</div>
	);
};

export default TweetMenu;
