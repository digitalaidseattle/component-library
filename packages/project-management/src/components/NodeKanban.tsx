/**
 * Outline
 *
 *
 */


import { DDCategory, DDType, DragAndDrop } from '@digitalaidseattle/draganddrop';
import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";

import { ArrowsAltOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { RefreshContext } from '@digitalaidseattle/core';
import { useNavigate } from 'react-router-dom';
import { ProgramService, useProfiles } from "../services";
import { NodeService } from '../services/NodeService';
import { Node, Profile } from "../types";
import NodeDialog from './NodeDialog';
import { ProgramContext } from "./ProgramContext";

type NodeWrapper = Node & DDType

function NodeCard({ node, onFocusChange }: { node: Node | undefined, onFocusChange: (node: Node) => void }) {

    const [assignee, setAssignee] = React.useState<Profile | null>(null);

    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { data: profiles } = useProfiles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (node && profiles) {
            setAssignee(profiles.find(prof => prof.id === node.assignee_id)!)
        }
    }, [node, profiles]);

    function openNode(node: Node) {
        navigate(`/programs/${node.program_id}/nodes/${node.node_no}`);
    }

    return (node &&
        <Card>
            <CardHeader
                sx={{ padding: 1 }}
                title={node.node_no}
                action={
                    <>
                        <IconButton
                            id={buttonId}
                            size='small'
                            aria-controls={open ? menuId : undefined}
                            aria-haspopup="true"
                            aria-expanded={open}
                            onClick={handleClick}
                        >
                            <MoreOutlined />
                        </IconButton>
                        <Menu
                            id={`menuId`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                list: {
                                    'aria-labelledby': buttonId,
                                },
                            }}
                        >
                            <MenuItem onClick={() => onFocusChange(node)}>Set in focus</MenuItem>
                            <MenuItem onClick={() => openNode(node)}>Open</MenuItem>
                        </Menu>
                    </>
                }>
            </CardHeader>
            <CardActionArea onDoubleClick={() => openNode(node)}>
                <CardContent sx={{ padding: 1 }}>
                    <Typography fontWeight={600}>{node.name}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Chip color="primary"
                        size='small'
                        label={node.type}
                        variant="outlined" />
                    {assignee && <Tooltip title={assignee.name}>
                        <Avatar src={assignee.pic} sx={{ width: 24, height: 24 }} />
                    </Tooltip>}
                </CardActions>
            </CardActionArea>
        </Card>
    )
}

export function NodeKanban({ node, onFocusChange }: { node: Node | undefined, onFocusChange: (node: Node) => void }) {
    const service = ProgramService.getInstance();

    const { program } = React.useContext(ProgramContext);
    const { setRefresh } = React.useContext(RefreshContext);

    const [categories, setCategories] = useState<DDCategory<string>[]>();
    const [items, setItems] = useState<Map<DDCategory<string>, NodeWrapper[]>>();

    const [openNodeDialog, setOpenNodeDialog] = React.useState<boolean>(false);

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
        return <NodeCard node={item} onFocusChange={onFocusChange} />
    };

    const headerRenderer = (cat: DDCategory<string>): React.ReactNode => {
        return (
            <Box>
                <Typography variant="h6">{cat.label}</Typography>
            </Box>
        )
    };

    function handleNodeChange(node: Node | null) {
        if (node !== null) {
            service.insertNode(program, node)
                .then(updateNode => {
                    setRefresh(0);
                })
        }
        setOpenNodeDialog(false);
    }

    const handleStatusChange = (changes: Map<string, unknown>, element: NodeWrapper) => {
        NodeService.getInstance()
            .changeStatus(element, changes.get("containerId") as string)
            .then(updated => { console.log('handleStatusChange', updated), setRefresh(0) })
    }

    return (items &&
        <Card>
            {node && <CardHeader
                title={<Typography fontWeight={600}>{node.type}: {node.name}</Typography>}
                action={
                    <Stack direction={'row'} >
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
                                    setOpenNodeDialog(true);
                                    e.stopPropagation();
                                }}
                            >
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                } />
            }
            <DragAndDrop
                onChange={(c: Map<string, unknown>, t: NodeWrapper) => handleStatusChange(c, t)}
                items={items}
                categories={categories!}
                cardRenderer={cardRenderer}
                headerRenderer={headerRenderer} />
            {node &&
                <NodeDialog
                    title={"Add"}
                    node={node}
                    open={openNodeDialog}
                    onChange={handleNodeChange} />
            }
        </Card >
    );
}

