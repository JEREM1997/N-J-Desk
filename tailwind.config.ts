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
        background: '#f5f5f6',
        foreground: '#101010',
        panel: '#ffffff',
        muted: '#666771',
        line: '#e7e7eb',
        accent: '#8f7a5a',
        success: '#226b42',
        warning: '#9a6b1d'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 10px 28px rgba(17, 17, 17, 0.08)',
        panel: '0 1px 0 rgba(17,17,17,0.04), 0 18px 36px rgba(17,17,17,0.06)',
        luxe: '0 1px 0 rgba(255,255,255,0.8) inset, 0 16px 32px rgba(20,20,20,0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        serif: ['"Iowan Old Style"', '"Times New Roman"', 'serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        shimmer: 'shimmer 2.5s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
