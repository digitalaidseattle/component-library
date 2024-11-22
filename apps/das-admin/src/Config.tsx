import logo from "./assets/logo-light-icon.svg";
import {
    CalendarOutlined,
    UserOutlined
} from '@ant-design/icons';

import Notification from "./Notification";


const icons = {
    CalendarOutlined,
    UserOutlined
};

export const Config = () => {

    return ({
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
                    icon: icons.CalendarOutlined
                },
                {
                    id: 'test',
                    title: 'Test',
                    type: 'item',
                    url: '/test',
                    icon: icons.CalendarOutlined
                },
                {
                    id: 'drapanddrop',
                    title: 'Drag And Drop',
                    type: 'item',
                    url: '/draganddrop',
                    icon: icons.UserOutlined
                }
            ]
        }],
        toolbarItems: [
            <Notification key={1} />
        ]
    })
}