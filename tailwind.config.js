/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        ui: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  'var(--color-ink-50)',
          100: 'var(--color-ink-100)',
          200: 'var(--color-ink-200)',
          300: 'var(--color-ink-300)',
          400: 'var(--color-ink-400)',
          500: 'var(--color-ink-500)',
          600: 'var(--color-ink-600)',
          700: 'var(--color-ink-700)',
          800: 'var(--color-ink-800)',
          900: 'var(--color-ink-900)',
          950: 'var(--color-ink-950)',
        },
        parchment: {
          50:  'var(--color-parchment-50)',
          100: 'var(--color-parchment-100)',
          200: 'var(--color-parchment-200)',
          300: 'var(--color-parchment-300)',
          400: 'var(--color-parchment-400)',
          500: 'var(--color-parchment-500)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-h)',
          light:   'var(--color-accent-l)',
        },
        surface: {
          dark:  'var(--color-surface-dark)',
          card:  'var(--color-surface-card)',
          hover: 'var(--color-surface-hover)',
        },
      },
      typography: (theme) => ({
        ink: {
          css: {
            '--tw-prose-body':        theme('colors.ink[800]'),
            '--tw-prose-headings':    theme('colors.ink[900]'),
            '--tw-prose-links':       theme('colors.accent.DEFAULT'),
            '--tw-prose-code':        theme('colors.ink[800]'),
            '--tw-prose-pre-bg':      theme('colors.ink[100]'),
            '--tw-prose-invert-body': theme('colors.parchment[200]'),
            '--tw-prose-invert-headings': theme('colors.parchment[100]'),
            '--tw-prose-invert-links': theme('colors.accent.light'),
            '--tw-prose-invert-code': theme('colors.parchment[200]'),
            '--tw-prose-invert-pre-bg': theme('colors.surface.card'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
