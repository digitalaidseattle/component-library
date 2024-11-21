/**
 *  LayoutConfigurationContext.ts
 * 
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
// import {logo} from '../../assets/das-dark.png';

import { ChipProps } from "@mui/material";
import { ReactNode } from "react";
export type MenuItem = {
    id: string,
    title: string,
    type: string,
    children: MenuItem[],
    url: string,
    target: string,
    icon: ReactNode,
    breadcrumbs: boolean,
    disabled: boolean,
    chip: ChipProps
}


export interface LayoutConfiguration {
    appName: string;
    logoUrl: string;
    drawerWidth: number;
    menuItems: MenuItem[];
    toolbarItems: ReactNode[];
}
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