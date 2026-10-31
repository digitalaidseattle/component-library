/**
 * Funder/index.tsx
 * Display details of a funder and its grant programs
 */

import { EditOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumbs, Card, CardContent, CardHeader, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactNode, useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { FunderDialog } from '../../components/FunderDialog';
import { GrantProgramDialog } from '../../components/GrantProgramDialog';
import { Toolbar } from '../../components/Toolbar';
import { FundersService } from '../../services/fundersService';
import { GrantProgramService } from "../../services/grantProgramService";
import { Funder, GrantProgram } from '../../types';

const FIELDS: { name: keyof Funder, label: string }[] = [
    { name: 'type', label: 'Type' },
    { name: 'description', label: 'Description' },
    { name: 'contact', label: 'Contact' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    { name: 'address', label: 'Address' },
];

const PROGRAM_COLUMNS: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 250 },
    { field: 'grant_range', headerName: 'Grant Range', flex: 1, minWidth: 150 },
    { field: 'application_cycle', headerName: 'Application Cycle', flex: 1, minWidth: 150 },
    { field: 'current_deadline', headerName: 'Current Deadline', flex: 1, minWidth: 150 },
    { field: 'geographic_scope', headerName: 'Geographic Scope', flex: 1, minWidth: 150 },
];

export const FunderPage: React.FC = () => {
    const fundersService = FundersService.getInstance();
    const programService = GrantProgramService.getInstance();

    const notifications = useNotifications();
    const { id } = useParams();

    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);

    const [funder, setFunder] = useState<Funder>();
    const [programs, setPrograms] = useState<GrantProgram[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [program, setProgram] = useState<GrantProgram>(programService.empty());
    const [showProgramDialog, setShowProgramDialog] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        let active = true;
        setLoading(true);
        Promise.all([fundersService.getById(id), programService.getAll()])
            .then(([found, allPrograms]) => {
                if (active) {
                    console.log(found, 'allPrograms', allPrograms)
                    setFunder(found);
                    setPrograms(allPrograms.filter(p => p.funder_id?.toString() === id));
                }
            })
            .catch(err => {
                notifications.error('Error fetching funder.');
                console.error('Error fetching funder:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [id, refresh]);

    async function handleSuccess(changed: Funder | null): Promise<void> {
        if (changed && changed.id) {
            try {
                await fundersService.update(changed.id, changed);
                notifications.success('Funder updated!');
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not change funder', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowDialog(false);
    }

    function handleAddProgram(): void {
        setProgram({ ...programService.empty(), funder_id: id! });
        setShowProgramDialog(true);
    }

    async function handleProgramSuccess(changed: GrantProgram | null): Promise<void> {
        if (changed) {
            try {
                if (changed.id) {
                    await programService.update(changed.id, changed);
                    notifications.success('Grant program updated!');
                } else {
                    await programService.insert(changed);
                    notifications.success('Grant program added!');
                }
                setRefresh(Date.now());
            }
            catch (err) {
                console.error('Could not save grant program', err);
                notifications.error('Sorry there was an error: ' + (err as Error).message);
            }
        }
        setShowProgramDialog(false);
    }

    function addProgramButton(): ReactNode {
        return <Tooltip title="Add grant program">
            <IconButton color="primary" size="small" onClick={handleAddProgram} aria-label="Add grant program">
                <PlusOutlined />
            </IconButton>
        </Tooltip>
    }

    return (funder &&
        <Stack gap={2}>
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                <NavLink to=".." relative='path'>Funders</NavLink>
                <Typography color="text.primary">{funder.name}</Typography>
            </Breadcrumbs>
            <Card>
                <CardHeader title={funder.name}
                    action={
                        <Tooltip title="Edit funder">
                            <IconButton color="primary" onClick={() => setShowDialog(true)}>
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    } />
                <CardContent>
                    <Grid container spacing={2}>
                        {FIELDS.map(field =>
                            <Grid key={field.name} size={{ xs: 12, md: field.name === 'description' ? 12 : 6 }}>
                                <Typography variant="caption" color="text.secondary">{field.label}</Typography>
                                <Typography>{funder[field.name]?.toString() || '—'}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Grant Programs" />
                <DataGrid
                    rows={programs}
                    columns={PROGRAM_COLUMNS}
                    pageSizeOptions={[5, 10, 25, 100]}
                    sx={{ border: 0, width: '100%', minWidth: 0 }}
                    showToolbar={true}
                    slots={{ toolbar: Toolbar }}
                    slotProps={{
                        toolbar: {
                            tools: addProgramButton(),
                            onSearch: () => { }
                        }
                    }}
                />
            </Card>
            <FunderDialog
                entity={funder}
                open={showDialog}
                handleSuccess={handleSuccess} />
            <GrantProgramDialog
                entity={program}
                open={showProgramDialog}
                handleSuccess={handleProgramSuccess} />
        </Stack>
    );
}
