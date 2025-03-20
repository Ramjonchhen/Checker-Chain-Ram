/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
      "4xl": "2560px",
      "5xl": "3840px",
      "6xl": "7680px",
      "7xl": "15360px",
      "8xl": "30720px",
      "9xl": "61440px"
    },
    extend: {
      transitionProperty: {
        width: "width"
      },
      minWidth: {
        40: "200px",
        58.75: "235px",
        68.25: "273px",
        108.5: "434px",
        160: "640px"
      },
      maxWidth: {
        160: "640px"
      },
      minHeight: {
        35: "140px"
      },
      keyframes: {
        scale: {
          "0%, 100%": { transform: "scale(1.05,1.05)", opacity: 0 },
          "50%": { transform: "scale(1.1,1.1)", opacity: 1 }
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 }
        },
        slideLeft: {
          "0%": { transform: "translateX(0)", opacity: 0 },
          "100%": { transform: "translateX(-100%)", opacity: 1 }
        },
        slideLeftAndFade: {
          "0%": { transform: "translateX(0)", opacity: 0 },
          "100%": { transform: "translateX(-100%)", opacity: 1 }
        },
        slideRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0%)", opacity: 1 }
        },
        slideUp: {
          "0%": { transform: "translateY(20%)", opacity: 0 },
          "100%": { transform: "translateY(0%)", opacity: 1 }
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        spinReverse: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        },
        slideAndFadeIn: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(0%)" }
        },
        marqueeLoop: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        marqueeLoopReverse: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" }
        }
      },
      animation: {
        scale: "scale 1500ms ease-in-out",
        slideIn: "slideIn 1500ms ease-in-out",
        slideLeft: "slideLeft 1500ms ease-in-out",
        slideRight: "slideRight 1500ms ease-in-out",
        slideUp: "slideUp 1500ms ease-in-out",
        spin: "spin 1500ms ease-in-out",
        "spin-always": "spin 1500ms linear infinite",
        spinReverse: "spinReverse 1500ms ease-in-out",
        fadeIn: "fadeIn 1500ms ease-in-out",
        fadeInFast: "fadeIn 300ms ease-in-out",
        fadeOut: "fadeOut 1500ms ease-in-out",
        slideAndFadeIn: "slideAndFadeIn 1500ms ease-in-out",
        marquee: "marquee 8s linear infinite",
        marqueeLoop: "marqueeLoop 50s linear infinite",
        marqueeLoopReverse: "marqueeLoopReverse 50s linear infinite"
      },
      colors: {
        black: "var(--black)",
        white: "var(--white)",
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          400: "var(--neutral-400)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          900: "var(--neutral-900)"
        },
        red: "var(--red)",
        // Background bg-background-primary
        background: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          light: "var(--bg-light)",
          muted: "var(--bg-muted)",
          footer: "var(--bg-footer)",
          "footer-coin": "var(--bg-footer-coin)",
          "semi-transparent": "var(--bg-semi-transparent)",
          gradient: {
            DEFAULT: "var(--primary-gradient)",
            hover: "var(--primary-gradient-hover)"
          }
        },
        // Primary
        primary: {
          DEFAULT: "var(--primary-main)",
          900: "var(--primary-900)",
          500: "var(--primary-500)",
          700: "var(--primary-700)",
          300: "var(--primary-300)",
          50: "var(--primary-50)"
        },
        secondary: {
          DEFAULT: "var(--secondary-main)",
          dark: "var(--secondary-dark)",
          light: "var(--secondary-light)",
          tertiary: "var(--secondary-tertiary",
          contrast: "var(--secondary-contrast)",
          gradient: {
            DEFAULT: "var(--secondary-gradient)",
            hover: "var(--secondary-gradient-hover)"
          },
          900: "var(--secondary-900)",
          500: "var(--secondary-500)",
          50: "var(--secondary-50)",
          700: "var(--secondary-700)"
        },
        // Content
        content: {
          primary: "var(--content-primary)",
          secondary: "var(--content-secondary)",
          tertiary: "var(--content-tertiary)",
          contrast: "var(--content-contrast)",
          light: "var(--content-light)",
          text: "var(--content-text)",
          success: "var(--success-content)",
          error: "var(--error-content)"
        },
        // Success
        success: "var(--success-main)",
        // Error
        error: "var(--error-main)",
        // Warning
        warning: "var(--warning-main)",
        // Outline
        outline: {
          DEFAULT: "var(--outline-main)",
          avatar: "var(--outline-avatar)",
          secondary: "var(--outline-secondary)"
        },
        separator: "var(--seperator)"
      },
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        georgia: "Georgia, 'Times New Roman', Times, serif"
      },
      fontSize: {
        "heading-1": [
          "var(--fs-2xl)",
          {
            lineHeight: "var(--lh-leading-10)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        "heading-2": [
          "var(--fs-xl)",
          {
            lineHeight: "var(--lh-leading-8)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        "heading-3": [
          "var(--fs-lg)",
          {
            lineHeight: "var(--lh-leading-7)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        "heading-4": [
          "var(--fs-base)",
          {
            lineHeight: "var(--lh-leading-6)",
            letterSpacing: "var(--ls-tracking-1)"
          }
        ],
        "heading-5": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-5)"
          }
        ],
        body: [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-5)",
            letterSpacing: "var(---ls-tracking-2)"
          }
        ],
        button: [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-6)"
          }
        ],
        caption: [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-4)"
          }
        ],
        "button-sm": [
          "var(--fs-xxs)",
          {
            lineHeight: "var(--lh-leading-3)"
          }
        ],
        "caption-sm": [
          "var(--fs-xxs)",
          {
            lineHeight: "var(--lh-leading-3)"
          }
        ]
      },
      boxShadow: {
        2: "var(--bs-shadow-2)",
        3: "var(--bs-shadow-3)",
        "3px": "var(--bs-shadow-3px)",
        default: "var(--bs-shadow-default)",
        empty: "var(--bs-shadow-0)"
      },
      container: {
        center: true
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          // maxWidth: "100%",
          // marginLeft: "auto",
          // marginRight: "auto",
          // "paddingLeft": "1rem",
          // "paddingRight": "1rem",
          "@screen sm": {
            maxWidth: "100%"
          },
          "@screen md": {
            maxWidth: "100%"
          },
          "@screen lg": {
            maxWidth: "1024px"
          },
          "@screen xl": {
            maxWidth: "1200px"
          },
          "@screen 2xl": {
            maxWidth: "1456px"
          }
        }
      })
    }
  ]
}
