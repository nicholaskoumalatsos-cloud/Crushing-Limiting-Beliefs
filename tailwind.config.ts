import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

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
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        manifesto: {
          css: {
            '--tw-prose-body': theme('colors.bone.DEFAULT'),
            '--tw-prose-headings': theme('colors.bone.DEFAULT'),
            '--tw-prose-lead': theme('colors.bone.DEFAULT'),
            '--tw-prose-links': theme('colors.accent.DEFAULT'),
            '--tw-prose-bold': theme('colors.bone.DEFAULT'),
            '--tw-prose-counters': theme('colors.bone.muted'),
            '--tw-prose-bullets': theme('colors.accent.DEFAULT'),
            '--tw-prose-hr': theme('colors.ink.800'),
            '--tw-prose-quotes': theme('colors.bone.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.accent.DEFAULT'),
            '--tw-prose-captions': theme('colors.bone.muted'),
            '--tw-prose-code': theme('colors.bone.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.bone.DEFAULT'),
            '--tw-prose-pre-bg': theme('colors.ink.900'),
            '--tw-prose-th-borders': theme('colors.ink.800'),
            '--tw-prose-td-borders': theme('colors.ink.800'),
            fontSize: '1.0625rem',
            lineHeight: '1.75',
            h2: {
              fontFamily: theme('fontFamily.display').toString(),
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            },
            h3: {
              fontFamily: theme('fontFamily.display').toString(),
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            },
            a: { fontWeight: '500', textDecoration: 'underline' },
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
