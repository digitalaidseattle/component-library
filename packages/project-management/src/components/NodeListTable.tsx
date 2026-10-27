/**
 * ProgamsListCard.tsx
 * 
 */

// material-ui
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Box,
    IconButton,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridColumnHeaderParams,
    GridRowParams
} from "@mui/x-data-grid";

import { PlusCircleOutlined } from "@ant-design/icons";
import { RefreshContext } from "@digitalaidseattle/core";
import { Clipboard } from "@digitalaidseattle/mui";
import { Configuration } from "../Configuration";
import { useProfiles } from "../services";
import { Node, Profile } from "../types";
import { ProgramContext } from "./ProgramContext";

type TableRow = Node & {
    profile: Profile | null
}

type NodeListTableProps = {
    nodes: Node[];
    onSelect?: (node: Node) => void;
    onAdd?: () => Promise<void>;
}
//
export const NodeListTable: React.FC<NodeListTableProps> = ({ nodes, onSelect, onAdd }) => {
    const nodeService = Configuration.getInstance().getNodeService();
    const navigate = useNavigate();
    const { refresh, setRefresh } = useContext(RefreshContext);
    const { data: profiles } = useProfiles();
    const { program } = useContext(ProgramContext);

    const [tableRows, setTableRows] = useState<TableRow[]>([]);

    useEffect(() => {
        async function loadTableRows() {
            const rows: TableRow[] = [];
            for (let child of nodes) {
                const profile = (profiles ?? []).find(prof => prof.id === child.assignee_id);
                rows.push({
                    ...child,
                    profile: profile
                } as unknown as TableRow)
            }
            setTableRows(rows);
        }
        loadTableRows();
    }, [nodes, refresh, profiles])

    function handleAssignmentChange(row: TableRow, value: string): void {
        const assigneeId = value === "" ? null : value;
        const { profile, ...node } = row;
        nodeService.changeAssignment(node as Node, 'assignee_id', assigneeId)
            .then(() => {
                setTableRows(rows => rows.map(r => r.id === row.id
                    ? { ...r, assignee_id: assigneeId, profile: (program?.members ?? []).find(mem => mem.id === assigneeId) ?? null }
                    : r));
                setRefresh(Date.now());
            })
    }

    function handleStatusChange(row: TableRow, status: string): void {
        const { profile, ...node } = row;
        nodeService.changeAttribute(node as Node, 'status', status)
            .then(() => {
                setTableRows(rows => rows.map(r => r.id === row.id ? { ...r, status } : r));
                setRefresh(Date.now());
            })
    }

    // Program statuses, plus the current status if it is no longer configured
    function statusOptions(row: TableRow): string[] {
        const statuses = program?.node_statuses ?? [];
        return row.status && !statuses.includes(row.status)
            ? [row.status, ...statuses]
            : statuses;
    }

    // Program members, plus the current assignee if they are no longer a member
    function memberOptions(row: TableRow): Profile[] {
        const members = program?.members ?? [];
        return row.profile && !members.some(mem => mem.id === row.profile!.id)
            ? [row.profile, ...members]
            : members;
    }

    const columns: GridColDef[] =
        [
            {
                field: "id",
                sortable: false,
                filterable: false,
                type: "custom",
                renderHeader: (params: GridColumnHeaderParams) => (
                    onAdd
                        ? (
                            <Tooltip title={'Add'}>
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        onAdd();
                                        e.stopPropagation();
                                    }}
                                >
                                    <PlusCircleOutlined />
                                </IconButton>
                            </Tooltip>
                        )
                        : null
                ),
                renderCell: (params) => (
                    <Tooltip title={`Copy link`}>
                        <Box>
                            <Clipboard text={window.location.origin + nodeService.getUrl(params.row)} />
                        </Box>
                    </Tooltip>
                )
            },
            {
                field: "node_no",
                headerName: "No."
            },
            {
                field: "name",
                headerName: "Name",
                width: 400
            },
            {
                field: "status",
                headerName: "Status",
                type: "string",
                width: 150,
                display: 'flex',
                renderCell: (params) => (
                    <Select
                        value={params.row.status ?? ""}
                        variant="standard"
                        disableUnderline
                        fullWidth
                        displayEmpty
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onChange={(ev) => handleStatusChange(params.row, ev.target.value as string)}
                    >
                        {statusOptions(params.row).map(status =>
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        )}
                    </Select>
                )
            },
            {
                field: "profile",
                headerName: "Assigned To",
                type: "custom",
                width: 200,
                display: 'flex',
                valueGetter: (_params, row) => {
                    return row.profile?.name;
                },
                renderCell: (params) => (
                    <Select
                        value={params.row.assignee_id ?? ""}
                        variant="standard"
                        disableUnderline
                        fullWidth
                        displayEmpty
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onChange={(ev) => handleAssignmentChange(params.row, ev.target.value as string)}
                    >
                        <MenuItem value="">
                            <Typography color="text.secondary">Unassigned</Typography>
                        </MenuItem>

                        {memberOptions(params.row).map(profile =>
                            <MenuItem key={profile.id} value={profile.id as string}>
                                <Stack direction={'row'} alignItems={'center'} gap={1}>
                                    <Avatar alt={profile.name} src={profile.pic} sx={{ width: 24, height: 24 }} />
                                    <Typography>{profile.name}</Typography>
                                </Stack>
                            </MenuItem>
                        )}
                    </Select>
                )
            }
        ];

    function handleOpenNode(params: GridRowParams<any>): void {
        const node = params.row;
        navigate(`../${node.node_no}`, { relative: "path" })
    }

    return (
        <>
            <DataGrid
                rows={tableRows}
                columns={columns}
                showToolbar={false}
                hideFooter={true}
                onRowDoubleClick={handleOpenNode}
            />
        </>
    );
}
