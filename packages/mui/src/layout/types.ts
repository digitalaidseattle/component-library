import { AUTH_PROVIDER } from "@digitalaidseattle/core";
import { ChipProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export type MenuItem = {
    id: string,
    title: string,
    type: string,
    children: MenuItem[],
    url: string,
    target: string,
    icon: ReactNode,
    disabled: boolean,
    chip: ChipProps
}

export interface LayoutConfiguration {
    appName: string;
    logoUrl: string;
    drawerWidth: number;
    menuItems: MenuItem[];
    toolbarItems: ReactNode[];
    theme?: Theme;
    authProviders?: AUTH_PROVIDER[]
}