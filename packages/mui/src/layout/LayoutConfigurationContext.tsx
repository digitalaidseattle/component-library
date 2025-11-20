/**
 *  LayoutConfigurationContext.ts
 * 
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useContext, useState } from 'react';
import { LayoutConfiguration } from './types';
import { ThemeCustomization } from '../themes';

// TODO library need ability to import CSS, PNG,  & SVG
// import {logo} from '../../assets/das-dark.png';

interface LayoutConfigurationContextType {
    configuration: LayoutConfiguration,
    setConfiguration: (c: LayoutConfiguration) => void
}

const EMPTY_CONFIGURATION = {
    appName: 'Digital Aid Seattle Application',
    version: undefined,
    logoUrl: '',
    drawerWidth: 240,
    menuItems: [],
    toolbarItems: [],
    profileItems: []
}

export const LayoutConfigurationContext = createContext<LayoutConfigurationContextType>({
    configuration: EMPTY_CONFIGURATION,
    setConfiguration: (c: LayoutConfiguration) => { }
});

export const LayoutConfigurationProvider = (props: { configuration?: LayoutConfiguration, children: React.ReactNode }) => {
    const [configuration, setConfiguration] = useState<LayoutConfiguration>(
        props.configuration ?? EMPTY_CONFIGURATION
    )

    return (
        <ThemeCustomization theme={configuration.theme!} >
            <LayoutConfigurationContext.Provider value={{ configuration, setConfiguration }}>
                {props.children}
            </LayoutConfigurationContext.Provider>
        </ThemeCustomization>
    )
};

// Hook to use the dependency
export const useLayoutConfiguration = () => {
    return useContext(LayoutConfigurationContext);
};