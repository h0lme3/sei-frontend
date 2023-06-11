/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      desktop: { max: "1440px" },
      basic: { max: "1280px" },
      laptop: { max: "1024px" },
      tablet: { max: "768px" },
      medium: { max: "640px" },
      mobile: { max: "430px" },
    },
    extend: {
      fontFamily: {
        sans: ["Encode Sans", ...defaultTheme.fontFamily.sans], // default font style
        dm_sans: ["DM Sans"], // default font style
      },
      backgroundImage: {
        primary_gradient: "linear-gradient(101.3deg, #FD8999 7.28%, #B89DF1 34.88%, #05BCEE 67.09%, #02BBA4 91.43%)",
        primary_gradient_hover:
          "linear-gradient(100.1deg, #fd8999 7.22%, #b89df1 61.39%, #05bcee 124.61%, #02bba4 172.35%)",
      },
      backgroundSize: {
        full: "100%",
      },
      boxShadow: {
        button_hover: "0px 7px 10px #B89DF170",
      },
    },
  },
  plugins: [],
};
