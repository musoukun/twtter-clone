import React, { useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import TweetDetail from "./pages/TweetDetail";
import { userState } from "./atoms/userAtom";

const AppContent: React.FC = () => {
	const setUser = useSetRecoilState(userState);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await axios.get(
						"http://localhost:5000/api/auth/me",
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setUser(response.data);
				} catch (error) {
					console.error("Error fetching user:", error);
					localStorage.removeItem("token");
				}
			}
		};

		fetchUser();
	}, [setUser]);

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-4">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/profile/:userId" element={<Profile />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/search" element={<Search />} />
					<Route path="/notifications" element={<Notifications />} />
					<Route path="/tweet/:tweetId" element={<TweetDetail />} />
				</Routes>
			</main>
		</div>
	);
};

const App: React.FC = () => {
	return (
		<RecoilRoot>
			<Router>
				<AppContent />
			</Router>
		</RecoilRoot>
	);
};

export default App;
