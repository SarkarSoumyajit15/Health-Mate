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
    },
  },
  plugins: [],
}

