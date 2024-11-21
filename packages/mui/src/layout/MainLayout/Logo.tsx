/**
 *  Logo.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// material-ui

import React, { useContext } from 'react';

import { LayoutConfigurationContext } from '../../components/LayoutConfigurationContext';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const {configuration} = useContext(LayoutConfigurationContext);

  return (
    <img src={configuration.logoUrl} alt={configuration.appName} width="50" />
  )
}

export default Logo;
