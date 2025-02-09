import {
    HomeOutlined,
    TwitchOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";

import { MenuItem } from "@digitalaidseattle/mui";

export const Config = ({
    appName: 'DAS Firebase Example',
    logoUrl: logo,
    drawerWidth: 240,
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
                id: 'tw',
                title: 'Page Two',
                type: 'item',
                url: '/two',
                icon: <TwitchOutlined />,
            } as MenuItem
        ]
    } as MenuItem],
    toolbarItems: [
    ]
})