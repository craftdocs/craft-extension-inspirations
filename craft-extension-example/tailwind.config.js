const colors = require('tailwindcss/colors')
module.exports = {
  purge: {
    enabled: true,
    content : [
      './src/*.html',
      './src/*.ts'
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontSize: {
      'xs': '.6875rem',
      'sm': '.8125rem',
      'base': '.9375rem',
      'lg': '1.0625rem',
      'xl': '1.1875rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      pink : colors.pink,
      purple : colors.purple,
      blue : colors.blue,
      text : {
        light : '#111111',
        DEFAULT : '#111111',
        dark : '#FFFFFF',
      },
      secondaryText: {
        light : '#666666',
        DEFAULT : '#666666',
        dark : '#999999',
      },
      interfaceBorder : {
        light : '#F3F3F3',
        DEFAULT : '#F3F3F3',
        dark:'#2D2D2D'
      },
      groupBackground : {
        light:'#FFFFFF',
        DEFAULT:'#FFFFFF',
        dark:'#333333'
      },
      systemBackground: {
          light:'#FFFFFF',
          DEFAULT:'#FFFFFF',
          dark:'#222222'
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('autoprefixer')
  ],
}
