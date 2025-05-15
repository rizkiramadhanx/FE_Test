import { createTheme, virtualColor } from "@mantine/core";

const customTheme = createTheme({
  components: {
    modalTitle: {
      styles: () => ({
        title: {
          fontWeight: 600,
        },
      }),
    },
    Table: {
      styles: () => ({
        thead: {},
      }),
    },
    Input: {
      styles: () => ({
        input: {
          borderColor: "orange",

          "&:focus, &:focus-within": {
            borderColor: "orange",
          },
        },
      }),
    },
    TextInput: {
      styles: () => ({
        input: {
          borderColor: "orange",

          "&:focus, &:focus-within": {
            borderColor: "orange",
          },
        },
      }),
    },
  },
  colors: {
    orange: [
      "#fff0e2",
      "#ffdfcc",
      "#ffbe9b",
      "#fd9b66",
      "#fc8849",
      "#fb6a1c",
      "#fc600a",
      "#e15000",
      "#c94500",
      "#af3900",
    ],
    green: [
      "#e0f3e8",
      "#c0e7d2",
      "#9edcbb",
      "#7cd0a3",
      "#58c58b",
      "#38b972",
      "#289350",
      "#1f6f3c",
      "#154b28",
      "#0a2714",
    ],
    primary: virtualColor({
      name: "primary",
      dark: "orange",
      light: "orange",
    }),
  },
  fontFamily: "Inter, sans-serif",
});
export default customTheme;
