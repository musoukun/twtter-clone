/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				"twitter-blue": "#1da1f2",
				"twitter-dark": "#15202b",
				"twitter-light": "#ffffff",
			},
			fontFamily: {
				twitter: [
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
