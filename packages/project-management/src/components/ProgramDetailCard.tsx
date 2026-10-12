/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useNotifications } from "@digitalaidseattle/core";
import { TabbedPanels } from "@digitalaidseattle/mui";
import {
    Card,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { ProgramDialog } from "../components";
import Outline from "../components/Outline";
import { ProgramContext } from "../components/ProgramContext";
import { ProgramService } from "../services";
import { Node, Program } from "../types";
import { Kanban } from "./Kanban";
import { Summary } from "./Summary";
import NodeDialog from "./NodeDialog";

//
export const ProgramDetailCard: React.FC = () => {
    const service = ProgramService.getInstance();
    const notifications = useNotifications();

    const { program, setProgram } = React.useContext(ProgramContext);
    const [openProgramDialog, setOpenProgramDialog] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");

    const [selectedNode, setSelectedNode] = useState<Node>();
    const [openNodeDialog, setOpenNodeDialog] = useState<boolean>(false);
    const [nodeDialogTitle, setNodeDialogTitle] = useState<string>("");

    React.useEffect(() => {
    }, [program]);

    function handleProgramChange(changed: Program | null): void {
        if (changed !== null) {
            service.update(changed)
                .then(updated => {
                    setProgram(updated);
                    setOpenProgramDialog(false);
                    notifications.success(`Program changes saved.`)
                })
        } else {
            setOpenProgramDialog(false);
        }
    }

    function editSettings() {
        setProgramModalTitle(`Edit Program: ${program.name}`);
        setOpenProgramDialog(true);
    }

    async function addNode() {
        service.createChild(program!)
            .then(node => {
                setSelectedNode(node);
                setNodeDialogTitle(`Add ${node.type}`)
                setOpenNodeDialog(true);
            })
    }

    function handleNodeChange(updated: Node | null): void {
        if (updated !== null) {
            service.insertNode(program!, updated)
                .then(updatedProgram => {
                    setProgram(updatedProgram);
                    setOpenNodeDialog(false);
                    notifications.success(`Added ${updated.name}.`)
                })
        } else {
            setOpenNodeDialog(false);

        }
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
                {program &&
                    <TabbedPanels panels={[
                        { header: <Typography>Kanban</Typography>, children: <Kanban /> },
                        { header: <Typography>Outline</Typography>, children: <Outline /> },
                        { header: <Typography>Summary</Typography>, children: <Summary /> },
                    ]}>
                    </TabbedPanels>
                }
            </Card >
            <ProgramDialog
                program={program!}
                open={openProgramDialog}
                title={programModalTitle}
                onChange={handleProgramChange} />
            <NodeDialog
                node={selectedNode!}
                open={openNodeDialog}
                title={nodeDialogTitle}
                onChange={handleNodeChange} />
        </>
    );
}
