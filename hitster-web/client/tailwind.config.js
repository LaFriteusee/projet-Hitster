/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hitster: {
          purple: '#6B21A8',
          pink: '#EC4899',
          yellow: '#FBBF24',
        },
      },
    },
  },
  plugins: [],
};
