import { Box } from "@mui/material";
import {
    BankOutlined,
    DollarOutlined,
    FormOutlined,
    HomeOutlined
} from '@ant-design/icons';
import logo from "./assets/logo-light-icon.svg";
import { defaultTheme, MenuItem } from "@digitalaidseattle/mui";
import packageJson from "../package.json";
import { HelpButton } from './components/HelpButton';

export const Config = () => {

    // example of overriding theme
    const theme = defaultTheme();

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
                    url: '/projects',
                    icon: <HomeOutlined />,
                } as MenuItem,
                {
                    id: 'Inst',
                    title: 'Institutions',
                    type: 'item',
                    url: '/institutions',
                    icon: <BankOutlined />,
                } as MenuItem,
                {
                    id: 'GRNT',
                    title: 'Grant Proposals',
                    type: 'item',
                    url: '/grant-proposals',
                    icon: <FormOutlined />,
                } as MenuItem,
                {
                    id: 'DONA',
                    title: 'Donations',
                    type: 'item',
                    url: '/donations',
                    icon: <DollarOutlined />,
                } as MenuItem,
                {
                    id: 'TEST',
                    title: 'Test Page',
                    type: 'item',
                    url: '/testpage'
                } as MenuItem
            ]
        } as MenuItem],
        toolbarItems: [
            <Box key={1}><HelpButton /></Box>
        ],
        version: packageJson.version
    })
}