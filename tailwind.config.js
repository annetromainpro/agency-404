/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          mmi: {
            dark: '#16213e',
            accent: '#0f3460',
            red: '#e94560',
            green: '#2ecc71',
            yellow: '#f1c40f'
          }
        }
      },
    },
    plugins: [],
  }