module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0616',
        neon: {
          purple: '#8c1eff',
          pink: '#ff2975',
          orange: '#ff901f',
          yellow: '#ffd319',
          magenta: '#f222ff',
        },
      },
      fontFamily: {
        display: ['"Road Rage"', 'cursive'],
        accent: ['"Bungee"', '"Road Rage"', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(140, 30, 255, 0.6)',
      },
    },
  },
  plugins: [],
}
