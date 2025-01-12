/** @type {import('tailwindcss').Config} */
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {
          colors: {
            'neon-blue': '#00FFFF',
            'neon-green': '#00FF00',
            'neon-pink': '#FF00FF',
            'neon-red': '#FF0000',
            'neon-yellow': '#FFFF00',
            'neon-purple': '#8A2BE2',
            'dark-bg': '#000000',
          },
          fontFamily: {
            cyber: ['Orbitron', 'sans-serif'],
          },
        },
      },
      plugins: [],
    };
