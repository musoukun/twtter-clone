/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { logout } from "../services/authService";
import axios from "axios";

const ProfileCard: React.FC = () => {
	const [user, setUser] = useRecoilState(userState);
	const navigate = useNavigate();
	const [showLogout, setShowLogout] = useState(false);
	const [showAvatarUpload, setShowAvatarUpload] = useState(false);
	const [avatar, setAvatar] = useState<File | null>(null);

	const handleLogout = () => {
		if (window.confirm("ログアウトしますか？")) {
			logout();
			setUser(null);
			navigate("/login");
		}
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setAvatar(e.target.files[0]);
		}
	};

	const handleAvatarUpload = async () => {
		if (!avatar) return;

		const formData = new FormData();
		formData.append("avatar", avatar);

		try {
			const res = await axios.post(
				"http://localhost:5000/api/users/me/avatar",
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setUser((user: any) => {
				return {
					...user,
					avatar: res.data.avatar,
				};
			});
			setShowAvatarUpload(false);
		} catch (error) {
			console.error("Error uploading avatar:", error);
		}
	};

	return (
		<div className="relative p-4">
			<div
				className="flex items-center cursor-pointer"
				onClick={() => setShowLogout(!showLogout)}
			>
				<img
					src={`http://localhost:5000${user?.avatar ?? "/default-avatar.png"}`} // フルURLを使用
					alt="Avatar"
					className="w-10 h-10 rounded-full mr-2"
				/>
				<div>
					<p className="font-bold">{user?.username}</p>
				</div>
			</div>
			{showLogout && (
				<div className="absolute left-0 bottom-0 bg-white shadow-md p-2 mt-2 rounded">
					<button
						onClick={handleLogout}
						className="w-full text-left text-red-500"
					>
						ログアウト
					</button>
					<button
						onClick={() => setShowAvatarUpload(!showAvatarUpload)}
						className="w-full text-left text-blue-500 mt-2"
					>
						アイコン画像を変更
					</button>
				</div>
			)}
			{showAvatarUpload && (
				<div className="absolute left-0 bottom-0 bg-white shadow-md p-4 mt-2 rounded w-64">
					<input
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="mb-2"
					/>
					<button
						onClick={handleAvatarUpload}
						className="w-full text-left bg-blue-500 text-white p-2 rounded"
					>
						アップロード
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileCard;
