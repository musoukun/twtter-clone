/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";

import "react-toastify/dist/ReactToastify.css";
import TweetDetail from "./pages/TweetDetail";
// import axios from "axios";

// axios.interceptors.request.use(
// 	(config) => {
// 		const token = localStorage.getItem("token");
// 		if (token) {
// 			config.headers["Authorization"] = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

const App: React.FC = () => {
	return (
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<RootLayout />}>
						<Route index element={<Home />} />
						<Route path="profile/:userId" element={<Profile />} />
						<Route path="search" element={<Search />} />
						<Route
							path="notifications"
							element={<Notifications />}
						/>
						<Route
							path="tweet/:tweetId"
							element={<TweetDetail />}
						/>{" "}
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</RecoilRoot>
	);
};

export default App;
