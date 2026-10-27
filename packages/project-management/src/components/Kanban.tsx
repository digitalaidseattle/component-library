/**
 * Kanban
 *
 *
 */

import React, { useEffect, useState } from "react";

import { Box, Breadcrumbs, Card, CardHeader, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { ProjectOutlined } from "@ant-design/icons";
import { ProgramService } from "../services";
import { Node, NodeWrapper } from "../types";
import { NodeKanban } from "./NodeKanban";
import { ProgramContext } from "./ProgramContext";

export const Kanban = ({ cardRenderer }: {
    cardRenderer?: (
        node: NodeWrapper,
        onFocusChange: (node: Node) => void
    ) => React.ReactNode
}) => {

    const service = ProgramService.getInstance();

    const { program } = React.useContext(ProgramContext);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [focusNode, setFocusNode] = useState<Node>();
    const [ancestralNodes, setAncestralNodes] = useState<Node[]>();

    useEffect(() => {
        if (program) {
            if (focusNode) {
                setNodes(focusNode.children);
                setAncestralNodes(service.findAncestors(program, focusNode));
            } else {
                setNodes(program.nodes);
                setAncestralNodes([]);
            }
        }
    }, [program, focusNode])

    function editViewSettings() {
        // show edit view settings
        // put it in local storage
        alert('Fixme')
    }

    return (
        <Card >
            <CardHeader
                title={
                    <Breadcrumbs aria-label="breadcrumb" separator=">>">
                        <Typography sx={{ cursor: "pointer" }}
                            onClick={() => setFocusNode(undefined)} >{program.name}</Typography>
                        {(ancestralNodes ?? []).map(ancestor => (
                            <Typography sx={{ cursor: "pointer" }}
                                onClick={() => setFocusNode(ancestor)} >{ancestor.node_no} {ancestor.name}</Typography>
                        ))}
                        {focusNode && <Typography fontWeight={600}>{focusNode.node_no} {focusNode.name}</Typography>}
                    </Breadcrumbs>
                }
                action={
                    <Stack
                        className="actions"
                        direction="row"
                        spacing={0.5}
                    >
                        <Tooltip title="Edit view setting">
                            <IconButton
                                onClick={(e) => {
                                    editViewSettings();
                                    e.stopPropagation();
                                }}
                            >
                                <ProjectOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                } />
            <Stack gap={2}>
                {
                    nodes.map(node => (
                        <Box key={node.id} >
                            <NodeKanban
                                node={node}
                                onFocusChange={focus => setFocusNode(focus)}
                                opts={cardRenderer ? { cardRenderer } : undefined} />
                        </Box>
                    ))
                }
            </Stack>
        </Card>
    );
};

