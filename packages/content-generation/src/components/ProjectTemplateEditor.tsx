/**
 * ProjectTemplateEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/

import { InfoCircleOutlined } from "@ant-design/icons";
import { HelpTopicContext, useHelp } from "@digitalaidseattle/core";
import { Card, CardContent, CardHeader, IconButton, TextField } from "@mui/material";
import React, { useContext } from "react";
import { AiProjectContext } from "./AiProjectContext";

const HELP_TOPIC = "Template";
const DEFAULT_PLACEHOLDER_TEXT="Create a grant proposal.";
export const ProjectTemplateEditor = ({ title, onChange }: { title: string, onChange: (updated: string) => void }) => {
    const { setHelpTopic } = React.useContext(HelpTopicContext);
    const { setShowHelp } = useHelp();

    const { project } = useContext(AiProjectContext);

    return (
        <Card>
            <CardHeader title={title}
                slotProps={{ title: { fontWeight: 600, fontSize: 16 } }}
                avatar={<IconButton
                    onClick={() => { setHelpTopic(HELP_TOPIC); setShowHelp(true) }}
                    color="primary"><InfoCircleOutlined /></IconButton>} />
            <CardContent>
                <TextField fullWidth={true}
                    value={project.template ?? ""}
                    onChange={(evt) => onChange(evt.target.value)}
                    multiline={true}
                    placeholder={DEFAULT_PLACEHOLDER_TEXT}
                    sx={{
                        '& .MuiInputBase-input': {
                            resize: 'vertical',
                            overflow: 'auto',
                        }
                    }} />
            </CardContent>
        </Card>
    )
}