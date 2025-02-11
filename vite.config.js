import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`,
      },
    },
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  optimizeDeps: {
    include: ['@fancyapps/ui'],
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services/index.html',
        aboutUs: 'about-us/index.html',
        ourWork: 'our-work/index.html',
        contactUs: 'contact-us/index.html',
      }
    }
  },
});
