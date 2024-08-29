import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        mask: '100000',
        common: '10000',
        top: '100000'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-sub': 'var(--color-primary-sub)',
        subtext: 'var(--color-text-sub)',
        subtext2: 'var(--color-text-sub2)',
        background: 'var(--background-color)',
        card: 'var(--color-card)',
        mask: 'var(--color-mask)',
        error: 'var(--color-error)'
      }
    }
  },
  plugins: [],
}
export default config
