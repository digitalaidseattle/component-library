/**
 * Program/index.tsx
 * Display details of a grant program
 */

import { EditOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Box, Breadcrumbs, Card, CardContent, CardHeader, Grid, IconButton, Link, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactNode, useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { GrantApplicationDialog } from '../../components/GrantApplicationDialog';
import { GrantProgramDialog } from '../../components/GrantProgramDialog';
import { ProgramAssessmentDialog } from '../../components/ProgramAssessmentDialog';
import { Toolbar } from '../../components/Toolbar';
import { FundersService } from '../../services/fundersService';
import { GrantApplicationService } from '../../services/grantApplicationService';
import { GrantProgramService } from "../../services/grantProgramService";
import { ProgramAssessmentService } from '../../services/programAssessmentService';
import { Funder, GrantApplication, GrantProgram, ProgramAssessment } from '../../types';

const FIELDS: { name: keyof GrantProgram, label: string, fullWidth?: boolean }[] = [
    { name: 'focus_areas', label: 'Focus Areas', fullWidth: true },
    { name: 'population_focus', label: 'Population Focus' },
    { name: 'mission_alignment', label: 'Mission Alignment' },
    { name: 'grant_range', label: 'Grant Range' },
    { name: 'operational_support', label: 'Operational Support' },
    { name: 'application_cycle', label: 'Application Cycle' },
    { name: 'geographic_scope', label: 'Geographic Scope' },
    { name: 'typical_deadline', label: 'Typical Deadline' },
    { name: 'current_deadline', label: 'Current Deadline' },
];

const APPLICATION_COLUMNS: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 250 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },
    { field: 'priority_score', headerName: 'Priority Score', type: 'number', flex: 1, minWidth: 120 },
    { field: 'notes', headerName: 'Notes', flex: 2, minWidth: 250 },
];

const ASSESSMENT_COLUMNS: GridColDef<ProgramAssessment>[] = [
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 250 },
    { field: 'priority_score', headerName: 'Priority Score', type: 'number', flex: 1, minWidth: 120 },
    { field: 'notes', headerName: 'Notes', flex: 3, minWidth: 250, valueGetter: (value: string[]) => (value ?? []).join('; ') },
];

