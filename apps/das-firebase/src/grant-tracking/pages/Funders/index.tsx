/**
 * projects/index.tsx
 * Example of firestore
*/


import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import EditIcon from '@mui/icons-material/Edit';
import { Card, CardHeader, Grid, IconButton, Stack, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode, useContext, useEffect, useState } from "react";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { FunderDialog } from '../../components/FunderDialog';
import { Toolbar } from "../../components/Toolbar";
import { FundersService } from '../../services/fundersService';
import { Funder } from '../../types';
import { ResearchCard } from "./ResearchCard";
import { UploadFundersCard } from "./UploadFundersCard";


export const FundersPage: React.FC = ({ }) => {
    const fundersService = FundersService.getInstance();

    const notifications = useNotifications();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [funders, setFunders] = useState<Funder[]>([]);
    const [funder, setFunder] = useState<Funder>(fundersService.empty());
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fundersService.getAll()
            .then(data => {
                if (active) {
                    console.log(data)
                    setFunders(data);
                }
            })
            .catch(err => {
                notifications.error('Error fetching profiles.');
                console.error('Error fetching profiles:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [refresh]);

    const handleEditClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            const found = funders.find(p => p.id?.toString() === id.toString());
            if (found) {
                setFunder(found);
                setShowDialog(true);
            }
        };
    }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setFunder(funders.find(p => p.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleAddClick = (): void => {
        setShowDialog(true);
        setFunder(fundersService.empty());
    }

    async function handleSuccess(changed: Funder | null): Promise<void> {
        if (changed) {
            try {
                if (changed.id) {
                    await fundersService.update(changed.id, changed);
                    notifications.success('Funder updated!');
                } else {
                    await fundersService.insert(changed);
                    notifications.success('Funder added!')
                }
            }
            catch (err) {
                handleError
            }
            finally {
                setRefresh(Date.now())
            }
        }
        setShowDialog(false);
    }

    async function handleDelete(): Promise<void> {
        await fundersService.delete(funder.id!);
        notifications.success('Funder deleted!')
        setShowDeleteDialog(false);
        setRefresh(Date.now());
    }

    const handleSearch = (search: string): void => {
        console.log(search);
    }

    const handleError = (err: Error): void => {
        console.error('Could not change funder', err);
        notifications.error('Sorry there was an error: ' + err.message)
    }

    function addButton(): ReactNode {
        return <Tooltip title="Add" >
            <IconButton color="primary" size="small" onClick={handleAddClick} aria-label="Export">
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
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 350 },
        { field: 'type', headerName: 'Type', flex: 1, minWidth: 150 },
        { field: 'address', headerName: 'Address', flex: 1.5, minWidth: 150 },
        {
            field: 'website', headerName: 'Website', flex: 1.5, minWidth: 150,
            renderCell: (params): ReactNode => {
                return <a href={`https://${params.row.website}`} target='_blank'>{params.row.website}</a>
            }
        },
    ];
    return (
        <Card sx={{ padding: 2 }}>
            <CardHeader title="Funders"></CardHeader>
            <Stack gap={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <UploadFundersCard />
                    </Grid>
                    <Grid size={6}>
                        <ResearchCard />
                    </Grid>
                </Grid>
                <Card>
                    <DataGrid
                        rows={funders}
                        columns={columns}
                        // initialState={{ pagination: { paginationModel } }}
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
            <FunderDialog
                entity={funder}
                open={showDialog}
                handleSuccess={handleSuccess} />
            <ConfirmationDialog
                message={funder ? `Delete project ${funder.name}` : ''}
                open={showDeleteDialog}
                handleConfirm={handleDelete}
                handleCancel={() => setShowDeleteDialog(false)} />
        </Card >
    );
}
