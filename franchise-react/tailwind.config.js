/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  blocklist: ["example_class"], //TODO Add restrictions for specific classes
  prefix: "",
  variants: {
    margin: ["first", "last"],
  },
  theme: {
    screens: {
      sm: { max: "500px" },
      // mobile => below 500px wide
      md: "768px",
      // tablet => (min-width: 768px) (max-width: 1024px)
      lg: "1024px",
      // laptop => (min-width: 1024px) (max-width: 1440px)
      xl: "1367px",
      // FHD screen => (min-width: 1440px) (max-width: 1536px)
      "2xl": "1537px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#040404",
      blue: {
        DEFAULT: "#1F499F",
        50: "#F0F5FF",
        100: "#E3EDFF",
        200: "#D6E4FE",
        300: "#C5D6F8",
        400: "#ABC1EC",
        500: "#95AEE1",
        600: "#7D9BD6",
        700: "#5B7BBB",
        800: "#4065AF",
        900: "#1F499F",
      },
      lightBlue: {
        DEFAULT: "#0C68CC",
        50: "#F2F6FF",
        100: "#EBF0FC",
        200: "#E0EAFF",
        300: "#D2E0FF",
        400: "#BFD1F7",
        500: "#B0C6F3",
        600: "#9BB5EB",
        700: "#7D9EE1",
        800: "#5D88E0",
        900: "#0C68CC",
      },
      orange: {
        DEFAULT: "#F59300",
        50: "#FFF5EF",
        100: "#FFEEE9",
        200: "#FFE0A9",
        300: "#FECE85",
        400: "#FFC459",
        500: "#FFBE48",
        600: "#FFB42B",
        700: "#FAAA18",
        800: "#F69F00",
        850: "#F59300",
        900: "#FF7F12",
      },
      yellow: {
        DEFAULT: "#FFEAD2",
        50: "#FFF9F2",
        100: "#FFF8F0",
        200: "#FFF7ED",
        250: "#FFF5E9",
        300: "#FFF6E4",
        400: "#FFF2E2",
        500: "#FFEFDC",
        600: "#FFEEDA",
        700: "#FFEAD2",
        800: "#FFE4C6",
        900: "#FFEAD2",
      },
      danger: { DEFAULT: "#DD1717" },
      red: {
        DEFAULT: "#DD1717",
        50: "#FFEAEA",
        100: "#FFD2D2",
        200: "#FFADAD",
        300: "#FF7777",
        400: "#FF7070",
        500: "#FA6B6B",
        600: "#F35B5B",
        700: "#E84B4B",
        800: "#E13535",
        900: "#DD1717",
        950: "#E35F5F",
      },
      pink: {
        DEFAULT: "#fc5353",
        50: "#FCEEEE",
        100: "#FFEBEB",
        200: "#FFDFDF",
        300: "#FFD3D3",
        400: "#FFBFBF",
        500: "#FFACAC",
        600: "#FF9B9B",
        700: "#FF8484",
        800: "#FF6565",
        900: "#FC5353",
      },
      green: {
        DEFAULT: "#007A48",
        50: "#F4FFFB",
        100: "#EDFFF8",
        200: "#E8FAF3",
        300: "#D8F4E9",
        400: "#B9EFD9",
        500: "#9CE1C5",
        600: "#7AD5B0",
        700: "#02BC77",
        800: "#17AD6F",
        900: "#007A48",
      },
      purple: {
        DEFAULT: "#6840c4",
        50: "#FCFAFF",
        100: "#F9F6FF",
        200: "#F4EEFF",
        300: "#EDE5FF",
        400: "#E1D5FF",
        500: "#CFBDF9",
        600: "#B097EC",
        700: "#9C7DE5",
        800: "#8460D8",
        900: "#6840C4",
      },

      black: {
        DEFAULT: "#040404",
        50: "#E7E7E7",
        100: "#D3D3D3",
        200: "#B6B6B6",
        300: "#898989",
        400: "#7B7B7B",
        500: "#676767",
        600: "#5B5B5B",
        700: "#464646",
        800: "#2E2E2E",
        900: "#040404",
      },
      gray: {
        DEFAULT: "#647082",
        50: "#FAFAFA",
        100: "#F7F8FA",
        150: "#F1F2F4",
        200: "#ECECEC",
        250: "#E9EBEF",
        300: "#DADCE0",
        400: "#C8CBCF",
        500: "#B8BABC",
        600: "#B2B4B5",
        700: "#A0A8B4",
        800: "#77809C",
        900: "#647082",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        auth: "url('/background.jpg')",
      },
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
        constructive: {
          DEFAULT: "hsl(var(--constructive))",
          foreground: "hsl(var(--constructive-foreground))",
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
      spacing: {
        15: "3.75rem", // 60px
        18: "4.5rem", // 72px - 1 rem = 4 tailwind units = 16 px
        22: "5.5rem", // 88px
        68: "17rem", // 272px
        76: "19rem", // 304px
        88: "22rem", // 352px
        100: "25rem", // 400px
        104: "26rem", // 416px
        112: "28rem", // 448px
        120: "30rem", // 480px
        124: "31rem", // 496px
        128: "32rem", // 512px
        136: "34rem", // 544px
        144: "36rem", // 578px
        152: "38rem", // 600px
        160: "40rem", // 640px
        176: "44rem", // 704px
        192: "48rem", // 768px
        200: "50rem", // 800px
        208: "52rem", // 832px
        240: "60rem", // 960px
        272: "68rem", // 1088px
        300: "75rem", // 1200px
        304: "76rem", // 1216px
        336: "84rem", // 1344px
        368: "92rem", // 1472px
        400: "100rem", // 1600px
        432: "108rem", // 1728px
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },

  safelist: [
    "text-danger",
    "bg-purple",
    `from-purple-200`,
    `from-pink-100`,
    `from-green-200`,
    `from-lightBlue-100`,
    `from-orange-100`,
    `border-purple-200`,
    `border-pink-100`,
    `border-green-200`,
    `border-lightBlue-100`,
    `border-orange-100`,
  ],

  plugins: [require("tailwindcss-animate")],
};
