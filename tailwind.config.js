/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F7FA',
        ink: '#0F172A',
        panel: '#FFFFFF',
        accent: '#0EA5E9',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
