/**
 * ProgramDetailCard.tsx
 *
 */

// material-ui
import React from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Stack,
    Typography
} from '@mui/material';

import { NodeContext } from "../NodeContext";
import { ProgramContext } from "../ProgramContext";

import { TabbedPanels } from "@digitalaidseattle/mui";
import '@mdxeditor/editor/style.css';
import { CommentListCard } from "../CommentListCard";
import { NodeAttributeEditor } from "../NodeAttributeEditor/NodeAttributeEditor";
import { SubnodeListCard } from "./SubnodeListCard";
import { HistoryListCard } from "../HistoryListCard";
//
export const NodeDetailCard: React.FC = () => {

    const { program } = React.useContext(ProgramContext);
    const { node } = React.useContext(NodeContext);

    return (program && node &&
        <Card>
            <CardHeader title={`${node.node_no} ${node.name}`}
                action={
                    <Stack
                        className="actions"
                        direction="row"
                        spacing={0.5}
                    >
                        <Chip label={node.type} variant="outlined" color="primary" />
                    </Stack>
                } />
            <CardContent>
                <Stack gap={2}>
                    <NodeAttributeEditor />
                    <SubnodeListCard />
                    <TabbedPanels
                        panels={[
                            {
                                header: <Typography>Comments</Typography>,
                                children: <CommentListCard />
                            },
                            {
                                header: <Typography>History</Typography>,
                                children: <HistoryListCard />
                            }
                        ]} />
                </Stack>
            </CardContent>
        </Card >
    );
}
