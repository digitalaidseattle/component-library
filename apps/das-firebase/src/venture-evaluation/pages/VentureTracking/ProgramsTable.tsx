/**
 * ProgramsTable.tsx
 * Programs belonging to the venture evaluation organization
*/

import { DeleteOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingContext, RefreshContext, useNotifications } from "@digitalaidseattle/core";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import { Configuration, Profile, Program } from "@digitalaidseattle/program-management";
import { VEProgramService } from "../../services/VEProgramService";

export const ProgramsTable: React.FC = ({ }) => {
    const programService = Configuration.getInstance().getProgramService() as VEProgramService;

    const notifications = useNotifications();
    const { setLoading } = useContext(LoadingContext);
    const { refresh, setRefresh } = useContext(RefreshContext);
    const navigate = useNavigate();

    const [programs, setPrograms] = useState<Program[]>([]);
    const [toDelete, setToDelete] = useState<Program | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        programService.findByOrganization()
            .then(data => {
                if (active) {
                    setPrograms(data);
                }
            })
            .catch(err => {
                notifications.error('Error fetching programs.');
                console.error('Error fetching programs:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [refresh]);

    async function handleDelete() {
        if (!toDelete) {
            return;
        }
        setLoading(true);
        try {
            await programService.deleteProgram(toDelete);
            notifications.success(`Program ${toDelete.name} deleted.`);
            setRefresh(Date.now());
        } catch (err) {
            notifications.error('Error deleting program.');
            console.error('Error deleting program:', err);
        } finally {
            setToDelete(null);
            setLoading(false);
        }
    }

    const columns: GridColDef<Program>[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ row }) => [
                <GridActionsCellItem
                    icon={<FolderOpenOutlined />}
                    label="Open"
                    onClick={() => navigate(`./${row.id}`)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteOutlined />}
                    label="Delete"
                    onClick={() => setToDelete(row)}
                    color="inherit"
                />
            ]
        },
        { field: 'prefix', headerName: 'Prefix', width: 150 },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'members',
            headerName: 'Members',
            width: 250,
            valueGetter: (members: Profile[]) => (members ?? []).map(member => member.name).join(', ')
        }
    ];

    return (
        <>
            <DataGrid
                rows={programs}
                columns={columns}
                pageSizeOptions={[5, 10, 100]}
                sx={{ border: 0, width: '100%', minWidth: 0 }}
            />
            <ConfirmationDialog
                message={toDelete ? `Delete program ${toDelete.name} and all of its tasks?` : ''}
                open={!!toDelete}
                handleConfirm={handleDelete}
                handleCancel={() => setToDelete(null)} />
        </>
    );
}
