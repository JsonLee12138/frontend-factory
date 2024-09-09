/** @type {import('tailwindcss').Config} */

const getAnimationDelaysConfig = () => {
  const res = {};
  for (let i = 0; i < 10; i++) {
    res[i.toString()] = `${i * 75}ms`;
  }
  return res;
};
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      arial: ['Arial', 'sans-serif'],
    },
    boxShadow: {
      'loading-shadow': 'inset 0 0 5px rgba(0, 0, 0, 0.3), 0 5px 0 #ccc',
    },
    animation: {
      'loading-jump': 'loading-jump .5s infinite',
    },
    animationDelay: getAnimationDelaysConfig(),
  },
  plugins: [
    function ({ addUtilities, matchUtilities, theme }) {
      const delays = theme('animationDelay');
      const utilities = Object.keys(delays).map((key) => {
        return {
          [`.animate-delay-${key}`]: {
            'animation-delay': delays[key],
          },
        };
      });
      addUtilities(utilities, ['responsive']);
      matchUtilities(
        {
          'animation-delay': (value) => ({
            'animation-delay': value,
          }),
        },
        {
          values: {
            ...delays,
            0: '0ms',
            '100ms': '100ms',
            '200ms': '200ms',
            '300ms': '300ms',
            '400ms': '400ms',
            '500ms': '500ms',
            '600ms': '600ms',
            '700ms': '700ms',
            '800ms': '800ms',
            '900ms': '900ms',
            '1s': '1s',
            '1.5s': '1.5s',
            '2s': '2s',
            '2.5s': '2.5s',
            '3s': '3s',
          },
          // 支持 [] 自定义语法
          type: ['any'],
        },
      );
    },
  ],
  safelist: [
    'hidden',
    'animation-delay-[200ms]',
    'animation-delay-[400ms]',
    'animation-delay-[600ms]',
    'animation-delay-[800ms]',
    'animation-delay-[1000ms]',
    'animation-delay-[1200ms]',
    'animation-delay-[1400ms]',
    'animation-delay-[1600ms]',
    'animation-delay-[1800ms]',
    'animation-delay-[2000ms]',
  ],
};
