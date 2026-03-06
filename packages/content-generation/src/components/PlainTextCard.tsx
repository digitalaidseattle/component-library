/**
 * PlainTextCard.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React from "react";

import { InfoCircleOutlined } from "@ant-design/icons";
import { HelpTopicContext, useHelp } from "@digitalaidseattle/core";
import { Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material";

export const PlainTextCard = ({ title, value }: { title: string, value: string }) => {
    const { setHelpTopic } = React.useContext(HelpTopicContext);
    const { setShowHelp } = useHelp();
    return (
        <Card>
            <CardHeader title={title}
                slotProps={{ title: { fontWeight: 600, fontSize: 16 } }}
                avatar={<IconButton
                    onClick={() => { setHelpTopic(title); setShowHelp(true) }}
                    color="primary"><InfoCircleOutlined /></IconButton>} />
            <CardContent>
                <Typography>{value}</Typography>
            </CardContent>
        </Card>
    )
}