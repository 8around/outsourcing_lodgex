import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',    // 초소형 모바일
      'sm': '640px',    // 모바일
      'md': '768px',    // 태블릿
      'lg': '1024px',   // 데스크톱
      'xl': '1280px',   // 대형 데스크톱
      '2xl': '1536px',  // 초대형 데스크톱
    },
    extend: {
      colors: {
        // LinkedIn Professional Color System
        primary: {
          DEFAULT: '#0077B5', // LinkedIn signature blue
          50: '#F0F8FF',
          100: '#E0F2FE', 
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0077B5', // LinkedIn blue
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        // Professional success and accent colors
        accent: {
          DEFAULT: '#057642', // LinkedIn green for success states
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#057642', // LinkedIn green
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        // LinkedIn neutral/gray system
        neutral: {
          DEFAULT: '#F3F2EF', // LinkedIn light background
          50: '#FFFFFF',       // Pure white cards
          100: '#F3F2EF',      // LinkedIn light gray background
          200: '#E8E6E3',      // Light borders
          300: 'rgba(0,0,0,0.08)',    // Subtle borders (LinkedIn standard)
          400: 'rgba(0,0,0,0.6)',     // Secondary text (LinkedIn standard)
          500: '#666666',      // Medium gray text
          600: '#434649',      // Dark secondary text
          700: '#191919',      // Near black
          800: 'rgba(0,0,0,0.9)',     // Primary text (LinkedIn standard)
          900: '#000000',      // Pure black
          950: '#000000',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium:
          '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        strong:
          '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // 터치 최적화 및 접근성
      minHeight: {
        'touch': '44px',        // 최소 터치 타겟 크기
      },
      minWidth: {
        'touch': '44px',        // 최소 터치 타겟 크기
      },
      // 반응형 타이포그래피
      fontSize: {
        'xs-mobile': ['12px', '16px'],
        'sm-mobile': ['14px', '20px'],
        'base-mobile': ['16px', '24px'],
        'lg-mobile': ['18px', '28px'],
        'xl-mobile': ['20px', '28px'],
        '2xl-mobile': ['24px', '32px'],
      },
      // 애니메이션 추가
      animation: {
        'blob': 'blob 7s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }
      },
      // 애니메이션 딜레이
      animationDelay: {
        '1000': '1s',
        '2000': '2s',
        '4000': '4s',
        '6000': '6s',
      },
    },
  },
  plugins: [],
};

export default config;
