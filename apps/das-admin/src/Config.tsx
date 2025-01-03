import {
    CalendarOutlined,
    HomeOutlined,
    UserOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";

import { MenuItem } from "@digitalaidseattle/mui";
import Notification from "./Notification";

export const Config = ({
    appName: 'DAS',
    logoUrl: logo,
    drawerWidth: 240,
    menuItems: [{
        id: 'group-main',
        title: 'DAS Admin',
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
                id: 'test',
                title: 'Test',
                type: 'item',
                url: '/test',
                icon: <CalendarOutlined />
            } as MenuItem,
            {
                id: 'drapanddrop',
                title: 'Drag And Drop',
                type: 'item',
                url: '/draganddrop',
                icon: <UserOutlined />
            } as MenuItem
        ]
    } as MenuItem],
    toolbarItems: [
        <Notification key={1} />
    ]
})