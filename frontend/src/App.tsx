/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userState } from "./atoms/userAtom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import { getCurrentUser } from "./services/authService";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

const InitializeUser = () => {
	const setUser = useSetRecoilState(userState);

	useEffect(() => {
		const user = getCurrentUser();
		if (user) {
			setUser(user as any);
		}
	}, [setUser]);

	return null;
};

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
			<InitializeUser />
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
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
			<ToastContainer position="bottom-right" autoClose={3000} />
		</RecoilRoot>
	);
};

export default App;
