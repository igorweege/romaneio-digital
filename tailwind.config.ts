// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // A seção 'content' é a mais importante.
  // Ela diz ao Tailwind para olhar todas as pastas ('app', 'components', etc.)
  // e encontrar todas as classes de estilo que você usar (ex: "bg-blue-500", "flex").
  // Sem isso, seu CSS ficará vazio.
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // A seção 'theme' é onde você pode customizar as cores, fontes, espaçamentos, etc.
  // Por enquanto, usaremos apenas o padrão do Tailwind.
  theme: {
    extend: {},
  },

  // A seção 'plugins' é para adicionar funcionalidades extras ao Tailwind.
  // Por enquanto, não precisamos de nenhuma.
  plugins: [],
};
export default config;