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
      height: {
        "screen-navbar": "calc(100vh - 64px)", // Replace 64px with your navbar height
      },
    },
  },
  plugins: [daisyui, scrollbar],

  daisyui: {
    themes: ["light"],
  },
};
