import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fff",
        foreground: "#171717",
        dark: "#20073b",
        accent: "#f90e80",
        alternate: "#8f3996",
        "alternate-light": "#d19fd599",
      },

      fontFamily: {
        inter: ["var(--font-inter)"],
      },

      screens: {
        mobile: "320px",
        mobileM: "475px",
        mobileL: "580px",
        mobileXL: "640px",
        tablet: "768px",
        tabletM: "896px",
        tabletL: "920px",
        laptop: "1024px",
        desktop: "1280px",
      },
    },
  },
  plugins: [],
} satisfies Config;
