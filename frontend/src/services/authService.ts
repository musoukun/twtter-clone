/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/auth";

interface User {
	id: string;
	username: string;
	email: string;
}

interface DecodedToken {
	userId: string;
	exp: number;
}

export const setAuthToken = (token: string | null) => {
	if (token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		localStorage.setItem("token", token);
	} else {
		delete axios.defaults.headers.common["Authorization"];
		localStorage.removeItem("token");
	}
};

export const register = async (
	username: string,
	email: string,
	password: string
): Promise<User> => {
	try {
		const response = await axios.post(`${API_URL}/register`, {
			username,
			email,
			password,
		});
		const { token, user } = response.data;
		setAuthToken(token);
		return user;
	} catch (error: any) {
		throw error.response?.data || error.message;
	}
};

export const login = async (email: string, password: string): Promise<User> => {
	try {
		const response = await axios.post(`${API_URL}/login`, {
			email,
			password,
		});
		const { token, user } = response.data;
		setAuthToken(token);
		return user;
	} catch (error: any) {
		throw error.response?.data || error.message;
	}
};

export const logout = () => {
	setAuthToken(null);
};

export const getCurrentUser = (): User | null => {
	const token = localStorage.getItem("token");
	if (token) {
		try {
			const decodedToken = jwtDecode<DecodedToken>(token);
			if (decodedToken.exp * 1000 < Date.now()) {
				logout();
				return null;
			}
			return { id: decodedToken.userId, username: "", email: "" };
		} catch (error) {
			console.error("Error decoding token:", error);
			return null;
		}
	}
	return null;
};

export const isAuthenticated = (): boolean => {
	const user = getCurrentUser();
	return !!user;
};

// Axiosインターセプターの設定
axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			logout();
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);
