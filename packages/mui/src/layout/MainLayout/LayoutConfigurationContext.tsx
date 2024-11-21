/**
 *  LayoutConfigurationContext.ts
 * 
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useContext, useState } from 'react';
import { LayoutConfiguration } from './LayoutConfiguration';
// import {logo} from '../../assets/das-dark.png';

const LayoutConfigurationContext = createContext<LayoutConfiguration>({
    appName: 'DAS Admin',
    logoUrl: '',  // TODO fix importing
    drawerWidth: 240,
    menuItems: [],
    toolbarItems: []
});

export const LayoutConfigurationProvider: React.FC<{ configuration: LayoutConfiguration, children: React.ReactNode }> = ({ configuration, children }) => (
    <LayoutConfigurationContext.Provider value={configuration}>
        {children}
    </LayoutConfigurationContext.Provider>
);

// Hook to use the dependency
export const useLayoutConfiguration = () => {
    const context = useContext(LayoutConfigurationContext);
    if (!context) throw new Error("AuthService must be used within AuthServiceProvider");
    return context;
};