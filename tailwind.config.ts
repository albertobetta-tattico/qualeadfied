import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================
      // QUALEADFIED COLOR PALETTE
      // ============================================
      colors: {
        // Primary Colors - Brand Identity
        primary: {
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#0F3460', // Main primary - Slate Blue
          600: '#16213E', // Dark Blue
          700: '#1A1A2E', // Deep Navy
          800: '#141424',
          900: '#0E0E1A',
          DEFAULT: '#0F3460'
        },

        // Accent Color - CTA & Highlights
        accent: {
          50: '#FCE4EC',
          100: '#F8BBD9',
          200: '#F48FB1',
          300: '#F06292',
          400: '#EC407A',
          500: '#E94560', // Main accent
          600: '#D81B60',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
          DEFAULT: '#E94560'
        },

        // Neutral Grayscale
        neutral: {
          50: '#F8F9FA',   // Light Gray - backgrounds
          100: '#F1F3F5',
          200: '#E9ECEF',  // Border Gray
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',  // Muted Gray - secondary text
          700: '#495057',
          800: '#343A40',  // Dark Gray - body text
          900: '#212529',  // Charcoal - titles
          DEFAULT: '#6C757D'
        },

        // Semantic Colors
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#28A745',
          600: '#2E7D32',
          700: '#388E3C',
          800: '#1B5E20',
          900: '#1B5E20',
          DEFAULT: '#28A745'
        },

        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
          DEFAULT: '#FFC107'
        },

        danger: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#DC3545',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
          DEFAULT: '#DC3545'
        },

        info: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#17A2B8',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
          DEFAULT: '#17A2B8'
        },

        // Lead Status Colors
        lead: {
          free: {
            bg: '#E8F5E9',
            text: '#2E7D32',
            border: '#A5D6A7'
          },
          exclusive: {
            bg: '#E3F2FD',
            text: '#1565C0',
            border: '#90CAF9'
          },
          shared: {
            bg: '#FFF3E0',
            text: '#E65100',
            border: '#FFCC80'
          },
          exhausted: {
            bg: '#FFEBEE',
            text: '#C62828',
            border: '#EF9A9A'
          }
        }
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        brand: ['Montserrat', 'Arial', 'sans-serif']
      },

      fontSize: {
        'xs': ['0.625rem', { lineHeight: '1.3' }],    // 10px - badges, micro-text
        'sm': ['0.75rem', { lineHeight: '1.4' }],     // 12px - caption, labels
        'base': ['0.875rem', { lineHeight: '1.5' }],  // 14px - body, tables
        'lg': ['1rem', { lineHeight: '1.5' }],        // 16px - body large
        'xl': ['1.125rem', { lineHeight: '1.4' }],    // 18px - h4
        '2xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px - h3
        '3xl': ['1.5rem', { lineHeight: '1.3' }],     // 24px - h2
        '4xl': ['2rem', { lineHeight: '1.2' }],       // 32px - h1
        '5xl': ['2.5rem', { lineHeight: '1.1' }],     // 40px - hero
        '6xl': ['3rem', { lineHeight: '1.1' }]        // 48px - display
      },

      // ============================================
      // SPACING (8pt Grid System)
      // ============================================
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '18': '4.5rem',     // 72px
        '20': '5rem',       // 80px
        // Layout specific
        'sidebar': '260px',
        'sidebar-collapsed': '64px',
        'header': '64px',
        'content-max': '1440px'
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px'
      },

      // ============================================
      // BOX SHADOWS
      // ============================================
      boxShadow: {
        'none': 'none',
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'lg': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'xl': '0 8px 24px rgba(0, 0, 0, 0.15)',
        '2xl': '0 12px 48px rgba(0, 0, 0, 0.2)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        // Focus rings
        'focus-primary': '0 0 0 3px rgba(15, 52, 96, 0.15)',
        'focus-accent': '0 0 0 3px rgba(233, 69, 96, 0.15)',
        'focus-danger': '0 0 0 3px rgba(220, 53, 69, 0.15)',
        // Card shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        // Sidebar shadow
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.1)'
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080'
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionDuration: {
        'fast': '150ms',
        'DEFAULT': '200ms',
        'slow': '300ms',
        'slower': '400ms'
      },

      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },

      // ============================================
      // KEYFRAMES & ANIMATIONS
      // ============================================
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.2s ease-out',
        'slide-in-down': 'slide-in-down 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite'
      },

      // ============================================
      // ASPECT RATIOS
      // ============================================
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'portrait': '3 / 4',
        'landscape': '4 / 3'
      }
    }
  },

  plugins: [
    // Custom plugin for lead status utilities
    function({ addUtilities }: { addUtilities: Function }) {
      const leadStatusUtilities = {
        '.lead-free': {
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
          borderColor: '#A5D6A7'
        },
        '.lead-exclusive': {
          backgroundColor: '#E3F2FD',
          color: '#1565C0',
          borderColor: '#90CAF9'
        },
        '.lead-shared': {
          backgroundColor: '#FFF3E0',
          color: '#E65100',
          borderColor: '#FFCC80'
        },
        '.lead-exhausted': {
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          borderColor: '#EF9A9A'
        }
      }
      addUtilities(leadStatusUtilities)
    }
  ]
} satisfies Config
