import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'freckle': ['"Freckle Face"', 'cursive'],
      },
    },
  },
  plugins: [],
} satisfies Config;
