export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        taxo: {
          dark: '#061B30',
          navy: '#0B2A4A',
          royal: '#123F6D',
          blue: '#245F97',
          bright: '#35A0D5',
          light: '#C3E1F5',
          pale: '#EAF6FC',
          gold: '#D4AF37',
          darkGold: '#A77B18'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(53,160,213,.22)',
        gold: '0 0 30px rgba(212,175,55,.18)'
      }
    }
  },
  plugins: []
};
