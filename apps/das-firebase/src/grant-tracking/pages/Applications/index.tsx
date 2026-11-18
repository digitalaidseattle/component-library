/**
 * Applications/index.tsx
 * List of grant applications
*/


import { DeleteOutlined, FolderOpenOutlined, PlusOutlined } from "@ant-design/icons";

import { Card, CardHeader, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { GrantApplicationDialog } from '../../components/GrantApplicationDialog';
import { Toolbar } from "../../components/Toolbar";
import { GrantApplicationService } from '../../services/grantApplicationService';
import { GrantProgramService } from '../../services/grantProgramService';
import { GrantApplication, GrantProgram } from '../../types';


export const GrantApplicationsPage: React.FC = ({ }) => {
    const applicationService = GrantApplicationService.getInstance();
    const programService = GrantProgramService.getInstance();

    const notifications = useNotifications();
    const navigate = useNavigate();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [applications, setApplications] = useState<GrantApplication[]>([]);
    const [programs, setPrograms] = useState<GrantProgram[]>([]);
    const [application, setApplication] = useState<GrantApplication>(applicationService.empty());
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        Promise.all([applicationService.getAll(), programService.getAll()])
            .then(([allApplications, allPrograms]) => {
                if (active) {
                    setApplications(allApplications);
                    setPrograms(allPrograms);
                }
            })
            .catch(err => {
                notifications.error('Error fetching grant applications.');
                console.error('Error fetching grant applications:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [refresh]);

    const handleEditClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            navigate(`./${id}`);
        };
    }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setApplication(applications.find(a => a.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleAddClick = (): void => {
        setApplication({ ...applicationService.empty(), status: 'To Apply' });
        setShowDialog(true);
    }

    async function handleSuccess(changed: GrantApplication | null): Promise<void> {
        if (changed) {
            try {
                if (changed.id) {
                    await applicationService.update(changed.id, changed);
                    notifications.success('Grant application updated!');
                } else {
                    await applicationService.insert(changed);
                    notifications.success('Grant application added!')
                }
                setRefresh(Date.now())
            }
            catch (err) {
                handleError(err as Error);
            }
        }
        setShowDialog(false);
    }

    async function handleDelete(): Promise<void> {
        try {
            await applicationService.delete(application.id!);
            notifications.success('Grant application deleted!')
            setRefresh(Date.now());
        }
        catch (err) {
            handleError(err as Error);
        }
        setShowDeleteDialog(false);
    }

    const handleSearch = (search: string): void => {
        console.log(search);
    }

    const handleError = (err: Error): void => {
        console.error('Could not change grant application', err);
        notifications.error('Sorry there was an error: ' + err.message)
    }

    function programName(programId: string): string {
        return programs.find(p => p.id?.toString() === programId)?.name ?? '';
    }

    function addButton(): ReactNode {
        return <Tooltip title="Add" >
            <IconButton color="primary" size="small" onClick={handleAddClick} aria-label="Add grant application">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    const columns: GridColDef<GrantApplication>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<FolderOpenOutlined />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        {
            field: 'grant_program_id', headerName: 'Grant Program', flex: 1.5, minWidth: 250,
            valueGetter: (value: string) => programName(value),
            renderCell: (params): ReactNode => {
                return params.row.grant_program_id
                    ? <NavLink to={`/grant-tracking/programs/${params.row.grant_program_id}`}>{params.value}</NavLink>
                    : '';
            }
        },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 250 },
        { field: 'notes', headerName: 'Notes', flex: 2, minWidth: 250 },
    ];
    return (
        <Card sx={{ padding: 2 }}>
            <CardHeader title="Grant Applications"></CardHeader>
            <Stack gap={2}>
                <Card>
                    <DataGrid
                        rows={applications}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 100]}
                        sx={{ border: 0, width: '100%', minWidth: 0 }}
                        showToolbar={true}
                        slots={{ toolbar: Toolbar }}
                        slotProps={{
                            toolbar: {
                                tools: addButton(),
                                onSearch: handleSearch
                            }
                        }}
                    />
                </Card>
            </Stack>
            <GrantApplicationDialog
                entity={application}
                programs={programs}
                open={showDialog}
                handleSuccess={handleSuccess} />
            <ConfirmationDialog
                message={application ? `Delete application for ${programName(application.grant_program_id) || 'this program'}` : ''}
                open={showDeleteDialog}
                handleConfirm={handleDelete}
                handleCancel={() => setShowDeleteDialog(false)} />
        </Card >
    );
}
