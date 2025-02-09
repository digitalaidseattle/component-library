import React, { useMemo } from 'react';

// material-ui
import {
  CssBaseline,
  StyledEngineProvider,
  Theme,
  ThemeOptions,
  ThemeProvider,
  createTheme
} from '@mui/material';

// project import
import Palette from './palette';
import CustomShadows from './shadows';
import Typography from './typography';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //
export const defaultTheme = () => {
  const theme = Palette('light');

  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536
        }
      },
      direction: 'ltr',
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  return createTheme(themeOptions as ThemeOptions);
}

export const ThemeCustomization = (props: { theme?: Theme, children: React.ReactNode }) => {
  const themes = props.theme ?? defaultTheme();

  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
