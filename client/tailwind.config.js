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
        primary: '#9333EA',    // Purple
        'primary-dark': '#7E22CE', // Darker Purple
        'primary-light': '#A855F7', // Lighter Purple
        secondary: '#18181B',  // Dark Gray/Black
        'secondary-dark': '#09090B', // Darker Black
        'secondary-light': '#27272A', // Lighter Black
        accent: '#C084FC',     // Light Purple
        'accent-dark': '#A855F7', // Darker Light Purple
        'accent-light': '#D8B4FE', // Lighter Light Purple
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}