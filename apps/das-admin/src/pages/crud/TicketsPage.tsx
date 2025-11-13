/**
 * TicketsGrid.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Stack
} from '@mui/material';
import {
    ColumnsPanelTrigger,
    DataGrid,
    FilterPanelTrigger,
    GridAddIcon,
    GridColDef,
    GridDeleteIcon,
    GridFilterListIcon,
    GridRenderCellParams,
    GridRowSelectionModel,
    GridSortModel,
    GridToolbarExportContainer,
    GridViewColumnIcon,
    Toolbar,
    ToolbarButton,
    useGridApiRef
} from '@mui/x-data-grid';

// third-party

// project import
import { useNotifications } from '@digitalaidseattle/core';
import { ConfirmationDialog, InputFormDialog, InputOption } from '@digitalaidseattle/mui';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import TicketContact from './components/TicketContact';
import TicketLink from './components/TicketLink';
import TicketStatus from './components/TicketStatus';
import { ticketService, TicketSource } from './ticketService';
import { Ticket } from './types';

// ==============================|| Tickets Grid ||============================== //

const PAGE_SIZE = 10;

const getColumns = (): GridColDef[] => {
    return [
        {
            field: 'id', headerName: 'ID', width: 90,
            renderCell: (params: GridRenderCellParams<Ticket, string>) => (
                <TicketLink ticket={params.row!} />
            )
        },
        {
            field: 'clientName',
            headerName: 'Client Name',
            width: 150,
        },
        {
            field: 'email',
            headerName: 'Contact',
            width: 200,
            renderCell: (params: GridRenderCellParams<Ticket, string>) => (
                <TicketContact ticket={params.row!} />
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (params: GridRenderCellParams<Ticket, string>) => (
                <Box sx={{ height: '100%', alignContent: 'center' }}>
                    <TicketStatus ticket={params.row!} />
                </Box>
            ),
        },
        {
            field: 'assignee',
            headerName: 'Assigned To',
            width: 160,
        },
        {
            field: 'summary',
            headerName: 'summary',
            width: 160,
        }
    ];
}


const staffingInputFields: InputOption[] = [
    {
        name: "inputSource",
        label: 'Input Source',
        type: 'select',
        disabled: false,
        options: Object.values(TicketSource).map(s => ({ value: s.value, label: s.label }))
    },
    {
        name: "clientName",
        label: 'Client Name',
        disabled: false,
    },
    {
        name: "email",
        label: 'Email Address',
        disabled: false,
    },
    {
        name: "phone",
        label: 'Phone',
        disabled: false,
    },
    {
        name: "summary",
        label: 'Summary',
        size: 4,
        disabled: false
    },
    {
        name: "description",
        label: 'Description',
        size: 4,
        disabled: false,
    }
];

export default function TicketsPage() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
    const [pageInfo, setPageInfo] = useState<PageInfo<Ticket>>({ rows: [], totalRowCount: 0 });
    const [rowCountState, setRowCountState] = useState(pageInfo?.totalRowCount || 0,);
    const apiRef = useGridApiRef();

    const [openTicketDialog, setOpenTicketDialog] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const nofications = useNotifications();

    useEffect(() => {
        setRowCountState((prevRowCountState: number) =>
            pageInfo?.totalRowCount !== undefined
                ? pageInfo?.totalRowCount
                : prevRowCountState,
        );
    }, [pageInfo?.totalRowCount, setRowCountState]);

    useEffect(() => {
        if (paginationModel && sortModel) {
            fetchData();
        }
    }, [paginationModel, sortModel])

    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {
        const queryModel = {
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            sortField: sortModel.length === 0 ? 'created_at' : sortModel[0].field,
            sortDirection: sortModel.length === 0 ? 'created_at' : sortModel[0].sort
        } as QueryModel
        ticketService.find(queryModel)
            .then((pi) => setPageInfo(pi))
    }

    // Delete Ticket
    const applyAction = () => {
        setShowConfirmation(true);
    }

    function handleDelete(): void {
        if (rowSelectionModel) {
            const promises = Array.from(rowSelectionModel.ids)
                .map((id) => ticketService.delete(id));

            Promise
                .all(promises)
                .then(() => {
                    nofications.success('Tickets deleted');
                    apiRef.current!.setRowSelectionModel({
                        ...rowSelectionModel,
                        ids: new Set()
                    });
                    setShowConfirmation(false);
                    fetchData();
                })
        }
        // ticketService.delete()
    }
    // End Delete Ticket

    // New Ticket
    const newTicket = () => {
        setOpenTicketDialog(true);
    }

    function handleTicketChange(ticket: Ticket | null): void {
        if (ticket) {
            const json = { ...ticket } as any;
            delete json.id;
            delete json.ticket_history;
            ticketService.insert(json)
                .then(inserted => {
                    nofications.success(`Ticket inserted: ${inserted.id}`);
                    fetchData();
                    setOpenTicketDialog(false);
                })
        } else {
            setOpenTicketDialog(false);
        }
    }

    function CustomToolbar() {
        return (
            <Toolbar>
                <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                    <IconButton
                        title='New'
                        color="primary"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            padding: '4px 8px',
                            lineHeight: 1.5,
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    theme.palette.action.hover,
                            },
                        }}
                        onClick={newTicket}>
                        <GridAddIcon /> New
                    </IconButton>
                    <IconButton
                        color="primary"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            padding: '4px 8px',
                            lineHeight: 1.5,
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    theme.palette.action.hover,
                            },
                        }}
                        disabled={!(rowSelectionModel && rowSelectionModel.ids.size > 0)}
                        onClick={applyAction}>
                        <GridDeleteIcon /> Delete
                    </IconButton>
                </Box>
                {/* Add your custom actions */}
                {/* Keep the default toolbar items */}
                <Box>
                    <ColumnsPanelTrigger render={<ToolbarButton />}>
                        <GridViewColumnIcon fontSize="small" />
                    </ColumnsPanelTrigger>
                    <FilterPanelTrigger render={<ToolbarButton />}>
                        <GridFilterListIcon fontSize="small" />
                    </FilterPanelTrigger>
                    <GridToolbarExportContainer />
                </Box>
            </Toolbar>
        );
    }


    return (
        <Card>
            <CardHeader title="CRUD Example" />
            <CardContent>
                <Stack direction="row" spacing={1} marginBottom={1}>

                </Stack>
                <DataGrid
                    apiRef={apiRef}
                    rows={pageInfo.rows}
                    columns={getColumns()}
                    showToolbar={true}
                    slots={{
                        toolbar: CustomToolbar, // 👈 use your custom toolbar here
                    }}

                    paginationMode='server'
                    paginationModel={paginationModel}
                    rowCount={rowCountState}
                    onPaginationModelChange={setPaginationModel}

                    sortingMode='server'
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}

                    pageSizeOptions={[5, 10, 25, 100]}
                    checkboxSelection
                    onRowSelectionModelChange={setRowSelectionModel}
                    disableRowSelectionOnClick
                />
                <InputFormDialog
                    open={openTicketDialog} title={'Create Service Ticket'}
                    inputFields={staffingInputFields}
                    entity={ticketService.empty()}
                    onChange={handleTicketChange} />
                {/* <TicketDialog open={openTicketDialog} handleSuccess={handleSuccess} handleError={handleError} /> */}
                <ConfirmationDialog
                    message={`Delete selected tickets?`}
                    open={showConfirmation}
                    handleConfirm={handleDelete}
                    handleCancel={() => setShowConfirmation(false)} />
            </CardContent>
        </Card>
    );
}