export const ProgramPage: React.FC = () => {
    const programService = GrantProgramService.getInstance();
    const fundersService = FundersService.getInstance();
    const applicationService = GrantApplicationService.getInstance();
    const assessmentService = ProgramAssessmentService.getInstance();

    const notifications = useNotifications();
    const { id } = useParams();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [program, setProgram] = useState<GrantProgram>();
    const [funder, setFunder] = useState<Funder>();
    const [applications, setApplications] = useState<GrantApplication[]>([]);
    const [assessments, setAssessments] = useState<ProgramAssessment[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [application, setApplication] = useState<GrantApplication>(applicationService.empty());
    const [showApplicationDialog, setShowApplicationDialog] = useState<boolean>(false);
    const [assessment, setAssessment] = useState<ProgramAssessment>(assessmentService.empty());
    const [showAssessmentDialog, setShowAssessmentDialog] = useState<boolean>(false);
    const [tab, setTab] = useState<number>(0);

    useEffect(() => {
        if (!id) {
            return;
        }
        let active = true;
        setLoading(true);
        Promise.all([programService.getById(id), applicationService.getAll(), assessmentService.getAll()])
            .then(async ([found, allApplications, allAssessments]) => {
                const owner = found?.funder_id ? await fundersService.getById(found.funder_id.toString()) : undefined;
                if (active) {
                    setProgram(found);
                    setFunder(owner);
                    setApplications(allApplications.filter(a => a.grant_program_id?.toString() === id));
                    setAssessments(allAssessments.filter(a => a.grant_program_id?.toString() === id));
                }
            })
            .catch(err => {
                notifications.error('Error fetching grant program.');
                console.error('Error fetching grant program:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [id, refresh]);

    async function handleSuccess(changed: GrantProgram | null): Promise<void> {
        if (changed && changed.id) {
            try {
                await programService.update(changed.id, changed);
                notifications.success('Grant program updated!');
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not change grant program', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowDialog(false);
    }

    function handleAddApplication(): void {
        setApplication({ ...applicationService.empty(), grant_program_id: id!, status: 'To Apply' });
        setShowApplicationDialog(true);
    }

    async function handleApplicationSuccess(changed: GrantApplication | null): Promise<void> {
        if (changed) {
            try {
                if (changed.id) {
                    await applicationService.update(changed.id, changed);
                    notifications.success('Grant application updated!');
                } else {
                    await applicationService.insert(changed);
                    notifications.success('Grant application added!');
                }
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not save grant application', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowApplicationDialog(false);
    }

    function addApplicationButton(): ReactNode {
        return <Tooltip title="Add grant application">
            <IconButton color="primary" size="small" onClick={handleAddApplication} aria-label="Add grant application">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    function handleAddAssessment(): void {
        setAssessment({ ...assessmentService.empty(), grant_program_id: id! });
        setShowAssessmentDialog(true);
    }

    async function handleAssessmentSuccess(changed: ProgramAssessment | null): Promise<void> {
        if (changed) {
            try {
                if (changed.id) {
                    await assessmentService.update(changed.id, changed);
                    notifications.success('Program assessment updated!');
                } else {
                    await assessmentService.insert(changed);
                    notifications.success('Program assessment added!');
                }
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not save program assessment', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowAssessmentDialog(false);
    }

    function addAssessmentButton(): ReactNode {
        return <Tooltip title="Add program assessment">
            <IconButton color="primary" size="small" onClick={handleAddAssessment} aria-label="Add program assessment">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    function fieldValue(value: unknown): ReactNode {
        const text = Array.isArray(value) ? value.join(', ') : value?.toString();
        return text || '—';
    }

    return (program &&
        <Stack gap={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                <NavLink to=".." relative='path'>Grant Programs</NavLink>
                <Typography color="text.primary">{program.name}</Typography>
            </Breadcrumbs>
            <Card>
                <CardHeader title={program.name}
                    action={
                        <Tooltip title="Edit grant program">
                            <IconButton color="primary" onClick={() => setShowDialog(true)}>
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    } />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary">Funder</Typography>
                            <Typography>
                                {funder
                                    ? <NavLink to={`/grant-tracking/funders/${funder.id}`}>{funder.name}</NavLink>
                                    : '—'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" color="text.secondary">Website</Typography>
                            <Typography>
                                {program.website
                                    ? <Link href={`https://${program.website}`} target='_blank'>{program.website}</Link>
                                    : '—'}
                            </Typography>
                        </Grid>
                        {FIELDS.map(field =>
                            <Grid key={field.name} size={{ xs: 12, md: field.fullWidth ? 12 : 6 }}>
                                <Typography variant="caption" color="text.secondary">{field.label}</Typography>
                                <Typography>{fieldValue(program[field.name])}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={(_event, value: number) => setTab(value)}>
                        <Tab label={`Grant Applications (${applications.length})`} />
                        <Tab label={`Program Assessments (${assessments.length})`} />
                    </Tabs>
                </Box>
                {tab === 0 &&
                    <DataGrid
                        rows={applications}
                        columns={APPLICATION_COLUMNS}
                        pageSizeOptions={[5, 10, 25, 100]}
                        sx={{ border: 0, width: '100%', minWidth: 0 }}
                        showToolbar={true}
                        slots={{ toolbar: Toolbar }}
                        slotProps={{
                            toolbar: {
                                tools: addApplicationButton(),
                                onSearch: () => { }
                            }
                        }}
                    />
                }
                {tab === 1 &&
                    <DataGrid
                        rows={assessments}
                        columns={ASSESSMENT_COLUMNS}
                        pageSizeOptions={[5, 10, 25, 100]}
                        sx={{ border: 0, width: '100%', minWidth: 0 }}
                        showToolbar={true}
                        slots={{ toolbar: Toolbar }}
                        slotProps={{
                            toolbar: {
                                tools: addAssessmentButton(),
                                onSearch: () => { }
                            }
                        }}
                    />
                }
            </Card>
            <GrantProgramDialog
                entity={program}
                open={showDialog}
                handleSuccess={handleSuccess} />
            <GrantApplicationDialog
                entity={application}
                open={showApplicationDialog}
                handleSuccess={handleApplicationSuccess} />
            <ProgramAssessmentDialog
                entity={assessment}
                open={showAssessmentDialog}
                handleSuccess={handleAssessmentSuccess} />
        </Stack>
    );
}
