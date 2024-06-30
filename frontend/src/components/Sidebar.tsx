// Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBell, FaSearch } from "react-icons/fa";
import ProfileCard from "./ProfileCard";

const Sidebar: React.FC = () => {
	return (
		<div className="w-64 h-screen bg-white border-r flex flex-col justify-between">
			<div>
				<div className="p-4">
					<h1 className="text-2xl font-bold">X Clone</h1>
				</div>
				<nav>
					<Link
						to="/"
						className="flex items-center p-4 hover:bg-gray-100"
					>
						<FaHome className="mr-4" />
						ホーム
					</Link>
					<Link
						to="/notifications"
						className="flex items-center p-4 hover:bg-gray-100"
					>
						<FaBell className="mr-4" />
						通知
					</Link>
					<Link
						to="/search"
						className="flex items-center p-4 hover:bg-gray-100"
					>
						<FaSearch className="mr-4" />
						話題を検索
					</Link>
				</nav>
			</div>
			<ProfileCard />
		</div>
	);
};

export default Sidebar;
