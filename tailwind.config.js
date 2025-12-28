/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], 
      },
      // NEW COLOR PALETTE: White, Green, Blue
      colors: {
        theme: {
          blue: '#002855',    // Deep Navy (Headers, Dark Text)
          green: '#00C853',   // Vibrant Green (Buttons, Highlights)
          greenDark: '#00963F', // Darker green for hover states
          white: '#ffffff',   // Pure White
          light: '#F0F4F8',   // Light Gray-Blue Background
          gray: '#64748b'     // Subtitle text
        }
      }
    },
  },
  plugins: [],
}