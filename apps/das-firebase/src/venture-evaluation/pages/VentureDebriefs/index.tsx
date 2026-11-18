/**
 * VentureDebriefs/index.tsx
 * List of venture evaluation debriefs (venture evaluation cards)
*/

import { DeleteOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, CardHeader, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { ReactNode, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { VentureDebriefService } from "../../services/VentureDebriefService";
import { VentureDebrief } from "../../types";

export const VentureDebriefsPage: React.FC = () => {
    const debriefService = VentureDebriefService.getInstance();

    const notifications = useNotifications();
    const navigate = useNavigate();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [debriefs, setDebriefs] = useState<VentureDebrief[]>([]);
    const [toDelete, setToDelete] = useState<VentureDebrief | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        debriefService.getAll()
            .then(data => {
                if (active) {
                    setDebriefs(data.map(debrief => debriefService.normalize(debrief)));
                }
            })
            .catch(err => {
                notifications.error('Error fetching venture debriefs.');
                console.error('Error fetching venture debriefs:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [refresh]);

    async function handleDelete(): Promise<void> {
        if (!toDelete) {
            return;
        }
        try {
            await debriefService.delete(toDelete.id!);
            notifications.success('Venture debrief deleted!');
            setRefresh(Date.now());
        }
        catch (err) {
            console.error('Could not delete venture debrief', err);
            notifications.error('Sorry there was an error: ' + (err as Error).message);
        }
        setToDelete(null);
    }

    function addButton(): ReactNode {
        return <Tooltip title="Add venture debrief">
            <IconButton color="primary" onClick={() => navigate('./new')} aria-label="Add venture debrief">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    const columns: GridColDef<VentureDebrief>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ row }) => [
                <GridActionsCellItem
                    icon={<FolderOpenOutlined />}
                    label="Open"
                    onClick={() => navigate(`./${row.id}`)}
                />,
                <GridActionsCellItem
                    icon={<DeleteOutlined />}
                    label="Delete"
                    onClick={() => setToDelete(row)}
                />,
            ],
        },
        {
            field: 'venture_name', headerName: 'Venture', flex: 1.5, minWidth: 200,
            renderCell: (params): ReactNode => <NavLink to={`./${params.row.id}`}>{params.value}</NavLink>
        },
        { field: 'evaluation_date', headerName: 'Evaluation Date', flex: 1, minWidth: 130 },
        { field: 'outcome', headerName: 'Outcome', flex: 0.75, minWidth: 100 },
        {
            field: 'sign_off', headerName: 'Sign Off', flex: 0.75, minWidth: 100,
            valueGetter: (value: VentureDebrief['sign_off']) => `${Object.values(value ?? {}).filter(Boolean).length} / 3`
        },
        { field: 'domain', headerName: 'Domain', flex: 1, minWidth: 150 },
        { field: 'solution_type', headerName: 'Solution Type', flex: 1, minWidth: 150 },
        {
            field: 'evaluators', headerName: 'Evaluators', flex: 1.5, minWidth: 200,
            valueGetter: (value: string[]) => (value ?? []).join(', ')
        },
        {
            field: 'tags', headerName: 'Tags', flex: 1.5, minWidth: 200,
            valueGetter: (value: string[]) => (value ?? []).join(', ')
        },
    ];

    return (
        <Card sx={{ padding: 2 }}>
            <CardHeader title="Venture Debriefs" action={addButton()}></CardHeader>
            <Stack gap={2}>
                <Card>
                    <DataGrid
                        rows={debriefs}
                        columns={columns}
                        initialState={{ sorting: { sortModel: [{ field: 'evaluation_date', sort: 'desc' }] } }}
                        pageSizeOptions={[5, 10, 25, 100]}
                        sx={{ border: 0, width: '100%', minWidth: 0 }}
                        showToolbar={true}
                    />
                </Card>
            </Stack>
            <ConfirmationDialog
                message={toDelete ? `Delete debrief for ${toDelete.venture_name}?` : ''}
                open={!!toDelete}
                handleConfirm={handleDelete}
                handleCancel={() => setToDelete(null)} />
        </Card >
    );
}
