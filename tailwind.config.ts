/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Busca clases en todas las páginas y layouts
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Busca clases en todos los componentes
  ],
  theme: {
    extend: {
      colors: {
        // Opcional: Definir una paleta de colores personalizada
        'indigo-800': '#3730A3', 
        'indigo-900': '#312E81',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Define la fuente Inter como la principal
      },
    },
  },
  plugins: [],
}