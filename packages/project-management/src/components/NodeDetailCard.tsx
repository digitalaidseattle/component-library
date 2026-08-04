/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useNotifications } from "@digitalaidseattle/core";
import {
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';
import { ProgramDialog } from ".";
import NodeDialog from "./NodeDialog";
import Outline from "./Outline";
import { ProgramContext } from "./ProgramContext";
import { ProgramService } from "../services";
import { Node, Program } from "../types";
import { NodeContext } from "./NodeContext";

//
export const NodeDetailCard: React.FC = () => {
    const service = ProgramService.getInstance();

    const notifications = useNotifications();
    const { program, setProgram } = React.useContext(ProgramContext);
    const { node, setNode } = React.useContext(NodeContext);

    const [openNodeDialog, setOpenNodeDialog] = useState<boolean>(false);
    const [nodeDialogTitle, setNodeDialogTitle] = useState<string>("");
    const [childNode, setChildNode] = useState<Node>();


    async function addNode() {
        service.createChild(program!)
            .then(node => {
                setChildNode(node);
                setNodeDialogTitle(`Add ${node.type}`)
                setOpenNodeDialog(true);
            })
    }

    function handleNodeChange(updated: Node | null): void {
        if (updated !== null) {
            service.insertNode(program!, updated)
                .then(updatedProgram => {
                    setProgram(updatedProgram);
                    notifications.success(`Node ${updated.node_no} added.`)
                })
        }
        setOpenNodeDialog(false);
    }

    return (program && node &&
        <>
            <Card>
                <CardHeader title={`${node.type}: ${node.node_no} ${node.name}`}
                    action={
                        <Stack
                            className="actions"
                            direction="row"
                            spacing={0.5}
                        >
                            <Tooltip title={`Add ${program?.node_types[0]}`}>
                                <IconButton
                                    onClick={(e) => {
                                        addNode();
                                        e.stopPropagation();
                                    }}
                                >
                                    <PlusCircleOutlined />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    } />
                <CardContent>
                    <ul>
<li>status</li>
<li>name</li>
<li>description</li>
<li>type</li>
<li>priority</li>
<li>due_date</li>
<li>assigned_to</li>
<li>comments</li>
<li>history</li>
<li>children</li>
                    </ul>
                    {/* <DragAndDrop
                        onChange={(c: Map<string, unknown>, t: TicketWrapper) => handleChange(c, t)}
                        items={items}
                        categories={categories}
                        cardRenderer={cardRenderer}
                        headerRenderer={headerRenderer} /> */}
                </CardContent>
            </Card >
            <NodeDialog
                node={childNode!}
                open={openNodeDialog}
                title={nodeDialogTitle}
                onChange={handleNodeChange}
            />
        </>
    );
}
