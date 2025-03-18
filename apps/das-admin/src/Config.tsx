import {
    CalendarOutlined,
    DatabaseOutlined,
    DragOutlined,
    GlobalOutlined,
    HomeOutlined,
    TableOutlined,
    UploadOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";

import { LayoutConfiguration, MenuItem } from "@digitalaidseattle/mui";
import Notification from "./Notification";
import { AUTH_PROVIDER } from '@digitalaidseattle/core';

export const Config: LayoutConfiguration = ({
    appName: 'DAS Admin',
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
                id: 'drapanddrop',
                title: 'Drag And Drop Example',
                type: 'item',
                url: '/draganddrop',
                icon: <DragOutlined />
            } as MenuItem,
            {
                id: 'maps',
                title: 'Maps Example',
                type: 'item',
                url: '/maps',
                icon: <GlobalOutlined />
            } as MenuItem,
            {
                id: 'calendar-example-page',
                title: 'Calendar Example',
                type: 'item',
                url: '/calendar-example',
                icon: <CalendarOutlined />
            } as MenuItem,
            {
                id: 'excel-example-page',
                title: 'Excel Example',
                type: 'item',
                url: '/excel-example',
                icon: <TableOutlined />
            } as MenuItem,
            {
                id: 'storage-example-page',
                title: 'Storage Example',
                type: 'item',
                url: '/storage-example',
                icon: <UploadOutlined />
            } as MenuItem
            ,
            {
                id: 'crud-example-page',
                title: 'CRUD Example',
                type: 'item',
                url: '/crud-example',
                icon: <DatabaseOutlined />
            } as MenuItem
        ]
    } as MenuItem],
    toolbarItems: [
        <Notification key={1} />
    ],
    authProviders: [AUTH_PROVIDER.google]
})