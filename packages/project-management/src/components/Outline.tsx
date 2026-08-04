/**
 * Outline
 *
 *
 */

import React, { useEffect } from 'react';

import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
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
import { Node, Program } from "../types";
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

    function openNode(nodeId: string) {
        const found = service.findNode(program, nodeId);
        if (found) {
            navigate(`/programs/${program.id}/nodes/${found.node_no}`);
        } else {
            throw new Error(`Outline: Node with id ${nodeId} not found.`);
        }
    }

    function handleNodeChange(node: Node | null) {
        if (node !== null) {
            service.insertNode(program, node)
                .then(updateNode => {
                    setRefresh(new Date().getTime());
                })
        }
        setOpenNodeDialog(false);
    }


    // 1. Define your custom tree item component
    const CustomTreeItem = React.forwardRef(function CustomTreeItem(
        props: TreeItemProps,
        ref: React.Ref<HTMLLIElement>,
    ) {
        const { id, itemId, label, disabled, children, ...other } = props;

        const {
            getContextProviderProps,
            getRootProps,
            getContentProps,
            getIconContainerProps,
            getLabelProps,
            getGroupTransitionProps,
            status,
        } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

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
                        {/* <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                            
                            <TreeItemLabel {...getLabelProps()} />
                        </Box> */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ flexGrow: 1 }}
                        >
                            <Typography
                                {...getLabelProps()}
                                sx={{ flexGrow: 1 }}
                            >
                                {label}
                            </Typography>
                            <Stack
                                className="actions"
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    visibility: "hidden",
                                }}
                            >
                                <Tooltip title="Add">
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
                                <Tooltip title="Edit">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            openNode(itemId);
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
            />
            <NodeDialog
                title={"Add"}
                node={selectedNode!}
                open={openNodeDialog}
                onChange={handleNodeChange} />
        </Box>
    );
}

