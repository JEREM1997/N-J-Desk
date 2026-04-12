import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f7f8',
        foreground: '#111111',
        panel: '#ffffff',
        muted: '#6e6e73',
        line: '#e9e9ec',
        accent: '#8f7a5a',
        success: '#226b42',
        warning: '#9a6b1d'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(17, 17, 17, 0.06)',
        panel: '0 1px 0 rgba(17,17,17,0.04), 0 12px 24px rgba(17,17,17,0.04)'
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 400ms ease-out'
      }
    }
  },
  plugins: []
};

export default config;
