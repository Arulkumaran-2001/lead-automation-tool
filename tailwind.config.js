/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          primary: '#2563EB',
          indigo: '#6366F1',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          pending: '#8B5CF6',
          verified: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444'
        }
      }
    },
  },
  plugins: [],
}
