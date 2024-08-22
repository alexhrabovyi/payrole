import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      tthoves: ['var(--font-tthoves)'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      darkBlue: '#0A112F',
      blue: {
        DEFAULT: '#3981F7',
        hover: '#3476e1',
        active: '#2960ba',
      },
      white: '#FFFFFF',
      lightBlue: {
        DEFAULT: '#F5F9FF',
        98: '#F5F9FF',
        96: '#EBF3FF',
        94: '#E0EDFF',
        92: '#D6E7FF',
        90: '#D8D6F5',
      },
      grey: {
        DEFAULT: '#0B0B0C',
        900: '#0B0B0C',
        800: '#313135',
        700: '#44444B',
        600: '#585860',
        500: '#70707A',
        400: '#9096A2',
        300: '#CACACE',
        200: '#E4E4E7',
        100: '#F4F4F5',
        50: '#FAFAFA',
      },
    },
  },
  plugins: [],
};

export default config;
