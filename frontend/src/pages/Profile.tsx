/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import Post from "../components/Post";

interface UserProfile {
	_id: string;
	username: string;
	email: string;
	followers: string[];
	following: string[];
}

interface UserPost {
	_id: string;
	content: string;
	author: {
		_id: string;
		username: string;
	};
	likes: string[];
	comments: any[];
}

const Profile: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const currentUser = useRecoilValue(userState);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [posts, setPosts] = useState<UserPost[]>([]);
	const [isFollowing, setIsFollowing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get(
					`http://localhost:5000/api/users/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setProfile(res.data);
				setIsFollowing(
					currentUser?.following?.includes(userId as any) || false
				);
			} catch (error) {
				console.error("Error fetching profile:", error);
				setError("Failed to load profile");
			}
		};

		const fetchPosts = async () => {
			try {
				const res = await axios.get(
					`http://localhost:5000/api/users/${userId}/posts`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setPosts(res.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
				setError("Failed to load posts");
			}
		};

		fetchProfile();
		fetchPosts();
	}, [userId, currentUser]);

	const handleFollow = async () => {
		try {
			const endpoint = isFollowing ? "unfollow" : "follow";
			await axios.post(
				`http://localhost:5000/api/users/${userId}/${endpoint}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setIsFollowing(!isFollowing);
			setProfile((prev) => {
				if (prev) {
					return {
						...prev,
						followers: isFollowing
							? prev.followers.filter(
									(id) => id !== currentUser?.id
								)
							: [...prev.followers, currentUser?.id].filter(
									(id): id is string => id !== undefined
								),
					};
				}
				return null;
			});
		} catch (error) {
			console.error("Error following/unfollowing user:", error);
			setError("Failed to follow/unfollow user");
		}
	};

	if (error) return <div className="text-red-500">{error}</div>;
	if (!profile) return <div>Loading...</div>;

	return (
		<div className="container mx-auto px-4">
			<div className="bg-white shadow rounded-lg p-6 mb-6">
				<h1 className="text-2xl font-bold mb-4">{profile.username}</h1>
				<p className="text-gray-600 mb-4">{profile.email}</p>
				<div className="flex space-x-4 mb-4">
					<span>Followers: {profile.followers.length}</span>
					<span>Following: {profile.following.length}</span>
				</div>
				{currentUser && currentUser.id !== userId && (
					<button
						onClick={handleFollow}
						className={`px-4 py-2 rounded ${isFollowing ? "bg-red-500" : "bg-blue-500"} text-white`}
					>
						{isFollowing ? "Unfollow" : "Follow"}
					</button>
				)}
			</div>
			<div>
				<h2 className="text-xl font-bold mb-4">Posts</h2>
				{posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</div>
		</div>
	);
};

export default Profile;
