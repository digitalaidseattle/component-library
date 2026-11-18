/**
 * NodeAttributeEditor.tsx
 *
 */

import React from "react";

import { Grid, Typography } from '@mui/material';

import { Configuration } from "../../Configuration";
import { NodeContext } from "../NodeContext";
import { DateEdit } from "./DateEdit";
import { MarkdownEdit } from "./MarkdownEdit";
import { MemberEdit } from "./MemberEdit";
import { PriorityEdit } from "./PriorityEdit";
import { StatusEdit } from "./StatusEdit";
import { TagsEdit } from "./TagsEdit";
import { TextEdit } from "./TextEdit";
//
export const NodeAttributeEditor: React.FC = () => {
    const nodeService = Configuration.getInstance().getNodeService();

    const { node } = React.useContext(NodeContext);

    async function handleAttributeChange(attribute: string, newStatus: string): Promise<void> {
        nodeService
            .changeAttribute(node, attribute, newStatus)
    }

    async function handleDateChange(attribute: string, newDate: Date): Promise<void> {
        nodeService
            .changeAttribute(node, attribute, newDate.toISOString())
    }

    async function handleAssignmentChange(attribute: string, newAssignee: string): Promise<void> {
        nodeService
            .changeAttribute(node, attribute, newAssignee)
    }

    async function handleTagsChange(attribute: string, newTags: string[]): Promise<void> {
        nodeService
            .changeTags(node, attribute, newTags)
    }

    async function handleOrderChange(attribute: string, value: string): Promise<void> {
        nodeService
            .changeOrder(node, attribute, Number(value))
    }

    return (node &&
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
            <Grid size={2}><Typography>Tags</Typography></Grid>
            <Grid size={10} display="flex">
                <TagsEdit value={node.tags}
                    onChange={(value) => handleTagsChange('tags', value)} />
            </Grid>
            <Grid size={2}><Typography>Order - For admin only</Typography></Grid>
            <Grid size={10} display="flex">
                <TextEdit value={`${node.order}`}
                    onChange={(value) => handleOrderChange('order', value)} />
            </Grid>
        </Grid>
    );
}
