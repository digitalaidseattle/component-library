/**
 * projects/index.tsx
 * Example of firestore
*/


import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardHeader, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode, useContext, useEffect, useState } from "react";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { Toolbar } from "../../components/Toolbar";
import { GrantProgramService } from "../../services/grantProgramService";
import { GrantProgram } from '../../types';
import { UploadProgramsCard } from "./UploadProgramsCard";



export const GrantProgramsPage: React.FC = ({ }) => {
    const service = GrantProgramService.getInstance();

    const notifications = useNotifications();
    const { setLoading } = useContext(LoadingContext);
    const { refresh } = useContext(RefreshContext);

    const [programs, setPrograms] = useState<GrantProgram[]>([]);
    const [funder, setFunder] = useState<GrantProgram>(service.empty());
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        service.getAll()
            .then(data => {
                if (active) {
                    console.log(data)
                    setPrograms(data);
                }
            })
            .catch(err => {
                notifications.error('Error fetching grant programs.');
                console.error('Error fetching grant programs:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [refresh]);

    const handleEditClick = (_id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            alert('Not ready')
        };
    }

    // const handleSuccess = (changed: GrantProgram | null): void => {
    //     if (changed) {
    //         if (changed.id) {
    //             service.update(changed.id, changed)
    //             success('Funder updated!')
    //         } else {
    //             service.insert(changed)
    //             success('Funder added!')
    //         }
    //     }
    //     setShowDialog(false);
    // }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setFunder(programs.find(p => p.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleDelete = (): void => {
        service.delete(funder.id!)
        setShowDeleteDialog(false);
    }

    const handleAdd = (): void => {
        alert('Not ready')
    }


    const handleSearch = (search: string): void => {
        alert(search);
    }


    function addButton(): ReactNode {
        return <Tooltip title="Add" >
            <IconButton color="primary" size="small" onClick={handleAdd} aria-label="Export">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
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
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'focus_areas', headerName: 'Focus Areas', flex: 2, minWidth: 200 },
        { field: 'population_focus', headerName: 'Population Focus', flex: 1, minWidth: 150 },
        { field: 'mission_alignment', headerName: 'Mission Alignment', flex: 1.5, minWidth: 150 },
        { field: 'grant_range', headerName: 'Grant Range', flex: 1.5, minWidth: 150 },
        {
            field: 'website', headerName: 'Website', flex: 1.5, minWidth: 150,
            renderCell: (params): ReactNode => {
                return <a href={`https://${params.row.website}`} target='_blank'>{params.row.website}</a>
            }
        },
    ];
    return (
        <Card>
            <CardHeader title="Grant Programs"></CardHeader>
            <Stack gap={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <UploadProgramsCard />
                    </Grid>
                    <Grid size={6}>
                        <Box />
                    </Grid>
                </Grid>
                <Card>
                    <DataGrid
                        rows={programs}
                        columns={columns}
                        // initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 100]}
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
            {/* <FunderDialog
                entity={funder}
                open={showDialog}
                handleSuccess={handleSuccess} /> */}
            <ConfirmationDialog
                message={funder ? `Delete project ${funder.name}` : ''}
                open={showDeleteDialog}
                handleConfirm={handleDelete}
                handleCancel={() => setShowDeleteDialog(false)} />
        </Card >
    );
}
