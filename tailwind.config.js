module.exports = {
	daisyui: {
		themes: ['garden'],
	},
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
};
