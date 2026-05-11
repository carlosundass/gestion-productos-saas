/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6',
          dark: '#0f172a',
          light: '#f8fafc'
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}