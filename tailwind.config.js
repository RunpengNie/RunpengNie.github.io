/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  // Only apply hover styles on devices that can actually hover, so taps don't leave "stuck" hover states.
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    extend: {
      colors: {
        // accentColor: "#FF8000", // previous site's orange accent
        accentColor: "#4169E1",
        backGroundColor: "#0b0e0e"  // dark background carried over from the previous site
      }
    }
  },
  plugins: []
};
