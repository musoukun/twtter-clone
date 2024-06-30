// ProfileCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { logout } from "../services/authService";

const ProfileCard: React.FC = () => {
	const user = useRecoilValue(userState);
	const setUser = useSetRecoilState(userState);
	const navigate = useNavigate();
	const [showLogout, setShowLogout] = useState(false);

	const handleLogout = () => {
		if (window.confirm("ログアウトしますか？")) {
			logout();
			setUser(null);
			navigate("/login");
		}
	};

	return (
		<div className="relative p-4">
			<div
				className="flex items-center cursor-pointer"
				onClick={() => setShowLogout(!showLogout)}
			>
				<img
					src={user?.avatar ?? "/default-avatar.png"}
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
				</div>
			)}
		</div>
	);
};

export default ProfileCard;
