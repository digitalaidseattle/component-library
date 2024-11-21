/**
 *  Logo.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// material-ui

import React from 'react';

import { useLayoutConfiguration } from './LayoutConfigurationContext';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const configuration = useLayoutConfiguration();

  return (
    <img src={configuration.logoUrl} alt={configuration.appName} width="50" />
  )
}

export default Logo;
