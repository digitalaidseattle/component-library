/**
 *  MainLayout/LayoutConfiguration.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

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