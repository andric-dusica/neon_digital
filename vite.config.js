// vite.config.js
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  server: {
    open: true, // automatski otvara browser
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        services: "services/index.html",
        aboutUs: "about-us/index.html",
        ourWork: "our-work/index.html",
        contactUs: "contact-us/index.html",
      },
    },
  },
});
