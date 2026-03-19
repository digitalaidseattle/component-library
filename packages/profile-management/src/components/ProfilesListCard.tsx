import React, { useEffect, useState } from "react";


import { CopyOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Box, Card, CardContent, CardHeader, IconButton, Toolbar, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { LoadingContext, useNotifications } from "@digitalaidseattle/core";
import { getConfiguration, ProfileService } from "../services";
import { Profile } from "../api";

export const ProfilesListCard: React.FC<{ detailPath?: string }> = ({ detailPath = "profile" }) => {

    const profileService = ProfileService.getInstance();

    const notifications = useNotifications();
    const navigate = useNavigate();
    const { loading, setLoading } = React.useContext(LoadingContext);
    const [profile, setProfiles] = useState<Profile[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        setLoading(true);
        profileService
            .getAll()
            .then(data => setProfiles(data))
            .catch(error => {
                console.error("Error fetching projects:", error);
                notifications.error(`Failed to retrieve projects: ${error instanceof Error ? error.message : "Unknown error"}`);
            })
            .finally(() => setLoading(false));
    }

    const handleRowDoubleClick = (params: GridRowParams<Profile>) => {
        if (params.row.id) {
            navigate(`/${detailPath}/${params.row.id}`);
        }
    };

    const handleDelete = () => {
        // Confirm deletion
        const confirmed = window.confirm(
            "Are you sure you want to delete the projects? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        Promise
            .all(selectedIds.map(id => profileService.delete(id)))
            .then(() => {
                fetchData();
                notifications.success("Projects deleted!")
            })
            .catch(error => {
                console.error("Error deleting project:", error);
                notifications.error(`Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`);
            })
            .finally(() => setLoading(false));
    }

    const handleAdd = async () => {
        profileService.create()
            .then(profile => navigate(`/${detailPath}/${profile.id}`))
    }

    function handleRowSelection(model: GridRowSelectionModel) {
        if (model) {
            if (model.type === "include") {
                setSelectedIds([...model.ids as unknown as string[]]);
            } else {
                const selected = profile
                    .map(elem => elem.id as string)
                    .filter(id => !model.ids.has(id));
                setSelectedIds(selected);
            }
        }
    }

    const columns: GridColDef<Profile>[] = [
        {
            field: "name",
            headerName: "Name",
            width: 300
        },
        {
            field: "first_name",
            headerName: "First Name",
        },
        {
            field: "last-name",
            headerName: "Last Name",
        },
        {
            field: "email",
            headerName: "Email",
        }
    ];

    function CustomToolbar() {
        return (
            <Toolbar sx={{ gap: 2, backgroundColor: 'background.default' }}>
                <Tooltip title="Add Profile">
                    <Box>
                        <IconButton color="primary"
                            onClick={handleAdd} >
                            <PlusCircleOutlined />
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Delete Profile(s)">
                    <Box>
                        <IconButton color="error"
                            onClick={handleDelete}
                            disabled={selectedIds.length === 0} >
                            <DeleteOutlined />
                        </IconButton>
                    </Box>
                </Tooltip>
            </Toolbar>
        );
    }

    return (
        <>
            <Card>
                <CardHeader title="Profiles" />
                <CardContent sx={{ width: '100%' }}>
                    <DataGrid
                        rows={profile}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id || ""}
                        onRowDoubleClick={handleRowDoubleClick}

                        showToolbar={true}
                        slots={{
                            toolbar: CustomToolbar
                        }}

                        checkboxSelection={true}
                        onRowSelectionModelChange={handleRowSelection}

                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                            sorting: {
                                sortModel: [{ field: 'updatedAt', sort: 'desc' }],
                            },
                        }}

                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            width: '100%',
                            "& .MuiDataGrid-row": {
                                cursor: "pointer",
                            },
                            "& .MuiDataGrid-cell": {
                                display: "flex",
                                alignItems: "center",
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
};

