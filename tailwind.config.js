/** @type {import('tailwindcss').Config} */
import scrollbar from "tailwind-scrollbar";

import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [daisyui, scrollbar],
  

  daisyui: {
    themes: ["autumn", "dark", "cupcake"],
  },
};
