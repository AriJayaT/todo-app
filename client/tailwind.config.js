// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9333ea', // purple-600
          DEFAULT: '#7e22ce', // purple-700
          dark: '#6b21a8', // purple-800
        },
        secondary: {
          light: '#1f2937', // gray-800
          DEFAULT: '#111827', // gray-900
          dark: '#030712', // gray-950
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}