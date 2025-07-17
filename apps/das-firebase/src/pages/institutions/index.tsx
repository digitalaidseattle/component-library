/**
 * projects/index.tsx
 * Example of firestore
*/

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Card, CircularProgress, Paper, Stack, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { MouseEventHandler, useState } from "react";

import { useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { institutionAiService } from './institutionAiService';
import InstitutionDialog from './institutionDialog';
import { Institution, institutionService } from './institutionService';



const InstitutionsPage: React.FC = ({ }) => {
    const { success } = useNotifications();
    const [thinking, setThinking] = useState<boolean>(false);

    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [institution, setInstitution] = useState<Institution>(institutionService.empty());
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("List five philanthropic institutions near Seattle.");

    const newInstitution = () => {
        setInstitution(institutionService.empty());
        setShowDialog(true);
    }

    function query() {
        setThinking(true)
        institutionAiService.query(prompt)
            .then((response: any) => {
                console.log("AI Response: ", response.characters);
                const indexed = (response.characters as Institution[])
                    .map((inst, idx) => {
                        return {
                            ...inst,
                            id: idx
                        } as Institution
                    })
                console.log("indexed AI Response: ", indexed);
                setInstitutions(indexed);
            })
            .finally(() => setThinking(false))
    }

    const handleEditClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            const found = institutions.find(p => p.id?.toString() === id.toString())!;
            setInstitution(found);
            setShowDialog(true);
        };
    }

    const handleSuccess = (changed: Institution | null): void => {
        if (changed) {
            if (changed.id) {
                institutionService.update(changed.id, changed)
                success('Institution updated!')
            } else {
                institutionService.insert(changed)
                success('Institution added!')
            }
        }
        setShowDialog(false);
    }

    const handleError = (err: Error): void => {
        setShowDialog(false);
        success('Sorry there was an error: ' + err.message)
    }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setInstitution(institutions.find(p => p.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleDelete = (): void => {
        institutionService.delete(institution.id!)
        setShowDeleteDialog(false);
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
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'address', headerName: 'Address', width: 300 },
    ];
    return (
        <Stack gap={2}>
            <Card sx={{ padding: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Prompt"
                    fullWidth
                    value={prompt}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPrompt(event.target.value);
                    }}
                ></TextField>
                <Button
                    variant="outlined"
                    size="medium"
                    disabled={thinking}
                    onClick={query}>Search {thinking && <CircularProgress />}</Button>
            </Card>

            <Box>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => newInstitution()}>New Institution</Button>
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={institutions}
                    columns={columns}
                    // initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 100]}
                    sx={{ border: 0 }}
                />
            </Paper>
            <InstitutionDialog
                entity={institution}
                open={showDialog}
                handleSuccess={handleSuccess}
                handleError={handleError} />
            <ConfirmationDialog
                message={institution ? `Delete project ${institution.name}` : ''}
                open={showDeleteDialog}
                handleConfirm={handleDelete}
                handleCancel={() => setShowDeleteDialog(false)} />
        </Stack>
    );
}

export default InstitutionsPage;
