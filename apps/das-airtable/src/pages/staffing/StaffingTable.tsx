/**
 * TicketsGrid.tsx
 * 
 * Example of integrating tickets with data-grid
 */
import { useContext, useEffect, useState } from 'react';

// material-ui
import {
    Chip,
    Stack
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    GridSortModel,
    useGridApiRef
} from '@mui/x-data-grid';

// third-party

// project import
import { LoadingContext } from '@digitalaidseattle/core';
import { OpenPosition, staffingService } from '../services/staffingService';
import { Venture, ventureService } from '../services/ventureService';
import { partnerService } from '../services/partnerService';

// ==============================|| Tickets Grid ||============================== //

const PAGE_SIZE = 10;

type PageInfo<T> = {
    totalRowCount: number
    rows: T[]
}

export default function StaffingTable() {
    const { setLoading } = useContext(LoadingContext);

    const [ventures, setVentures] = useState<Venture[]>([]);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: PAGE_SIZE });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])
    const [pageInfo, setPageInfo] = useState<PageInfo<any>>({ rows: [], totalRowCount: 0 });
    const apiRef = useGridApiRef();

    useEffect(() => {
        ventureService.getAllByStatus(['Active', 'Under evaluation'])
            .then(ventures => {
                Promise
                    .all(ventures.map(venture => partnerService.getById(venture.partnerId)))
                    .then(resps => {
                        resps.forEach((partner, idx) => {
                            ventures[idx].partner = partner
                        })
                        setVentures(ventures)
                    })
            })
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        setLoading(true);
        staffingService.findOpen(['Please fill', 'Proposed'])
            .then((staff: OpenPosition[]) => {
                const venturePositions: OpenPosition[] = []
                staff.forEach(position => {
                    const venture = ventures.find(v => v.id === position.ventureId);
                    if (venture) {
                        position.venture = venture.partner ? venture.partner.name : '';
                        position.ventureStatus = venture.status;
                        venturePositions.push(position);
                    }
                });
                setPageInfo({ rows: venturePositions, totalRowCount: venturePositions.length });
            })
            .finally(() => setLoading(false))
    }, [ventures]);


    const VENTURE_COLORS = {
        'Active': 'primary',
        'Under evaluation': 'warning',
    } as any;

    const POSITION_COLORS = {
        'Please fill': 'primary',
        'Proposed': 'success',
    } as any;

    const getColumns = (): GridColDef[] => {
        return [
            {
                field: 'venture',
                headerName: 'Venture',
                width: 250,
            }, {
                field: 'ventureStatus',
                headerName: 'Venture Status',
                width: 200,
                renderCell: (param: GridRenderCellParams) => {
                    return <Chip label={param.row.ventureStatus} color={VENTURE_COLORS[param.row.ventureStatus]} />
                }
            },
            {
                field: 'role',
                headerName: 'Roles',
                width: 250,
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 200,
                renderCell: (param: GridRenderCellParams) => {
                    return <Chip label={param.row.status} color={POSITION_COLORS[param.row.status]} />
                }
            },
            {
                field: 'level',
                headerName: 'Level requirement',
                width: 200,
            },
            {
                field: 'skill',
                headerName: 'Desired skills',
                width: 300,
            }
        ];
    }

    return (
        <>
            <Stack spacing={2}>
                <DataGrid
                    apiRef={apiRef}
                    rows={pageInfo.rows}
                    columns={getColumns()}

                    paginationMode='client'
                    paginationModel={paginationModel}
                    rowCount={pageInfo.totalRowCount}
                    onPaginationModelChange={setPaginationModel}

                    sortingMode='client'
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}

                    pageSizeOptions={[5, 10, 25, 100]}
                    disableRowSelectionOnClick
                />
            </Stack>
        </>
    )
}
