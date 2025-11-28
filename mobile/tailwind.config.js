module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx,js,jsx}', './src/screens/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        bg: '#0f172a',
        card: '#111827',
        text: '#f8fafc',
        muted: '#94a3b8',
        border: '#1f2937',
        success: '#10b981',
        danger: '#ef4444',
        surface: '#111827'
      }
    }
  },
  presets: [require('nativewind/preset')]
}
