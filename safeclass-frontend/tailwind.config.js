/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base palette
        surface: {
          DEFAULT: '#0b0f1a',
          card:    '#131929',
          sidebar: '#0d1321',
        },
        border: {
          DEFAULT: '#1e2d4a',
          focus:   '#3b82f6',
        },
        // Alert types
        danger:  { DEFAULT: '#ef4444', muted: 'rgba(239,68,68,0.12)' },
        warning: { DEFAULT: '#f59e0b', muted: 'rgba(245,158,11,0.12)' },
        info:    { DEFAULT: '#3b82f6', muted: 'rgba(59,130,246,0.12)' },
        success: { DEFAULT: '#22c55e', muted: 'rgba(34,197,94,0.12)' },
        muted:   { DEFAULT: '#64748b', muted: 'rgba(100,116,139,0.12)' },
        // Text
        text: {
          primary:   '#e2e8f0',
          secondary: '#94a3b8',
          disabled:  '#475569',
          hint:      '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow':      'spin 0.8s linear infinite',
        'status-pulse':   'statusPulse 1.5s infinite',
        'alert-pulse':    'alertPulse 2s infinite',
        'critical-pulse': 'criticalPulse 1.2s infinite',
        shimmer:          'shimmer 1.5s infinite',
        'fade-in':        'fadeIn 0.3s ease',
        'slide-up':       'slideUp 0.2s ease',
        'slide-in-right': 'slideInRight 0.2s ease',
      },
      keyframes: {
        statusPulse:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        alertPulse:    { '0%,100%': { opacity: 0.1 }, '50%': { opacity: 0.25 } },
        criticalPulse: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        shimmer:       { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        fadeIn:        { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:       { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight:  { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
