import React from "react";

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-4">
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
