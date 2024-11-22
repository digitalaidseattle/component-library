/**
 *  LayoutConfigurationContext.ts
 * 
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useContext, useState } from 'react';
import { LayoutConfiguration } from './types';
// TODO library need ability to improt CSS, PNG,  & SVG
// import {logo} from '../../assets/das-dark.png';


interface LayoutConfigurationContextType {
    configuration: LayoutConfiguration,
    setConfiguration: (c: LayoutConfiguration) => void
}

export const LayoutConfigurationContext = createContext<LayoutConfigurationContextType>({
    configuration: {
        appName: 'DAS Admin Context',
        logoUrl: '',
        drawerWidth: 240,
        menuItems: [],
        toolbarItems: []
    },
    setConfiguration: (c: LayoutConfiguration) => { }
});

export const LayoutConfigurationProvider = (props: { configuration?: LayoutConfiguration, children: React.ReactNode }) => {
    const [configuration, setConfiguration] = useState<LayoutConfiguration>(
        props.configuration ??
        {
            appName: 'DAS Admin',
            logoUrl: '',
            drawerWidth: 240,
            menuItems: [],
            toolbarItems: []
        }
    )

    return <LayoutConfigurationContext.Provider value={{ configuration, setConfiguration }}>
        {props.children}
    </LayoutConfigurationContext.Provider>
};

// Hook to use the dependency
export const useLayoutConfiguration = () => {
    return useContext(LayoutConfigurationContext);
};