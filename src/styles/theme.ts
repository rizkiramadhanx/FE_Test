import { createTheme, MantineColorsTuple } from "@mantine/core";

const primaryColor: MantineColorsTuple = [
  "#e9f3ff",
  "#d5e2fc",
  "#abc2f1",
  "#7da1e6",
  "#5784dd",
  "#4375d9",
  "#3069d7",
  "#2158bf",
  "#174eac",
  "#014399",
];

const customTheme = createTheme({
  cursorType: "pointer",
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
          borderColor: "primary.5",

          "&:focus, &:focus-within": {
            borderColor: "primary.5",
          },
        },
      }),
    },
    TextInput: {
      styles: () => ({
        input: {
          borderColor: "primary.5",
          "&:focus, &:focus-within": {
            borderColor: "primary.5",
          },
        },
        error: {
          color: "red.9", // warna merah yang lebih soft
        },
      }),
    },
  },
  primaryColor: "primary",
  colors: {
    primary: primaryColor,
  },
  fontFamily: "Inter, sans-serif",
});

export default customTheme;
