/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // accentColor: "#FF8000", // 旧版网站主橙色
        accentColor: "#B0C4DE",
        backGroundColor: "#0b0e0e"  // 旧版网站深黑色
      }
    }
  },
  plugins: []
};
