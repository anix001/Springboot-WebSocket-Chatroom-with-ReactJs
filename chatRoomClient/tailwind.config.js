/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
		fontSize: {
			xs: '.75rem',
			sm: '.875rem',
			tiny: '.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '4rem',
			'7xl': '5rem',
		},
		colors: {
			...colors,
			primary: {
				700: '#3f3fca',
				500: '#218BE5',
				100: '#9f9fe5',
			},
			indigo: {
				700: '#4338ca',
				400: '#818cf8',
				100: '#e0e7ff',
			},
			slate: {
				700: '#334155',
				600: '#475569',
				400:'#94a3b8',
				300: '#cbd5e1',
				100: '#f1f5f9',
			},
			red: {
				700: '#b91c1c',
				600: '#dc2626',
			},
			green: {
				700: '#15803d',
				500: '#10b981',
				100: '#d1fae5',
			},
		},
		extend: {
			height: {
				1: '1rem',
				2: '2rem',
				10: '10rem',
				15: '15rem',
				50: '50rem',
			},
		},
		spacing: {
			xs: '8px',
			sm: '16px',
			md: '24px',
			lg: '32px',
			xl: '48px',
			xxl: '64px',
		},
		screens: {
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
	},
	variants: {
		extend: {},
	},
  plugins: [],
}