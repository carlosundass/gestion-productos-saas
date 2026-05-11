/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qnsv: {
          bg: '#F8F9FB',
          blue: '#2563eb',
          gray: '#F4F6F8',
        }
      },
      borderRadius: {
        'qnsv': '2.5rem',
      }
    },
  },
  plugins: [],
}