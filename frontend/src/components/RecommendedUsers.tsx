import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
	_id: string;
	username: string;
}

const RecommendedUsers: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRecommendedUsers = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/users/recommended",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setUsers(response.data);
			} catch (error) {
				console.error("Error fetching recommended users:", error);
			}
		};

		fetchRecommendedUsers();
	}, []);

	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<h2 className="text-xl font-bold mb-4">Recommended Users</h2>
			<ul>
				{users.map((user) => (
					<li key={user._id} className="mb-2">
						<span
							className="cursor-pointer hover:underline"
							onClick={() => navigate(`/profile/${user._id}`)}
						>
							{user.username}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecommendedUsers;
