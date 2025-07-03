import {
    BankOutlined,
    DollarOutlined,
    HomeOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";

import { defaultTheme, MenuItem } from "@digitalaidseattle/mui";
import packageJson from "../package.json";

export const Config = () => {

    // example of overriding theme
    const theme = defaultTheme();
    theme.palette.action.disabled = "rgba(255, 0, 0, 0.5)";

    return ({
        appName: 'DAS Firebase Example',
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
                    title: 'Projects',
                    type: 'item',
                    url: '/',
                    icon: <HomeOutlined />,
                } as MenuItem,
                {
                    id: 'Inst',
                    title: 'Instituitions',
                    type: 'item',
                    url: '/instituitions',
                    icon: <BankOutlined />,
                } as MenuItem,
                {
                    id: 'GRNT',
                    title: 'Grant Proposals',
                    type: 'item',
                    url: '/grant-proposals',
                    icon: <DollarOutlined />,
                } as MenuItem
            ]
        } as MenuItem],
        toolbarItems: [
        ],
        version: packageJson.version
    })
}