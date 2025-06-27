// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'osirnet-yellow': '#ffd100',
        'osirnet-green': '#419f45',
        'osirnet-white': '#ffffff',
        'osirnet-dark-blue': '#1c1d62',
        // Mantendo o azul antigo para outras partes da UI, podemos renomear depois se quiser
        'osirnet-blue': '#005baa',
      },
    },
  },
  plugins: [],
};
export default config;