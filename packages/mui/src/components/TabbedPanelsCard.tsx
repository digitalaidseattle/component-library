
/**
 *  TabbedPanelsCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Box, Card, CardContent, Tab, Tabs, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";

interface TabbedCardProps {
    panels: {
        header: ReactNode,
        children: ReactNode
    }[];
}

const TabbedPanels: React.FC<TabbedCardProps> = ({ panels }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<number>(0);

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
        setActiveTab(newValue);
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="tabs">
                        {panels.map((p, idx) => (
                            <Tab
                                key={idx}
                                label={p.header}
                                {...a11yProps(idx)}
                            />
                        ))}
                    </Tabs>
                </Box>
                {panels.map((p, index) => (
                    <Box
                        key={index}
                        role="tabpanel"
                        hidden={activeTab !== index}
                        id={`profile-tabpanel-${index}`}
                        aria-labelledby={`profile-tab-${index}`}
                        dir={theme.direction}>
                        {activeTab === index && p.children}
                    </Box>
                ))}
            </CardContent>
        </Card>
    )
}

const TabbedPanelsCard: React.FC<TabbedCardProps> = ({ panels }) => {
    return (
        <Card>
            <CardContent>
                <TabbedPanels panels={panels} />
            </CardContent>
        </Card>
    )
}


export { TabbedPanels, TabbedPanelsCard };
