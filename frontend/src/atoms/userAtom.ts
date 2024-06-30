/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "recoil";

export interface User {
	id: string;
	username: string;
	email: string;
	profilePicture?: string;
	following: string[];
}

export const userState = atom<User | null>({
	key: "userState",
	default: null,
});

export const postsState = atom<any[]>({
	key: "postsState",
	default: [],
});
