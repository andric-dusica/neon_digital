/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.html", 
    "./services/**/*.html",
    "./about-us/**/*.html",
    "./contact-us/**/*.html",
    "./our-work/**/*.html",
    "./js/**/*.js",
  ], 
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'gap-[24px]',
    'lg:grid-cols-3',
    'xl:grid-cols-4',
    'mx-auto',
  ],
  theme: {
    extend: {
      colors: {
        'btn-gradient': 'radial-gradient(169.51% 152.63% at -15.27% 0%, #CA07AF 0%, #9215CE 46.9%, #3434D7 100%)',
        'btn-white-bg': '#FFF',
        'btn-white-text': '#000029',
        'btn-hover': '#A510C3', 
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'btn-text': '18px',
      },
      fontWeight: {
        'btn-medium': '500',
      },
      lineHeight: {
        'btn-line': 'normal',
      },
      borderRadius: {
        'btn-lg': '44px',
      },
      spacing: {
        'btn-x': '12px',
        'btn-y': '16px',
      },
      gap: {
        'btn-gap': '10px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.btn-color': {
          display: 'flex',
          padding: '12px 16px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '44px',
          background: 'radial-gradient(169.51% 152.63% at -15.27% 0%, #CA07AF 0%, #9215CE 46.9%, #3434D7 100%)',
          color: '#FFF',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: 'normal',
          transition: 'background 0.7s ease',
        },
        '.btn-color:hover': {
          background: '#A510C3', 
        },
        '.btn-white': {
          display: 'flex',
          padding: '12px 16px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '44px',
          background: '#FFF',
          color: '#000029',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: 'normal',
          transition: 'background 0.3s ease',
        },
        '.btn-white:hover': {
          background: '#A510C3', 
          color: '#FFF', 
        },
      });
    },
  ],
};
