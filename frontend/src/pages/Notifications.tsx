import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Notification {
	_id: string;
	type: "mention" | "like";
	from: {
		_id: string;
		username: string;
	};
	tweet: {
		_id: string;
		content: string;
	};
}

const Notifications: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/notifications",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setNotifications(response.data);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, []);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Notifications</h1>
			{notifications.map((notification) => (
				<div key={notification._id} className="border-b p-4">
					<p>
						<Link
							to={`/profile/${notification.from._id}`}
							className="font-bold hover:underline"
						>
							{notification.from.username}
						</Link>
						{notification.type === "mention"
							? " mentioned you"
							: " liked your tweet"}
					</p>
					<Link
						to={`/tweet/${notification.tweet._id}`}
						className="text-blue-500 hover:underline"
					>
						{notification.tweet.content}
					</Link>
				</div>
			))}
		</div>
	);
};

export default Notifications;
