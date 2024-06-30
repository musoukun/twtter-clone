import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./components/Registar";

const App: React.FC = () => {
	return (
		<RecoilRoot>
			<Router>
				<div className="min-h-screen bg-gray-100">
					<Header />
					<main className="container mx-auto px-4 py-8">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/profile/:userId"
								element={<Profile />}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</Routes>
					</main>
				</div>
			</Router>
		</RecoilRoot>
	);
};

export default App;
