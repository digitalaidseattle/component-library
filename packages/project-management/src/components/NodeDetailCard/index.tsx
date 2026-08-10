/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";
import { useNotifications } from "@digitalaidseattle/core";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Stack,
    Tabs,
    Tooltip,
    Typography
} from '@mui/material';

import { ProgramService } from "../../services";
import { NodeService } from "../../services/NodeService";
import { Node } from "../../types";
import { NodeContext } from "../NodeContext";
import NodeDialog from "../NodeDialog";
import { ProgramContext } from "../ProgramContext";
import { TextEdit } from "../TextEdit";

import '@mdxeditor/editor/style.css';
import { DateEdit } from "../DateEdit";
import { MarkdownEdit } from "../MarkdownEdit";
import { MemberEdit } from "../MemberEdit";
import { PriorityEdit } from "../PriorityEdit";
import { StatusEdit } from "../StatusEdit";
import { TabbedPanels } from "@digitalaidseattle/mui";
import { SubnodeListCard } from "./SubnodeListCard";
import { HistoryListCard } from "./HistoryListCard";
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

    return (program && node &&
        <>
            <Card>
                <CardHeader title={`${node.node_no} ${node.name}`}
                    action={
                        <Stack
                            className="actions"
                            direction="row"
                            spacing={0.5}
                        >
                            <Chip label={node.type} variant="outlined" color="primary"/>
                        </Stack>
                    } />
                <CardContent>
                    <Stack gap={1}>
                        <TextEdit label={'Name'} value={node.name}
                            onChange={(value) => handleAttributeChange('name', value)} />
                        <MarkdownEdit label={'Description'} value={node.description ?? ""}
                            onChange={(value) => handleAttributeChange('description', value)} />
                        <StatusEdit label={'Status'} value={node.status}
                            onChange={(value) => handleAttributeChange('status', value)} />
                        <PriorityEdit label={'Priority'} value={node.priority}
                            onChange={(value) => handleAttributeChange('priority', value)} />
                        <DateEdit label={'Due Date'} value={node.due_date}
                            onChange={(value) => handleDateChange('due_date', value)} />
                        <MemberEdit label={'Assigned To'} value={node.assignee_id as string}
                            onChange={(value) => handleAttributeChange('assignee_id', value)} />
                        <SubnodeListCard />
                        <TabbedPanels
                            panels={[
                                {
                                    header: <Typography>Comments</Typography>,
                                    children: <Typography>Comments go here</Typography>
                                },
                                {
                                    header: <Typography>History</Typography>,
                                    children: <HistoryListCard />
                                }
                            ]} />

                    </Stack>
                </CardContent>
            </Card >
        </>
    );
}
