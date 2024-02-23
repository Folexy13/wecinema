/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.html", "./src/**/*.js", "./src/**/*.ts"],
	theme: {
		extend: {},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities(
				{
					".hide-scrollbar::-webkit-scrollbar": {
						display: "none",
					},
				},
				["responsive", "hover"]
			);
		},
	],
};
