/**
 * Application/index.tsx
 * Display details of a grant application
 */

import { EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumbs, Card, CardContent, CardHeader, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { GrantApplicationDialog } from '../../components/GrantApplicationDialog';
import { ApplicationHistoryService } from '../../services/applicationHistoryService';
import { FundersService } from '../../services/fundersService';
import { GrantApplicationService } from '../../services/grantApplicationService';
import { GrantProgramService } from "../../services/grantProgramService";
import { ApplicationHistory, Funder, GrantApplication, GrantProgram } from '../../types';

const FIELDS: { name: keyof GrantApplication, label: string, fullWidth?: boolean }[] = [
    { name: 'status', label: 'Status' },
    { name: 'email', label: 'Email' },
    { name: 'notes', label: 'Notes', fullWidth: true },
];

// Firestore returns Timestamps for stored dates
function toDate(value: any): Date | undefined {
    if (!value) {
        return undefined;
    }
    return typeof value.toDate === 'function' ? value.toDate() : new Date(value);
}

const HISTORY_COLUMNS: GridColDef<ApplicationHistory>[] = [
    {
        field: 'created_at', headerName: 'Date', type: 'dateTime', flex: 1, minWidth: 200,
        valueGetter: (value: any) => toDate(value)
    },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },
    { field: 'notes', headerName: 'Notes', flex: 3, minWidth: 250 },
];

export const GrantApplicationPage: React.FC = () => {
    const applicationService = GrantApplicationService.getInstance();
    const programService = GrantProgramService.getInstance();
    const fundersService = FundersService.getInstance();
    const historyService = ApplicationHistoryService.getInstance();

    const notifications = useNotifications();
    const { id } = useParams();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [application, setApplication] = useState<GrantApplication>();
    const [program, setProgram] = useState<GrantProgram>();
    const [funder, setFunder] = useState<Funder>();
    const [programs, setPrograms] = useState<GrantProgram[]>([]);
    const [history, setHistory] = useState<ApplicationHistory[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        let active = true;
        setLoading(true);
        Promise.all([applicationService.getById(id), programService.getAll(), historyService.getForApplication(id)])
            .then(async ([found, allPrograms, applicationHistory]) => {
                const owningProgram = allPrograms.find(p => p.id?.toString() === found?.grant_program_id?.toString());
                const owner = owningProgram?.funder_id ? await fundersService.getById(owningProgram.funder_id.toString()) : undefined;
                if (active) {
                    setApplication(found);
                    setPrograms(allPrograms);
                    setProgram(owningProgram);
                    setFunder(owner);
                    setHistory(applicationHistory);
                }
            })
            .catch(err => {
                notifications.error('Error fetching grant application.');
                console.error('Error fetching grant application:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [id, refresh]);

    async function handleSuccess(changed: GrantApplication | null): Promise<void> {
        if (changed && changed.id) {
            try {
                await applicationService.update(changed.id, changed);
                // record status changes in the application history
                if (changed.status !== application?.status) {
                    await historyService.insert({
                        ...historyService.empty(),
                        application_id: changed.id.toString(),
                        status: changed.status,
                        notes: changed.notes,
                        created_at: new Date()
                    });
                }
                notifications.success('Grant application updated!');
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not change grant application', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowDialog(false);
    }

    const title = program ? `${program.name} Application` : 'Grant Application';

    return (application &&
        <Stack gap={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                <NavLink to=".." relative='path'>Grant Applications</NavLink>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
            <Card>
                <CardHeader title={title}
                    action={
                        <Tooltip title="Edit grant application">
                            <IconButton color="primary" onClick={() => setShowDialog(true)}>
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    } />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary">Grant Program</Typography>
                            <Typography>
                                {program
                                    ? <NavLink to={`/grant-tracking/programs/${program.id}`}>{program.name}</NavLink>
                                    : '—'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary">Funder</Typography>
                            <Typography>
                                {funder
                                    ? <NavLink to={`/grant-tracking/funders/${funder.id}`}>{funder.name}</NavLink>
                                    : '—'}
                            </Typography>
                        </Grid>
                        {FIELDS.map(field =>
                            <Grid key={field.name} size={{ xs: 12, md: field.fullWidth ? 12 : 6 }}>
                                <Typography variant="caption" color="text.secondary">{field.label}</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{application[field.name]?.toString() || '—'}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardHeader title={`Application History (${history.length})`} />
                <DataGrid
                    rows={history}
                    columns={HISTORY_COLUMNS}
                    initialState={{ sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] } }}
                    pageSizeOptions={[5, 10, 25, 100]}
                    sx={{ border: 0, width: '100%', minWidth: 0 }}
                />
            </Card>
            <GrantApplicationDialog
                entity={application}
                programs={programs}
                open={showDialog}
                handleSuccess={handleSuccess} />
        </Stack>
    );
}
