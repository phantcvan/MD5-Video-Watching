/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "yt-black": "#0F0F0F",
      "yt-red": "#FF0300",
      "yt-white": "#F1F1F1",
      "yt-light-black": "#272727",
      "yt-light": "#181818",
      "yt-light-1": "#212121",
      "yt-light-2": "#282828",
      "yt-light-3": "#3F3F3F",
      "yt-light-4": "#AAAAAA",
      "yt-light-5": "#939393",
      "yt-light-6": "#4D4D4D",
      "yt-light-7": "#D9D9D9",
      "yt-blue": "#3CA0F5",
      "yt-blue-1": "#263850",
      "yt-blue-2": "#3EA6FF",
      "yt-gray": "gray",
      "overlay-40": "rgba(0,0,0,0.4)",
      "overlay-w-100": "rgba(0,0,0,0.3)",
    },
    extend: {
      gridTemplateColumns: {
        yt: "repeat(auto-fit, minmax(320px,1fr))",
        ch: "repeat(auto-fit, minmax(200px,1fr))",
      },
      screens: {
        xl: "1440px",
        lg: "1024px",
        md: "768px",
        sm: "480px",
      },
    },
    keyframes: {
      "slide-right": {
        "0%": {
          "-webkit-transform": " translateX(-500px);",
          transform: "translateX(-500px);",
        },
        "100%": {
          "-webkit-transform": "translateX(0);",
          transform: "translateX(0);",
        },
      },
      "slide-left": {
        "0%": {
          "-webkit-transform": " translateX(500px);",
          transform: "translateX(500px);",
        },
        "100%": {
          "-webkit-transform": "translateX(0);",
          transform: "translateX(0);",
        },
      },
      // 'slide-left2': {
      //   '0%': {
      //     '-webkit-transform': ' translateX(500px);',
      //     transform: 'translateX(500px);'
      //   },
      //   '100%': {
      //     '-webkit-transform': 'translateX(0);',
      //     transform: 'translateX(0);'
      //   }
      // },
      // 'rotate-center': {
      //   '0%': {
      //     '-webkit-transform': ' rotate(0);',
      //     transform: 'rotate(0);'
      //   },
      //   '100%': {
      //     '-webkit-transform': 'rotate(360deg);',
      //     transform: 'rotate(360deg);'
      //   }
      // },
      // 'scale-up-center': {
      //   '0%': {
      //     '-webkit-transform': 'scale(0);',
      //     transform: 'scale(0);'
      //   },
      //   '100%': {
      //     '-webkit-transform': 'scale(1);',
      //     transform: 'scale(1);'
      //   }
      // },
      // 'scale-up-img': {
      //   '0%': {
      //     '-webkit-transform': 'scale(1);',
      //     transform: 'scale(1);'
      //   },
      //   '100%': {
      //     '-webkit-transform': 'scale(1.2);',
      //     transform: 'scale(1.2);'
      //   }
      // },
      // 'scale-down-img': {
      //   '0%': {
      //     '-webkit-transform': 'scale(1.2);',
      //     transform: 'scale(1.2);'
      //   },
      //   '100%': {
      //     '-webkit-transform': 'scale(1);',
      //     transform: 'scale(1);'
      //   }
      // },
    },
    animation: {
      "slide-right":
        "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
      "slide-left":
        "slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
      // 'slide-left2': 'slide-left2 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      // 'rotate-center': 'rotate-center 1s linear infinite;',
      // 'scale-up-center': 'scale-up-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      // 'scale-up-img': 'scale-up-img 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      // 'scale-down-img': 'scale-down-img 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
    },
  },
  plugins: [],
};
