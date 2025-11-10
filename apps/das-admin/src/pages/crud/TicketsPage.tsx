/**
 * TicketsGrid.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useContext, useEffect, useState } from 'react';

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
import { RefreshContext, useNotifications } from '@digitalaidseattle/core';
import { ConfirmationDialog } from '@digitalaidseattle/mui';
import { PageInfo, QueryModel } from '@digitalaidseattle/supabase';
import TicketContact from './components/TicketContact';
import TicketDialog from './components/TicketDialog';
import TicketLink from './components/TicketLink';
import TicketStatus from './components/TicketStatus';
import { ticketService } from './ticketService';

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

export default function TicketsPage() {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
    const [pageInfo, setPageInfo] = useState<PageInfo<Ticket>>({ rows: [], totalRowCount: 0 });
    const [rowCountState, setRowCountState] = useState(pageInfo?.totalRowCount || 0,);
    const apiRef = useGridApiRef();
    const { refresh, setRefresh } = useContext(RefreshContext);

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
            const queryModel = {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                sortField: sortModel.length === 0 ? 'created_at' : sortModel[0].field,
                sortDirection: sortModel.length === 0 ? 'created_at' : sortModel[0].sort
            } as QueryModel
            ticketService.find(queryModel)
                .then((pi) => setPageInfo(pi))
        }
    }, [paginationModel, sortModel])

    useEffect(() => {
        const queryModel = {
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            sortField: sortModel.length === 0 ? 'created_at' : sortModel[0].field,
            sortDirection: sortModel.length === 0 ? 'created_at' : sortModel[0].sort
        } as QueryModel
        ticketService.find(queryModel)
            .then((pi) => setPageInfo(pi))
    }, [refresh])

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
                    setRefresh(refresh + 1)
                })
        }
        // ticketService.delete()
    }
    // End Delete Ticket

    // New Ticket
    const newTicket = () => {
        setOpenTicketDialog(true);
    }

    function handleSuccess(_resp: Ticket | null): void {
        setOpenTicketDialog(false);
        throw new Error('Function not implemented.');
    }

    function handleError(_err: Error): void {
        setOpenTicketDialog(false);
        throw new Error('Function not implemented.');
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
                    sx={{ width: 800 }}
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
                <TicketDialog open={openTicketDialog} handleSuccess={handleSuccess} handleError={handleError} />
                <ConfirmationDialog
                    message={`Delete selected tickets?`}
                    open={showConfirmation}
                    handleConfirm={handleDelete}
                    handleCancel={() => setShowConfirmation(false)} />
            </CardContent>
        </Card>
    );
}
