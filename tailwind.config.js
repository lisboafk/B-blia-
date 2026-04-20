/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: 'rgb(var(--parchment-rgb) / <alpha-value>)',
        'parchment-dark': '#c4a96b',
        gold: '#c9a84c',
        'gold-light': '#f0c040',
        'gold-dark': '#8b6914',
        fire: '#ff6b35',
        ember: '#ff4500',
        obsidian: 'rgb(var(--obsidian-rgb) / <alpha-value>)',
        'obsidian-light': 'rgb(var(--obsidian-light-rgb) / <alpha-value>)',
        'dark-wood': '#1a1208',
        'scroll-bg': '#0f0b08',
        'verse-hover': '#1c1409',
        sacred: '#4a0e0e',
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
        display: ['"IM Fell English"', '"Times New Roman"', 'serif'],
        title: ['"Cinzel"', '"Times New Roman"', 'serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      animation: {
        'flame': 'flame 3s ease-in-out infinite',
        'flame-slow': 'flame 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'scroll-open': 'scrollOpen 1.5s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'particle': 'particle 4s linear infinite',
        'revelation': 'revelation 0.5s ease-out forwards',
        'ark-glow': 'arkGlow 4s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.9' },
          '25%': { transform: 'scaleY(1.1) scaleX(0.95)', opacity: '1' },
          '50%': { transform: 'scaleY(0.95) scaleX(1.05)', opacity: '0.85' },
          '75%': { transform: 'scaleY(1.08) scaleX(0.97)', opacity: '0.95' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px #c9a84c40, 0 0 20px #c9a84c20' },
          '50%': { boxShadow: '0 0 20px #c9a84c80, 0 0 40px #c9a84c40, 0 0 60px #c9a84c20' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scrollOpen: {
          '0%': { transform: 'scaleY(0) rotateX(-90deg)', opacity: '0' },
          '60%': { transform: 'scaleY(1.05) rotateX(5deg)', opacity: '0.9' },
          '100%': { transform: 'scaleY(1) rotateX(0deg)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) translateX(20px) scale(0)', opacity: '0' },
        },
        revelation: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        arkGlow: {
          '0%, 100%': {
            boxShadow: '0 0 30px #c9a84c60, 0 0 60px #c9a84c30, inset 0 0 30px #c9a84c10'
          },
          '50%': {
            boxShadow: '0 0 60px #c9a84c90, 0 0 120px #c9a84c50, inset 0 0 60px #c9a84c20'
          },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #8b6914 0%, #c9a84c 50%, #f0c040 100%)',
        'fire-gradient': 'linear-gradient(to top, #8b0000 0%, #cc3300 30%, #ff6b35 60%, #ffd700 100%)',
        'parchment-texture': 'radial-gradient(ellipse at center, #1a1208 0%, #0f0b08 100%)',
        'sacred-bg': 'radial-gradient(ellipse at 50% 0%, #1a0a00 0%, #0a0807 60%)',
      },
    },
  },
  plugins: [],
}
