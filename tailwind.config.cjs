/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				text: "#050505",
				background: "#fafafa",
				background2: "#f0f0f0",
				primary: "#40d6ba",
				secondary: "#deeded",
				accent: "#88702A",
	
				text_dark: "#fafafa",
				background_dark: "#050505",
				background2_dark: "#121212",
				primary_dark: "#40d6ba",
				secondary_dark: "#122121",
				accent_dark: "#88702A",
			},
			width: {
				94: "23.5rem",
				92: "23rem",
				88: "22rem",
				84: "21rem",
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
