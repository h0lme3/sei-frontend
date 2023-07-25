/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  important: true,
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      desktop: { max: "1440px" }, // desktop:
      basic: { max: "1280px" }, // basic:
      laptop: { max: "1024px" }, // laptop:
      tablet: { max: "768px" }, // tablet:
      medium: { max: "640px" }, // medium:
      mobile: { max: "430px" }, // mobile:
      last: { max: "375px" }, // last:
    },
    extend: {
      fontFamily: {
        // font-[]
        sans: ["Encode Sans", ...defaultTheme.fontFamily.sans], // default font style
        dm_sans: ["DM Sans"], // font-dm_sans
      },
      colors: {
        // text-[]
        label: "#BEAFFA", // text-label
      },
      backgroundColor: {
        // bg-[]
        modal: "#10141f", // bg-modal
        modal_object_hover: "#ffffff20", // bg-modal_object_hover
      },
      backgroundImage: {
        // bg-[]
        primary_gradient: "linear-gradient(101.3deg, #FD8999 7.28%, #B89DF1 34.88%, #05BCEE 67.09%, #02BBA4 91.43%)", // bg-primary_gradient
        primary_gradient_hover:
          "linear-gradient(100.1deg, #fd8999 7.22%, #b89df1 61.39%, #05bcee 124.61%, #02bba4 172.35%)", // bg-primary_gradient_hover
      },
      backgroundSize: {
        // bg-[]
        full: "100%", // bg-full
      },
      boxShadow: {
        // shadow-[]
        button_hover: "0px 7px 10px #B89DF170", // shadow-button_hover
      },
      spacing: {
        // space-x-[], space-y-[]
      },
      zIndex: {
        max: "9999", // z-max
      },
    },
  },
  plugins: [require("daisyui")],
  // daisy ui config
  daisyui: { themes: ["dark"] },
};
