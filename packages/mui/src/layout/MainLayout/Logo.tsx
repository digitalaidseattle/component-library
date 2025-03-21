/**
 *  Logo.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// material-ui

import React from 'react';

import { LayoutConfigurationContext } from '../LayoutConfigurationContext';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const {configuration} = React.useContext(LayoutConfigurationContext);

  return (
    <img src={configuration.logoUrl} alt={configuration.appName} width="50" />
  )
}

export default Logo;
