/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- 1. THE MEASURE: ELITE TYPOGRAPHY ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], 
      },
      
      // --- 2. THE FLOW: BRAND ARCHITECTURE ---
      colors: {
        brand: {
          primary: '#002855',   // REX360 Deep Navy
          accent: '#00C853',    // REX360 Green
          hover: '#00963F',     // Success State
          ghost: '#F0F4F8',     // Substrate Color
          ink: '#64748B',      // Metadata Gray
        }
      },

      // --- 3. THE DENSITY: NON-SCANTY UTILITIES ---
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem', // For the 'Elite' card feel
      },

      boxShadow: {
        'pro': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(0, 200, 83, 0.2)', // The 'Flow' Glow
      },

      letterSpacing: {
        tightest: '-0.05em', // For bold, professional headers
        widest: '0.4em',    // For tiny, premium labels
      },

      // --- 4. THE KINETICS: SMOOTH MOTION ---
      transitionDuration: {
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.19, 1, 0.22, 1)', // High-end 'Flow' feel
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For the professional blog layout
  ],
}