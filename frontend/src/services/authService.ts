import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = async (
	username: string,
	email: string,
	password: string
) => {
	const response = await axios.post(`${API_URL}/register`, {
		username,
		email,
		password,
	});
	if (response.data.token) {
		localStorage.setItem("token", response.data.token);
	}
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await axios.post(`${API_URL}/login`, { email, password });
	if (response.data.token) {
		localStorage.setItem("token", response.data.token);
	}
	return response.data;
};

export const logout = () => {
	localStorage.removeItem("token");
};

export const getCurrentUser = () => {
	const token = localStorage.getItem("token");
	if (token) {
		// ここでトークンをデコードしてユーザー情報を取得することもできます
		return { token };
	}
	return null;
};
