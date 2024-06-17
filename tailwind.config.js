/* eslint-disable global-require */
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],

  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(307deg, #FF3CAC 0%, #58129c 50%, #010203 100%)'
      },
      scale: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        35: '0.35',
        40: '0.4',
        55: '0.55'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/line-clamp'),
    nextui({
      defaultTheme: 'dark'

      // themes: {
      //   light: {
      //     colors: {
      //       secondary: {
      //         DEFAULT: '#1a6eb7'
      //       }
      //     }
      //   },
      //   dark: {
      //     colors: {
      //       secondary: {
      //         DEFAULT: '#1a6eb7'
      //       }
      //     }
      //   }
      // },
      // addCommonColors: true
      // defaultTheme: 'light',

      // themes: {
      //   light: {
      //     colors: {
      //       black: '#0F0F0F',
      //       darkBlack: '#0F0F0F',
      //       custom: 'red'
      //     }
      //   },
      //   dark: {
      //     colors: {
      //       black: '#0F0F0F',
      //       darkBlack: '#0F0F0F',
      //       custom: 'red'
      //     }
      //   }
      // }
    })
  ]
};
