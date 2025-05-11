module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',    
  ],
  theme: {
    extend: {
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        popIn: 'popIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};