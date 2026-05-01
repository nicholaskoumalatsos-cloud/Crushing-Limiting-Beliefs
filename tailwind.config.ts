import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0A',
          900: '#171717',
          800: '#1F1F1F',
          700: '#2A2A2A',
        },
        bone: {
          DEFAULT: '#E5E5E5',
          muted: '#A3A3A3',
        },
        accent: {
          DEFAULT: '#A4161A',
          hover: '#BA181B',
          deep: '#660708',
        },
      },
      fontFamily: {
        display: ['Oswald', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
