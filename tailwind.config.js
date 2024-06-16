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
      }
    }
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/line-clamp'),
    nextui({
      defaultTheme: 'dark',

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
      dark: {
        colors: {
          default: {
            foreground: '#1f283e',
            DEFAULT: '#1f283e'
          }
        }
      }
      // }
    })
  ]
};
