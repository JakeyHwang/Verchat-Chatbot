/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,png,jpg}",
    "./src/public/*.{js,ts,jsx,tsx,mdx,png,jpg}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,png,jpg}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      // adding new plugin to remove scrollbar
      const newUtilities = {
        "#scrollstyle::-webkit-scrollbar-track": {
          "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, 0.3)",
          "border-radius": "10px",
          "background-color": "#D7E3FB",
        },
        
        "#scrollstyle::-webkit-scrollbar": {
          "width": "7px",
          "background-color": "#D7E3FB",
        },
        
        "#scrollstyle::-webkit-scrollbar-thumb": {
          "border-radius": "10px",
          "-webkit-box-shadow": "inset 0 0 6px rgba(0, 0, 0, .3)",
          "background-color": "rgb(96 165 250)",
        }
        }
    
    addUtilities(newUtilities,["responsive","hover"])
    }
  ],
};
