/**
 * grants/index.tsx
 * Example of firestore
*/
import { AddOutlined, ContentCopyOutlined, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import dayjs from "dayjs";
import { MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from 'react-router';

import { useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog, useHelp } from "@digitalaidseattle/mui";
import { GrantRecipe, grantService } from "../services";

const GrantsPage: React.FC = ({ }) => {
    const notifications = useNotifications();
    const navigate = useNavigate();
    const { showHelp, setShowHelp } = useHelp();

    const [grantProposals, setGrantProposals] = useState<GrantRecipe[]>([]);
    const [grantProposal, setGrantProposal] = useState<GrantRecipe>(grantService.empty());
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        console.log('its', showHelp)
        if (showHelp) {
            notifications.info('You got no help on this page.');
            setShowHelp(false);
        }
    }, [showHelp]);

    function refresh() {
        setGrantProposals([]);
        grantService
            .getAll()
            .then(response => setGrantProposals(response))
            .catch(error => {
                console.error('Error invoking function:', error);
                notifications.error(error.message)
            });
    }

    const handleNewClick = () => {
        navigate('/grant-proposal/@new')
    }

    const handleEditClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            navigate(`/grant-proposal/${id}`)
        };
    }

    const handleDuplicateClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setGrantProposal(grantProposals.find(gp => gp.id === id.toString())!)
        };
    }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setGrantProposal(grantProposals.find(gp => gp.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleDelete = (): void => {
        grantService.delete(grantProposal.id!)
            .then(() => {
                notifications.success(`Grant proposal ${grantProposal.description} has been deleted.`);
                refresh();
            })
            .finally(() => {
                setShowDeleteDialog(false);
            })
    }

    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            renderHeader: (_params) => (
                <IconButton color="primary"
                    aria-label="New Grant"
                    title="New Grant"
                    onClick={() => handleNewClick()}>
                    <AddOutlined />
                </IconButton>
            ),
            width: 200,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditOutlined />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<ContentCopyOutlined />}
                        label="Duplicate"
                        onClick={handleDuplicateClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlineOutlined />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        { field: 'description', headerName: 'Description', width: 300 },
        {
            field: 'submitted', headerName: 'Submitted', width: 150,
            renderCell: (params => {
                const submitted = params.row.submitted;
                return submitted ? dayjs(submitted).format("MMM d, YYYY") : ''
            })
        },
        { field: 'tokenCount', headerName: 'Token Count', width: 100 },
        { field: 'response', headerName: 'Response', width: 300 },
    ];
    return (
        <Card>
            <CardHeader title="Grant Proposals" />
            <CardContent>
                <DataGrid
                    rows={grantProposals}
                    columns={columns}
                    // initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 100]}
                    sx={{ border: 0 }}
                />
                <ConfirmationDialog
                    message={grantProposal ? `Delete proposal ${grantProposal.description}` : ''}
                    open={showDeleteDialog}
                    handleConfirm={handleDelete}
                    handleCancel={() => setShowDeleteDialog(false)} />
            </CardContent>
        </Card>
    );
}

export default GrantsPage;
