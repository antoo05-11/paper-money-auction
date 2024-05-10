import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    containerHome: {
      center: true,
      padding: "5rem",
      screens: {
        "2xl": "1400px",
        md: "768px",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        md: "768px",
      },
    },
    extend: {
      colors: {
        bgColor: "#FFF",
        highlightColor: "#696cb8",
        footerBgColor: "#696cb8",
        purpleColor: "#696cb8",
        tmpColor1: "#696cb8",
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
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "100%": {
            borderColor: "white"
          }
        },
        floating1: {
          "25%": { transform: "translate(-150px, -150px) rotate(210deg)" },
          "50%": { transform: "translate(30, -400px) rotate(5deg)" },
          "100%": { transform: "translate(150px, -500px) rotate(190deg)" }
        },
        floating2: {
          "25%": { transform: "translate(100px, -200px) rotate(190deg)" },
          "50%": { transform: "translate(300px, -400px) rotate(25deg)" },
          "100%": { transform: "translate(-150px, -600px) rotate(190deg)" }
        },
        floating3: {
          "25%": { transform: "translate(80px, -100px) rotate(30deg)" },
          "50%": { transform: "translate(-30px, -250px) rotate(280deg)" },
          "100%": { transform: "translate(150px, -600px) rotate(190deg)" }
        },
        bid: {
          "0%": { transform: "translateY(20px)" },
          "20%": { transform: "translateY(4px)" },
          "40%": { transform: "translateX(5px)" },
          "100%": { transform: "translateX(20px)" }
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "floating1": "floating1 30s ease-out 0s infinite alternate",
        "floating2": "floating2 25s ease-out 0s infinite alternate",
        "floating3": "floating3 40s ease-out 0s infinite alternate",
        "typing": "typing 2s steps(20) alternate, blink .7s",
        "bid": "bid 3s linear infinite alternate",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
