/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // If you're using React
    './public/index.html',         // If you're using standard HTML
    '*.html',
  ],
  theme: {
    extend: {
      backgroundImage:{
        'login-bg':"url('/medical_background_image.jpg')",
      },
      boxShadow: {
        'red-inner': 'inset 0 0 6px -1px rgba(255, 0, 0, 0.5)',
        'red-outer': ' 0 0 6px -1px rgba(255, 0, 0, 0.5)',
        'green-inner': 'inset 0 0 6px -1px rgba(0, 255, 0, 0.5)',
        'green-outer': ' 0 0 6px -1px rgba(0, 255, 0, 0.8)',
        'blue-inner': 'inset 0 0 6px -1px rgba(0, 0, 255, 0.5)',
        'blue-outer': ' 0 0 6px -1px rgba(0, 0, 255, 0.8)',
      },
      animation: {
        blink: "blink 3s infinite", // Increase duration to 2s
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: 1 },   // Fully visible for 40% of the time
          "57%": { opacity: 0.5 },     // Start fading out
          "65%": { opacity: 0.3 },     // Start fading out
          "69%": { opacity: 0.2 },     // Start fading out
          "72%": { opacity: 0.1 },     // Start fading out
          "75%": { opacity: 0 },      // Fully invisible
          "90%": { opacity: 0.3 },     // Start fading out
          "93%": { opacity: 0.5 },     // Start fading out
          "100%": { opacity: 1 },      // Fully invisible
        },
      },
    },
  },
  plugins: [],
}

