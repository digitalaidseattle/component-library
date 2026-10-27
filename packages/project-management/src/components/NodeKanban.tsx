/**
 * NodeKanban
 *
 *
 */
import { DDCategory, DragAndDrop } from '@digitalaidseattle/draganddrop';
import { Box, Card, CardHeader, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";

import { ArrowsAltOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { RefreshContext, useNotifications } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { useNavigate } from 'react-router-dom';
import { Configuration } from "../Configuration";
import { NodeService } from '../services/NodeService';
import { Node, NodeKanbanProps, NodeWrapper } from "../types";
import NodeDialog from './NodeDialog';
import { NodeKanbanCard } from './NodeKanbanCard';
import { ProgramContext } from "./ProgramContext";

export function NodeKanban({ node, onFocusChange, opts }: NodeKanbanProps) {

    const programService = Configuration.getInstance().getProgramService();
    const nodeService = Configuration.getInstance().getNodeService();

    const { program } = React.useContext(ProgramContext);
    const { setRefresh } = React.useContext(RefreshContext);

    const [categories, setCategories] = useState<DDCategory<string>[]>();
    const [items, setItems] = useState<Map<DDCategory<string>, NodeWrapper[]>>();

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
    const [openNodeDialog, setOpenNodeDialog] = React.useState<boolean>(false);
    const [newNode, setNewNode] = React.useState<Node>();
    const notifications = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        setCategories(program.node_statuses.map(st => ({ label: st, value: st })));
    }, [program]);

    useEffect(() => {
        if (categories) {
            loadItems();
        }
    }, [categories, node])

    function loadItems() {
        const nodes = node ? node.children : program.nodes;
        const temp: Map<DDCategory<string>, NodeWrapper[]> = new Map<DDCategory<string>, NodeWrapper[]>();
        for (const cat of categories ?? []) {
            const statNodes = nodes.filter(n => n.status === cat.value);
            temp.set(cat, statNodes as NodeWrapper[])
        }
        setItems(temp);
    }

    const cardRenderer = (item: NodeWrapper): React.ReactNode => {
        return (opts)
            ? opts.cardRenderer(item, onFocusChange)
            : <NodeKanbanCard node={item} onFocusChange={onFocusChange} />
    };

    const headerRenderer = (cat: DDCategory<string>): React.ReactNode => {
        return (
            <Box>
                <Typography variant="h6">{cat.label}</Typography>
            </Box>
        )
    };

    const handleStatusChange = (changes: Map<string, unknown>, element: NodeWrapper) => {
        nodeService
            .changeAttribute(element, "status", changes.get("containerId") as string)
            .then(updated => { console.log('handleStatusChange', updated), setRefresh(Date.now()) })
    }

    function handleAdd() {
        programService
            .createChild(program, node?.id as string | undefined)
            .then(child => {
                setNewNode(child);
                setOpenNodeDialog(true);
            })
            .catch(err => notifications.error(`Add failed: ${err.message}`));
    }

    function handleNodeChange(updated: Node | null) {
        if (updated !== null) {
            programService
                .insertNode(program, updated)
                .then(() => {
                    notifications.success(`${updated.type} added.`);
                    setRefresh(Date.now());
                })
                .catch(err => notifications.error(`Add failed: ${err.message}`));
        }
        setOpenNodeDialog(false);
    }

    function handleDeleteConfirm() {
        if (node) {
            nodeService
                .deleteRecursive(node.id!)
                .then(() => {
                    notifications.success(`${node.node_no} deleted.`);
                    setRefresh(Date.now());
                })
                .catch(err => notifications.error(`Delete failed: ${err.message}`))
                .finally(() => setOpenDeleteDialog(false));
        } else {
            setOpenDeleteDialog(false);
        }
    }

    return (items &&
        <Card>
            <CardHeader
                title={node && <Typography fontWeight={600}>{node.type}: {node.name}</Typography>}
                action={
                    <Stack direction={'row'} >
                        <Tooltip title={`Add ${programService.getChildType(program, node) ?? ''}`}>
                            <IconButton
                                size='small'
                                color='primary'
                                onClick={(e) => {
                                    handleAdd();
                                    e.stopPropagation();
                                }}
                            >
                                <PlusCircleOutlined />
                            </IconButton>
                        </Tooltip>
                        {node && <>
                            <Tooltip title={`Set in focus`}>
                                <IconButton
                                    size='small'
                                    onClick={(e) => {
                                        onFocusChange(node);
                                        e.stopPropagation();
                                    }}
                                >
                                    <ArrowsAltOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={`Edit`}>
                                <IconButton
                                    size='small'
                                    onClick={(e) => {
                                        navigate(`./nodes/${node.node_no}`);
                                        e.stopPropagation();
                                    }}
                                >
                                    <EditOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={`Delete`}>
                                <IconButton
                                    size='small'
                                    onClick={(e) => {
                                        setOpenDeleteDialog(true);
                                        e.stopPropagation();
                                    }}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            </Tooltip>
                        </>}
                    </Stack>
                } />
            <DragAndDrop
                onChange={(c: Map<string, unknown>, t: NodeWrapper) => handleStatusChange(c, t)}
                items={items}
                categories={categories!}
                cardRenderer={cardRenderer}
                headerRenderer={headerRenderer} />
            {newNode &&
                <NodeDialog
                    title={`Add ${newNode.type}`}
                    node={newNode}
                    open={openNodeDialog}
                    onChange={handleNodeChange} />
            }
            {node &&
                <ConfirmationDialog
                    title='Delete'
                    message={`Delete ${node.node_no} "${node.name}"${node.children?.length ? ' and all of its children' : ''}? This cannot be undone.`}
                    open={openDeleteDialog}
                    handleConfirm={handleDeleteConfirm}
                    handleCancel={() => setOpenDeleteDialog(false)} />
            }
        </Card >
    );
}

