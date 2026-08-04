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
import { ProgramDialog } from "../components";
import NodeDialog from "../components/NodeDialog";
import Outline from "../components/Outline";
import { ProgramContext } from "../components/ProgramContext";
import { ProgramService } from "../services";
import { Node, Program } from "../types";

//
export const ProgramDetailCard: React.FC = () => {
    const service = ProgramService.getInstance();

    const [openProgramDialog, setOpenProgramDialog] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");

    const [openNodeDialog, setOpenNodeDialog] = useState<boolean>(false);
    const [nodeDialogTitle, setNodeDialogTitle] = useState<string>("");
    const [childNode, setChildNode] = useState<Node>();

    const notifications = useNotifications();
    const { program, setProgram } = React.useContext(ProgramContext);

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

    function editSettings() {
        if (program) {
            setProgramModalTitle(`Edit Program: ${program.name}`);
            setOpenProgramDialog(true);
        }
    }

    function handleCloseProgramDialog(): void {
        setOpenProgramDialog(false);
    }

    function handleSubmitProgramDialog(changed: Program): void {
        service.update(changed)
            .then(updated => {
                setProgram(updated);
                setOpenProgramDialog(false);
                notifications.success(`Changes saved.`)
            })
    }

    return (program &&
        <>
            <Card>
                <CardHeader title={`Program: ${program?.name}`}
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
                            <Tooltip title="Edit program setting">
                                <IconButton
                                    onClick={(e) => {
                                        editSettings();
                                        e.stopPropagation();
                                    }}
                                >
                                    <SettingOutlined />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    } />
                <CardContent>
                    {program && <Outline program={program} />}
                    {/* <DragAndDrop
                        onChange={(c: Map<string, unknown>, t: TicketWrapper) => handleChange(c, t)}
                        items={items}
                        categories={categories}
                        cardRenderer={cardRenderer}
                        headerRenderer={headerRenderer} /> */}
                </CardContent>
            </Card >
            <ProgramDialog
                program={program!}
                opened={openProgramDialog}
                title={programModalTitle}
                onClose={handleCloseProgramDialog}
                onSubmit={handleSubmitProgramDialog} />
            <NodeDialog
                node={childNode!}
                open={openNodeDialog}
                title={nodeDialogTitle}
                onChange={handleNodeChange}
            />
        </>
    );
}
