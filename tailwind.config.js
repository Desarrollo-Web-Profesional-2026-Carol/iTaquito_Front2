/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rosa': '#D9736A',
        'naranja': '#D47A4A',
        'amarillo': '#D1AB5C',
        'turquesa': '#6A9C89',
        'morado': '#8E7B9D',
        'blanco': '#FAF6F0',
        'oscuro': '#4A3F35',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}