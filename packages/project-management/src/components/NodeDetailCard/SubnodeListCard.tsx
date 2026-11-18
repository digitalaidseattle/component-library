/**
 * ProgamsListCard.tsx
 * 
 */

// material-ui
import React, { useContext, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader
} from '@mui/material';

import { RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { Configuration } from "../../Configuration";
import { Node, Profile } from "../../types";
import { NodeContext } from "../NodeContext";
import NodeDialog from "../NodeDialog";
import { NodeListTable } from "../NodeListTable";
import { ProgramContext } from "../ProgramContext";

type TableRow = Node & {
    profile: Profile | null
}
//
export const SubnodeListCard: React.FC = () => {
    const programService = Configuration.getInstance().getProgramService();

    const { program } = useContext(ProgramContext);
    const { node } = useContext(NodeContext);

    const notifications = useNotifications();
    const { setRefresh } = useContext(RefreshContext);

    const [openNodeDialog, setOpenNodeDialog] = useState<boolean>(false);
    const [nodeDialogTitle, setNodeDialogTitle] = useState<string>("");
    const [childNode, setChildNode] = useState<Node>();

    function handleNodeChange(updated: Node | null): void {
        if (updated !== null) {
            programService.insertNode(program!, updated)
                .then(updatedProgram => {
                    setRefresh(Date.now());
                    notifications.success(`Node ${updated.node_no} added.`)
                })
        }
        setOpenNodeDialog(false);
    }

    async function handleAdd(): Promise<void> {
        if (program && node) {
            programService.createChild(program!, node.id as string)
                .then(nn => {
                    setChildNode(nn!);
                    setNodeDialogTitle(`Add ${nn.type}`)
                    setOpenNodeDialog(true);
                })
        }
    }

    return (
        <>
            <Card>
                <CardHeader title={programService.getChildType(program, node) + "(s)"} />
                <CardContent>
                    <NodeListTable
                        nodes={node.children}
                        onAdd={handleAdd} />
                </CardContent>
            </Card>
            <NodeDialog
                title={nodeDialogTitle}
                node={childNode!}
                open={openNodeDialog}
                onChange={handleNodeChange} />
        </>
    );
}
