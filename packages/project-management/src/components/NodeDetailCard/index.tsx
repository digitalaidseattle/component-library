/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useEffect } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    Stack,
    Typography
} from '@mui/material';

import { NodeService } from "../../services/NodeService";
import { NodeContext } from "../NodeContext";
import { ProgramContext } from "../ProgramContext";
import { TextEdit } from "./TextEdit";

import { TabbedPanels } from "@digitalaidseattle/mui";
import '@mdxeditor/editor/style.css';
import { CommentListCard } from "./CommentListCard";
import { DateEdit } from "./DateEdit";
import { HistoryListCard } from "./HistoryListCard";
import { MarkdownEdit } from "./MarkdownEdit";
import { MemberEdit } from "./MemberEdit";
import { PriorityEdit } from "./PriorityEdit";
import { StatusEdit } from "./StatusEdit";
import { SubnodeListCard } from "./SubnodeListCard";
//
export const NodeDetailCard: React.FC = () => {

    const { program } = React.useContext(ProgramContext);
    const { node } = React.useContext(NodeContext);

    async function handleAttributeChange(attribute: string, newStatus: string): Promise<void> {
        NodeService.getInstance()
            .changeAttribute(node, attribute, newStatus)
    }

    async function handleDateChange(attribute: string, newDate: Date): Promise<void> {
        NodeService.getInstance()
            .changeAttribute(node, attribute, newDate.toISOString())
    }

    async function handleAssignmentChange(attribute: string, newAssignee: string): Promise<void> {
        NodeService.getInstance()
            .changeAttribute(node, attribute, newAssignee)
    }

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
                    <Grid container spacing={2}>
                        <Grid size={2}><Typography>Name</Typography></Grid>
                        <Grid size={10} display="flex">
                            <TextEdit value={node.name}
                                onChange={(value) => handleAttributeChange('name', value)} />
                        </Grid>
                        <Grid size={2}><Typography>Description</Typography></Grid>
                        <Grid size={10} display="flex">
                            <MarkdownEdit value={node.description ?? ""}
                                onChange={(value) => handleAttributeChange('description', value)} />
                        </Grid>

                        <Grid size={2}><Typography>Status</Typography></Grid>
                        <Grid size={10} display="flex">
                            <StatusEdit value={node.status}
                                onChange={(value) => handleAttributeChange('status', value)} />
                        </Grid>

                        <Grid size={2}><Typography>Priority</Typography></Grid>
                        <Grid size={10} display="flex">
                            <PriorityEdit value={node.priority}
                                onChange={(value) => handleAttributeChange('priority', value)} />
                        </Grid>

                        <Grid size={2}><Typography>Due Date</Typography></Grid>
                        <Grid size={10} display="flex">
                            <DateEdit value={node.due_date}
                                onChange={(value) => handleDateChange('due_date', value)} />
                        </Grid>

                        <Grid size={2}><Typography>Assigned To</Typography></Grid>
                        <Grid size={10} display="flex">
                            <MemberEdit value={node.assignee_id as string}
                                onChange={(value) => handleAssignmentChange('assignee_id', value)} />
                        </Grid>
                    </Grid>
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
