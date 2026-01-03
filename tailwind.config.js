/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        premium: {
          navy: '#0a192f',
          gold: '#c5a059',
          green: '#10b981',
          slate: '#ccd6f6'
        }
      }
    },
  },
  plugins: [],
}