import { CopyOutlined, DeleteOutlined, HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Box, Breadcrumbs, Card, CardContent, CardHeader, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { LoadingContext, useNotifications } from "@digitalaidseattle/core";
import { getContentGenerationServices } from "../services/contentGenerationServices";
import { Project } from "../services/types";
import { createProject } from "../transactions";
import { cloneProject } from "../transactions/CloneProject";
import { DateUtils } from "../utils/dateUtils";
import { deleteProject } from "../transactions/DeleteProject";

const ProjectsListCard: React.FC<{ detailPath?: string }> = ({ detailPath = "projects" }) => {
  const projectService = getContentGenerationServices().projectService;

  const notifications = useNotifications();
  const navigate = useNavigate();
  const { loading, setLoading } = React.useContext(LoadingContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    projectService
      .getAll()
      .then(data => setProjects(data))
      .catch(error => {
        console.error("Error fetching projects:", error);
        notifications.error(`Failed to retrieve projects: ${error instanceof Error ? error.message : "Unknown error"}`);
      })
      .finally(() => setLoading(false));
  }

  const handleRowDoubleClick = (params: GridRowParams<Project>) => {
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
      .all(selectedIds.map(id => deleteProject(id)))
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
    createProject()
      .then(project => navigate(`/${detailPath}/${project.id}`))
  }

  const handleClone = async () => {
    const project = projects.find(r => r.id === selectedIds[0]);
    if (project) {
      const inserted = await cloneProject(project);
      navigate(`/${detailPath}/${inserted.id}`);
    } else {
      notifications.error(`Failed to clone the project.`);
    }
  }

  function handleRowSelection(model: GridRowSelectionModel) {
    if (model) {
      if (model.type === "include") {
        setSelectedIds([...model.ids as unknown as string[]]);
      } else {
        const selected = projects
          .map(elem => elem.id as string)
          .filter(id => !model.ids.has(id));
        setSelectedIds(selected);
      }
    }
  }

  const columns: GridColDef<Project>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "tokenCount",
      headerName: "Token Count",
      width: 130,
      type: "number",
    },
    {
      field: "modelType",
      headerName: "Model Type",
      width: 180,
    },

    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      valueGetter: (_value, row) => DateUtils.formatDateTime(row.updated_at!),
    }
  ];

  function CustomToolbar() {
    return (
      <Toolbar sx={{ gap: 2, backgroundColor: 'background.default' }}>
        <Tooltip title="Add Project">
          <Box>
            <IconButton color="primary"
              onClick={handleAdd} >
              <PlusCircleOutlined />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Clone Project">
          <Box>
            <IconButton color="primary"
              onClick={handleClone}
              disabled={selectedIds.length !== 1} >
              <CopyOutlined />
            </IconButton>
          </Box>
        </Tooltip>
        <Tooltip title="Delete Projects">
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
        <CardHeader title="Projects" />
        <CardContent>
          <DataGrid
            rows={projects}
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

export { ProjectsListCard };
