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
          light: '#f8fafc',
          DEFAULT: '#0f172a',
          primary: '#3b82f6',
        },
        semaforo: {
          verde: '#22c55e',
          amarillo: '#eab308',
          rojo: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}