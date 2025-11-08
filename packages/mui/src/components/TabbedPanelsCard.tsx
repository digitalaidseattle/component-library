
/**
 *  TabbedPanelsCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React, { ReactNode, useState } from "react";
import { Box, Card, CardContent, Direction, Tab, Tabs, useTheme } from "@mui/material";

interface TabPanelProps {
    children: ReactNode,
    index: number,
    value: number,
    dir: Direction
}

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
                <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
                    {panels.map((p, idx) => (
                        <Tab
                            key={idx}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            label={p.header}
                            {...a11yProps(idx)}
                        />
                    ))}
                </Tabs>
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


export { TabbedPanelsCard, TabbedPanels }