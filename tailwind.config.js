/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Lithi specific colors
        lithi: {
          primary: '#006FEE',
          'primary-dark': '#0050B3',
          'primary-light': '#E6F4FF',
          secondary: '#F8FAFC',
          'secondary-dark': '#F1F5F9',
          'secondary-border': '#E6F4FF',
          success: '#10B981',
          'success-light': '#BBF7D0',
          'success-bg': '#F0FDF4',
          error: '#EF4444',
          'error-light': '#FCA5A5',
          'error-bg': '#FEE2E2',
          warning: '#F59E0B',
          'warning-light': '#FDE68A',
          'warning-bg': '#FEF3C7',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        scaleIn: {
          from: { transform: "scale(0.95)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "reveal-stats": {
          from: { opacity: 0, transform: "translateY(5px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "progress-fill": {
          from: { width: 0 },
          to: { width: "var(--progress-width, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "reveal-stats": "reveal-stats 0.5s ease-out",
        "progress-fill": "progress-fill 1s ease-out",
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'lithi-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'lithi': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'lithi-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lithi-lg': '0 8px 24px rgba(0, 111, 238, 0.08)',
        'lithi-xl': '0 16px 48px rgba(0, 111, 238, 0.12)',
        'lithi-focus': '0 0 0 3px rgba(0, 111, 238, 0.1)',
        'lithi-button': '0 8px 24px rgba(0, 111, 238, 0.3)',
        'lithi-button-hover': '0 12px 32px rgba(0, 111, 238, 0.4)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}