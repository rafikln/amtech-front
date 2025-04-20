// Importer la fonction withMT depuis @material-tailwind/react/utils
const withMT = require("@material-tailwind/react/utils/withMT");
const flowbite = require("flowbite/plugin"); // Utiliser Flowbite comme plugin
const daisyui = require("daisyui"); // DaisyUI comme plugin

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}", // Chemins pour Flowbite React
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        "pulse-slow": "pulseSlow 3s infinite ease-in-out",
        gradient: "gradient 15s ease infinite",
      },
    },  },
  plugins: [
    daisyui, // Intégration de DaisyUI
    flowbite, // Intégration de Flowbite
  ],
});
