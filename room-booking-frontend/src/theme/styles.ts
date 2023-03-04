import { mode } from "@chakra-ui/theme-tools";
export const globalStyles = {
  colors: {
    brand: {
      100: "#C53030",
      200: "#C53030",
      300: "#C53030",
      400: "#C53030",
      500: "#C53030",
      600: "#C53030",
      700: "#C53030",
      800: "#C53030",
      900: "#C53030",
    },
    brandScheme: {
      100: "#C53030",
      200: "#C53030",
      300: "#C53030",
      400: "#C53030",
      500: "#C53030",
      600: "#C53030",
      700: "#C53030",
      800: "#C53030",
      900: "#C53030",
    },
    brandTabs: {
      100: "#C53030",
      200: "#C53030",
      300: "#C53030",
      400: "#C53030",
      500: "#C53030",
      600: "#C53030",
      700: "#C53030",
      800: "#C53030",
      900: "#C53030",
    },
    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    red: {
      100: "#FEEFEE",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#EFF4FB",
      500: "#3965FF",
    },
    orange: {
      100: "#FFF6DA",
      500: "#FFB547",
    },
    green: {
      100: "#E6FAF5",
      500: "#01B574",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1B254B",
      800: "#111c44",
      900: "#0b1437",
    },
    gray: {
      100: "#FAFCFE",
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "navy.900")(props),
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "DM Sans",
      },
    }),
  },
};
