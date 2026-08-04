/**
 * ProgamsListCard.tsx
 * 
 */

// material-ui
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Card,
    CardContent,
    IconButton,
    Stack,
    Tooltip
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridColumnHeaderParams,
    GridFilterModel,
    GridSortModel
} from "@mui/x-data-grid";

import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ProgramDialog } from "../components";
import { ProgramService } from "../services";
import { Profile, Program } from "../types";

const DETAIL_PAGE = "programs";  // TODO consider making configurable
//
export const ProgamsListCard: React.FC = () => {
    const service = ProgramService.getInstance();

    const [programs, setPrograms] = useState<Program[]>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'prefix', sort: 'asc' }]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

    const [openProgramModal, setOpenProgramModal] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");
    const [program, setProgram] = useState<Program>();
    const [isNewProgram, setIsNewProgram] = useState<boolean>(false);

    const notifcations = useNotifications();
    const navigate = useNavigate();
    const { refresh } = useContext(RefreshContext);

    const fetchData = useCallback(() => {
        service.findActive()
            .then(pps => setPrograms(pps))
            .catch(err => {
                console.error("Error fetching programs", err);
                notifcations.error(`Error fetching programs: ${err.message}`);
            });
    }, [])

    useEffect(() => {
        let active = true;
        if (active) {
            fetchData();
        }
        return () => {
            active = false;
        }
    }, [service, refresh, fetchData]);

    const columns: GridColDef[] =
        [
            {
                field: "id",
                sortable: false,
                filterable: false,
                type: "custom",
                renderHeader: (params: GridColumnHeaderParams) => (
                    <Tooltip title={`Add Program`}>
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                handleOpenProgramModal(true);
                                e.stopPropagation();
                            }}
                        >
                            <PlusCircleOutlined />
                        </IconButton>
                    </Tooltip>
                ),
                renderCell: (params) => (
                    <Tooltip title={`Edit program settings`}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                handleEditProgram(params.row);
                                e.stopPropagation();
                            }}
                        >
                            <SettingOutlined />
                        </IconButton>
                    </Tooltip>
                )
            },
            {
                field: "prefix",
                headerName: "Prefix",
                type: "string"
            },
            {
                field: "name",
                headerName: "Name",
                type: "string",
                width: 200
            },
            {
                field: "description",
                headerName: "Description",
                type: "string",
                width: 200
            },
            {
                field: "members",
                headerName: "Members",
                flex: 50,
                sortable: false,
                filterable: false,
                type: "custom",
                valueGetter: (params, row) => {
                    return row.members.map((mem: Profile) => mem.name).join(', ');
                },
                renderCell: (params) => {
                    return <Stack direction={'row'} gap={1}>
                        {params.row.members.map((mem: Profile) =>
                            // <Chip
                            //     avatar={<Avatar alt={mem.name} src={mem.pic} />}
                            //     label={mem.name}
                            // />  // Too wide?
                            <Tooltip title={mem.name} >
                                <Avatar alt={mem.name} src={mem.pic} />
                            </Tooltip>

                        )}
                    </Stack>
                }
            }
        ];

    function handleEditProgram(program: Program): void {
        setProgram(program);
        setIsNewProgram(false);
        setProgramModalTitle(`Edit Program: ${program.name}`);
        setOpenProgramModal(true);
    }

    function handleOpenProgramModal(arg0: boolean): void {
        setProgram(service.empty())
        setIsNewProgram(true);
        setProgramModalTitle("Add Program");
        setOpenProgramModal(true);
    }

    function handleClose(): void {
        setProgram(undefined);
        setOpenProgramModal(false);
    }

    function handleSubmit(submitted: Program): void {
        if (isNewProgram) {
            service.insert(submitted)
                .then(inserted => {
                    setOpenProgramModal(false);
                    navigate(`/${DETAIL_PAGE}/${inserted.id}`);
                    notifcations.success(`Program created.`);
                })

        } else {
            service.update(submitted)
                .then(updated => {
                    setOpenProgramModal(false);
                    fetchData();
                })

        }
    }

    return (
        <>
            <Card>
                <CardContent>
                    <DataGrid
                        rows={programs}
                        columns={columns}
                        showToolbar={true}

                        paginationMode='client'
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}

                        sortingMode='client'
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}

                        filterMode="client"
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}

                        pageSizeOptions={[5, 10, 25, 100]}
                        onRowDoubleClick={params => navigate(`/${DETAIL_PAGE}/${params.row.id}`)}
                    />
                </CardContent>
            </Card>
            <ProgramDialog
                program={program!}
                opened={openProgramModal}
                title={programModalTitle}
                onClose={handleClose}
                onSubmit={handleSubmit} />
        </>
    );
}
