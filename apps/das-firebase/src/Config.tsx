import {
    BankOutlined,
    ClusterOutlined,
    DollarOutlined,
    FormOutlined
} from '@ant-design/icons';
import { HelpButton, LayoutConfiguration, MenuItem } from "@digitalaidseattle/mui";
import { Box } from "@mui/material";
import packageJson from "../package.json";
import logo from "./assets/logo-light-icon.svg";

export const Config: LayoutConfiguration = ({

    appName: 'DAS Firebase Example',
    logoUrl: logo,
    drawerWidth: 240,
    menuItems: [{
        id: 'group-main',
        title: 'Sections',
        type: 'group',
        children: [
            {
                id: 'CNT',
                title: 'AI Content Projects',
                type: 'item',
                url: '/ai-projects',
                icon: <FormOutlined />,
            } as MenuItem,
            {
                id: 'programs',
                title: 'Program Tracking',
                type: 'item',
                url: '/programs',
                icon: <ClusterOutlined />
            } as MenuItem
        ]
    } as MenuItem,
    {
        id: 'group-grants',
        title: 'Grant Tracking',
        type: 'group',
        children: [
            {
                id: 'GRNT-FND',
                title: 'Funders',
                type: 'item',
                url: '/funders',
                icon: <BankOutlined />,
            } as MenuItem,
            {
                id: 'GRNT-PRG',
                title: 'Grant Programs',
                type: 'item',
                url: '/grant-programs',
                icon: <DollarOutlined />,
            } as MenuItem,
            {
                id: 'GRNT-APPL',
                title: 'Grant Applications',
                type: 'item',
                url: '/grant-applications',
                icon: <FormOutlined />
            } as MenuItem
        ]
    } as MenuItem],
    toolbarItems: [
        <Box key={1}><HelpButton /></Box>
    ],
    version: packageJson.version
})