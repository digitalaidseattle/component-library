/**
 * projects/index.tsx
 * Example of firestore
*/

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Paper, Stack } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { MouseEventHandler, useContext, useEffect, useState } from "react";

import { RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";

import ProjectDialog from "./projectDialog";
import { Project, projectService } from "./projectService";

const emptyProject = () => {
    return {
        id: undefined,
        airtableId: "",
        createdAt: new Date(),
        createdBy: "",
        name: "",
        partner: "",
        status: ""
    }
}
const ProjectsPage: React.FC = ({ }) => {
    const { refresh, setRefresh } = useContext(RefreshContext);
    const { success } = useNotifications();

    const [projects, setProjects] = useState<Project[]>([]);
    const [project, setProject] = useState<Project>(emptyProject());
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        projectService.getAll()
            .then(pp => {
                setProjects(pp)
            });
    }, [refresh]);

    const newProject = () => {
        setShowDialog(true);
        setProject(emptyProject());
    }

    const handleEditClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setProject(projects.find(p => p.id === id.toString())!)
            setShowDialog(true);
        };
    }

    const handleSuccess = (changed: Project | null): void => {
        if (changed) {
            if (changed.id) {
                projectService.update(changed)
                success('Project updated!')
            } else {
                projectService.add(changed)
                success('Project added!')
            }
        }
        setRefresh(refresh + 1);
        setShowDialog(false);
    }

    const handleError = (err: Error): void => {
        setShowDialog(false);
        success('Sorry there was an error: ' + err.message)
    }

    const handleDeleteClick = (id: GridRowId): MouseEventHandler<HTMLButtonElement> | undefined => {
        return () => {
            setProject(projects.find(p => p.id === id.toString())!)
            setShowDeleteDialog(true);
        };
    }

    const handleDelete = (): void => {
        projectService.delete(project)
        setRefresh(refresh + 1);
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
        { field: 'id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'partner', headerName: 'Partner', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
    ];
    return (
        <Stack gap={2}>
            <Box>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => newProject()}>New Project</Button>
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={projects}
                    columns={columns}
                    // initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 100]}
                    sx={{ border: 0 }}
                />
            </Paper>
            <ProjectDialog
                entity={project}
                open={showDialog}
                handleSuccess={handleSuccess}
                handleError={handleError} />
            <ConfirmationDialog
                message={project ? `Delete project ${project.name}` : ''}
                open={showDeleteDialog}
                handleConfirm={handleDelete}
                handleCancel={() => setShowDeleteDialog(false)} />
        </Stack>
    );
}

export default ProjectsPage;
