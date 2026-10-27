/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useNotifications } from "@digitalaidseattle/core";
import { TabbedPanels } from "@digitalaidseattle/mui";
import { Configuration, Kanban, Node, NodeWrapper, Program, ProgramContext, ProgramDialog } from "@digitalaidseattle/program-management";
import {
    Card,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { KanbanCard } from "./KanbanCard";
import { TaskList } from "./TaskList";

//
export const DetailCard: React.FC = () => {
    const programService = Configuration.getInstance().getProgramService();
    const notifications = useNotifications();

    const { program, setProgram } = React.useContext(ProgramContext);
    const [openProgramDialog, setOpenProgramDialog] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");

    React.useEffect(() => {
    }, [program]);

    function handleProgramChange(changed: Program | null): void {
        if (changed !== null) {
            programService.update(changed)
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
        alert('not implemented yet')
    }

    function renderCard(node: NodeWrapper, onFocusChange: (node: Node) => void): React.ReactNode {
        return <KanbanCard node={node} onFocusChange={onFocusChange} />
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
                        { header: <Typography>Kanban</Typography>, children: <Kanban cardRenderer={renderCard} /> },
                        { header: <Typography>List</Typography>, children: <TaskList /> },
                    ]}>
                    </TabbedPanels>
                }
            </Card >
            <ProgramDialog
                program={program!}
                open={openProgramDialog}
                title={programModalTitle}
                onChange={handleProgramChange} />
            {/* <NodeDialog
                node={selectedNode!}
                open={openNodeDialog}
                title={nodeDialogTitle}
                onChange={handleNodeChange} /> */}
        </>
    );
}
