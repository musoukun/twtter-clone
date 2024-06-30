import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";

const Header: React.FC = () => {
	const user = useRecoilValue(userState);
	const setUser = useSetRecoilState(userState);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<header className="bg-blue-500 text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-2xl font-bold">
					X Clone
				</Link>
				<nav>
					{user ? (
						<>
							<Link to="/" className="mr-4">
								Home
							</Link>
							<Link to={`/profile/${user.id}`} className="mr-4">
								Profile
							</Link>
							<button onClick={handleLogout}>Logout</button>
						</>
					) : (
						<>
							<Link to="/login" className="mr-4">
								Login
							</Link>
							<Link to="/register">Register</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
