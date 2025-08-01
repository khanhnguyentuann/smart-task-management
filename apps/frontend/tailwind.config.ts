import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
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
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                    "33%": { transform: "translateY(-10px) rotate(5deg)" },
                    "66%": { transform: "translateY(5px) rotate(-5deg)" },
                },
                "float-slow": {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "33%": { transform: "translate(30px, -30px) scale(1.05)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
                },
                "particle": {
                    "0%": { transform: "translate(0, 0)", opacity: "0" },
                    "10%": { opacity: "0.2" },
                    "90%": { opacity: "0.2" },
                    "100%": { transform: "translate(100px, -100px)", opacity: "0" },
                },
                "twinkle": {
                    "0%, 100%": { opacity: "0" },
                    "50%": { opacity: "1" },
                },
                "wave": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "50%": { transform: "translateX(-25%)" },
                },
                "gradient-shift": {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float": "float 3s ease-in-out infinite",
                "float-slow": "float-slow 8s ease-in-out infinite",
                "particle": "particle 10s linear infinite",
                "twinkle": "twinkle 3s ease-in-out infinite",
                "wave": "wave 3s ease-in-out infinite",
                "gradient-shift": "gradient-shift 8s ease infinite",
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config

export default config