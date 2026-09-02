import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#3C4242",
        muted: "#807D7E",
        accent: "#8A33FD",
        canvas: "#F6F6F6",
        line: "#BEBCBD",
        sunshine: "#EDD146",
        blush: "#EB84B0",
        burgundy: "#9C1F35",
        charcoal: "#2A2F2F"
      },
      fontFamily: {
        causten: ["Causten", "Arial", "sans-serif"],
        core: ["Core Sans C", "Arial", "sans-serif"],
        mintaka: ["Mintaka", "Georgia", "serif"],
        poppins: ["Poppins", "Arial", "sans-serif"]
      },
      borderRadius: {
        card: "12px",
        soft: "8px",
        media: "10px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
        float: "0 8px 24px rgba(0, 0, 0, 0.10)",
        icon: "0.75px 0.75px 3px rgba(0, 0, 0, 0.04)"
      },
      maxWidth: {
        content: "1240px"
      }
    }
  },
  plugins: []
};

export default config;
