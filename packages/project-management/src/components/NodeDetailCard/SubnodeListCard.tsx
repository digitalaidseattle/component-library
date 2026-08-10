/**
 * ProgamsListCard.tsx
 * 
 */

// material-ui
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridColumnHeaderParams
} from "@mui/x-data-grid";

import { PlusCircleOutlined } from "@ant-design/icons";
import { RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { Clipboard } from "@digitalaidseattle/mui";
import { ProgramService, useProfiles } from "../../services";
import { NodeService } from "../../services/NodeService";
import { Node, Profile } from "../../types";
import { NodeContext } from "../NodeContext";
import NodeDialog from "../NodeDialog";
import { ProgramContext } from "../ProgramContext";

type TableRow = Node & {
    profile: Profile | null
}
//
export const SubnodeListCard: React.FC = () => {
    const nodeService = NodeService.getInstance();
    const programService = ProgramService.getInstance();

    const { program } = useContext(ProgramContext);
    const { node } = useContext(NodeContext);

    const { data: profiles } = useProfiles();
    const [tableRows, setTableRows] = useState<TableRow[]>([]);

    const notifications = useNotifications();
    const navigate = useNavigate();
    const { setRefresh } = useContext(RefreshContext);

    const [openNodeDialog, setOpenNodeDialog] = useState<boolean>(false);
    const [nodeDialogTitle, setNodeDialogTitle] = useState<string>("");
    const [childNode, setChildNode] = useState<Node>();

    async function addNode() {
        if (program && node) {
            programService.createChild(program!, node.id as string)
                .then(nn => {
                    setChildNode(nn!);
                    setNodeDialogTitle(`Add ${nn.type}`)
                    setOpenNodeDialog(true);
                })
        }
    }

    function handleNodeChange(updated: Node | null): void {
        if (updated !== null) {
            programService.insertNode(program!, updated)
                .then(updatedProgram => {
                    setRefresh(0);
                    notifications.success(`Node ${updated.node_no} added.`)
                })
        }
        setOpenNodeDialog(false);
    }

    useEffect(() => {
        async function loadTableRows() {
            const rows: TableRow[] = [];
            if (node) {
                for (let child of node.children) {
                    const profile = (profiles ?? []).find(prof => prof.id === child.assignee_id);
                    rows.push({
                        ...child,
                        profile: profile
                    } as unknown as TableRow)
                }
                setTableRows(rows);
            }
        }
        loadTableRows();
    }, [node, profiles])

    const columns: GridColDef[] =
        [
            {
                field: "id",
                sortable: false,
                filterable: false,
                type: "custom",
                renderHeader: (params: GridColumnHeaderParams) => (
                    <Tooltip title={`Add ${programService.getChildType(program, node)}`}>
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                addNode();
                                e.stopPropagation();
                            }}
                        >
                            <PlusCircleOutlined />
                        </IconButton>
                    </Tooltip>
                ),
                renderCell: (params) => (
                    <Tooltip title={`Copy link`}>
                        <Clipboard text={window.location.origin + nodeService.getUrl(params.row)} />
                    </Tooltip>
                )
            },
            {
                field: "node_no",
                headerName: "No."
            },
            {
                field: "name",
                headerName: "Name"
            },
            {
                field: "status",
                headerName: "Status",
                type: "string",

            },
            {
                field: "profile",
                headerName: "Assigned_to",
                type: "custom",
                valueGetter: (_params, row) => {
                    return row.profile?.name;
                },
                renderCell: (params) => {
                    return params.row.profile &&
                        <Stack direction={'row'}>
                            <Avatar alt={params.row.profile?.name} src={params.row.profile?.pic} />
                            <Typography>{params.row.profile?.name} </Typography>
                        </Stack>
                }
            }
        ];

    return (
        <>
            <Card>
                <CardHeader title={programService.getChildType(program, node) + "(s)"} />
                <CardContent>
                    <DataGrid
                        rows={tableRows}
                        columns={columns}
                        showToolbar={false}
                        hideFooter={true}
                        onRowDoubleClick={params => navigate(nodeService.getUrl(params.row))}
                    />
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
