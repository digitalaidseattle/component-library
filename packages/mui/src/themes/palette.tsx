// material-ui
import { presetPalettes } from '@ant-design/colors';
import { PaletteMode, createTheme } from '@mui/material';
import Theme from './theme';

// third-party

// project import

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: PaletteMode) => {
  const colors = presetPalettes;
  const greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = Theme(colors);

  // DAS Admin template theme colors
  // these two color can be changed to apply theme for different project 

  // for example for Seattle Humane could be changed to following collors 
  // based on their branding colors
  // const primaryColor = "#00728f"
  // const secondaryColor = "#ef3825"

  // DAS Colors
  // const primaryColor = "#00382F"
  // const secondaryColor = "#D2CB2D"

  // Default
  const primaryColor = paletteColor.primary.main;
  const secondaryColor = paletteColor.secondary.main;

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      }
      ,
      ...paletteColor,
      primary: {
        main: primaryColor,
        contrastText: '#fff',
      },
      secondary: {
        main: secondaryColor,
        contrastText: '#000',
      },
      text: {
        primary: paletteColor.grey[700],
        secondary: paletteColor.grey[500],
        disabled: paletteColor.grey[400]
      },
      action: {
        disabled: paletteColor.grey[300]
      },
      divider: paletteColor.grey[200],
      background: {
        paper: paletteColor.grey[0],
        default: paletteColor.grey.A50
      }
    }
  });

};

export default Palette;
