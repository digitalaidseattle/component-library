/**
 * Outline
 *
 *
 */

import React, { useEffect } from 'react';

import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
    RichTreeView,
    TreeItemContent,
    TreeItemGroupTransition,
    TreeItemIcon,
    TreeItemIconContainer,
    TreeItemProps,
    TreeItemProvider,
    TreeItemRoot,
    useTreeItem
} from '@mui/x-tree-view';

import { RefreshContext } from '@digitalaidseattle/core';

import { useNavigate } from 'react-router-dom';
import { ProgramService } from '../services';
import { Node } from "../types";
import NodeDialog from './NodeDialog';
import { ProgramContext } from './ProgramContext';

type TreeNode = {
    id: string,
    label: string;
    children: TreeNode[];
}

export default function Outline() {

    const service = ProgramService.getInstance();

    const navigate = useNavigate();
    const { refresh, setRefresh } = React.useContext(RefreshContext);
    const { program } = React.useContext(ProgramContext);

    const [treeNodes, setTreeNodes] = React.useState<TreeNode[]>([]);
    const [openNodeDialog, setOpenNodeDialog] = React.useState<boolean>(false);
    const [selectedNode, setSelectedNode] = React.useState<Node>();

    useEffect(() => {
        setTreeNodes(program.nodes.map(node => mapNode(node)));
    }, [program, refresh]);

    function mapNode(node: Node): TreeNode {
        return ({
            id: node.id! as string,
            label: `${node.node_no} ${node.name}`,
            children: (node.children ?? []).map(child => mapNode(child)),
        });
    }

    function addNode(parentId: string) {
        service.createChild(program, parentId)
            .then(child => {
                setSelectedNode(child);
                setOpenNodeDialog(true);
            })
    }

    function openNode(found: Node) {
        if (found) {
            navigate(`/programs/${program.id}/nodes/${found.node_no}`);
        } else {
            throw new Error(`Outline: Node is undefined.`);
        }
    }

    function handleNodeChange(node: Node | null) {
        if (node !== null) {
            service.insertNode(program, node)
                .then(updateNode => {
                    setRefresh(0);
                })
        }
        setOpenNodeDialog(false);
    }

    const handleItemClick = (event: React.MouseEvent, itemId: string) => {
        // event.detail counts the number of consecutive clicks
        if (event.detail === 2) {
            const found = service.findNode(program, itemId);
            openNode(found!);
        }
    };

    // 1. Define your custom tree item component
    const CustomTreeItem = React.forwardRef(function CustomTreeItem(
        props: TreeItemProps,
        ref: React.Ref<HTMLLIElement>,
    ) {
        const { id, itemId, label, disabled, children } = props;
        const {
            getContextProviderProps,
            getRootProps,
            getContentProps,
            getIconContainerProps,
            getLabelProps,
            getGroupTransitionProps,
            status,
        } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });
        const found = service.findNode(program, itemId);
        const childType = service.getChildType(program, found!);

        return (
            <TreeItemProvider {...getContextProviderProps()}>
                <TreeItemRoot {...getRootProps()}>
                    <TreeItemContent
                        {...getContentProps()}
                        sx={{
                            "&:hover .actions": {
                                visibility: "visible",
                            },
                        }}>
                        <TreeItemIconContainer {...getIconContainerProps()}>
                            <TreeItemIcon status={status} />
                        </TreeItemIconContainer>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ flexGrow: 1 }}
                        >
                            <Stack direction="row">
                                <Typography
                                    {...getLabelProps()}
                                    sx={{ flexGrow: 1 }}
                                >
                                    {label}
                                </Typography>
                                <Chip size='small'
                                    color="primary"
                                    variant="outlined"
                                    sx={{ marginLeft: 1 }}
                                    label={found?.status}></Chip>
                            </Stack>
                            <Stack
                                className="actions"
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    visibility: "hidden",
                                }}
                            >
                                {childType &&
                                    <Tooltip title={`Add ${childType}`}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                addNode(itemId);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <PlusCircleOutlined />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip title={`Edit ${found!.type}`}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            openNode(found!);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <EditOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </TreeItemContent>
                    {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
                </TreeItemRoot>
            </TreeItemProvider>
        );
    });

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <RichTreeView
                items={treeNodes}
                slots={{
                    item: CustomTreeItem,
                }}
                onItemClick={handleItemClick}
            />
            <NodeDialog
                title={"Add"}
                node={selectedNode!}
                open={openNodeDialog}
                onChange={handleNodeChange} />
        </Box>
    );
}

