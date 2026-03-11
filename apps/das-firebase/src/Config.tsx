import {
    BankOutlined,
    FormOutlined
} from '@ant-design/icons';
import { defaultTheme, HelpButton, MenuItem } from "@digitalaidseattle/mui";
import { Box } from "@mui/material";
import packageJson from "../package.json";
import logo from "./assets/logo-light-icon.svg";

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
                    id: 'Inst',
                    title: 'Institutions',
                    type: 'item',
                    url: '/institutions',
                    icon: <BankOutlined />,
                } as MenuItem,
                {
                    id: 'GRNT',
                    title: 'AI Projects',
                    type: 'item',
                    url: '/ai-projects',
                    icon: <FormOutlined />,
                } as MenuItem                
            ]
        } as MenuItem],
        toolbarItems: [
            <Box key={1}><HelpButton /></Box>
        ],
        version: packageJson.version
    })
}