import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0F766E",   // evergreen
      light: "#5EEAD4",
      dark: "#115E59",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4B5563",   // neutral slate
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
  },
});
