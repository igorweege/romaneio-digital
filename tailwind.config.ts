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
      // --- ADICIONAMOS ESTA SEÇÃO ---
      colors: {
        osirnet: {
          blue: '#002B5B',       // O azul escuro principal
          'light-blue': '#00AEEF', // O azul claro para detalhes e links
        },
      },
      // ------------------------------
    },
  },
  plugins: [],
};
export default config;