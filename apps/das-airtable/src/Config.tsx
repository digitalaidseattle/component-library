import {
    HomeOutlined,
    SearchOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";

import { defaultTheme, MenuItem } from "@digitalaidseattle/mui";

export const Config = () => {

    // example of overriding theme
    const theme = defaultTheme();
    theme.palette.action.disabled = "rgba(255, 0, 0, 0.5)";

    return ({
        appName: 'DAS Airtable Example',
        logoUrl: logo,
        drawerWidth: 240,
        theme: theme,
        menuItems: [{
            id: 'group-main',
            title: 'Sections',
            type: 'group',
            children: [
                {
                    id: 'home',
                    title: 'Home',
                    type: 'item',
                    url: '/',
                    icon: <HomeOutlined />,
                } as MenuItem,
                {
                    id: 'ventures',
                    title: 'Ventures',
                    type: 'item',
                    url: '/ventures',
                    icon: <SearchOutlined />,
                } as MenuItem
            ]
        } as MenuItem],
        toolbarItems: [
        ]
    })
}