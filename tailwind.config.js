/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        centra: ['var(--font-centra)']
      },
      colors: {
        primary: {
          50: '#e5fff8',
          100: '#b3ffe9',
          200: '#80ffda',
          300: '#80ffda',
          400: '#1affbc',
          500: '#00e6a3',
          600: '#00b37f',
          700: '#00805a',
          800: '#00805a',
          900: '#00805a'
        },
        secondary: '#004AAD'
      }
    }
  },
  plugins: []
}
