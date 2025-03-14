/**
 *  StaffTable.tsx
 *
 *  Display a table of staff entries.
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

// material-ui
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme
} from '@mui/material';

import { keyframes } from '@mui/system';
import { Staff } from './types';

// ==============================|| Staff TABLE - HEADER ||============================== //

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: false,
        label: 'Name'
    },
    {
        id: 'email',
        align: 'left',
        disablePadding: false,
        label: 'Email'
    },
    {
        id: 'roles',
        align: 'left',
        disablePadding: false,
        label: 'Roles'
    },
]

const StaffTableHead = () => {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align as "left" | "right" | "center" | "justify" | "inherit" | undefined}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function StaffTable({ tableData, newData }: { tableData: Staff[], newData: Staff[] }) {

    const theme = useTheme();

    // an animation for newly added rows
    const fadeOut = keyframes`
        from {
            background-color: ${theme.palette.primary.light};
        }
        to {
            background-color: transparent;
        }
    `;

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}>
                    <StaffTableHead />
                    <TableBody>
                        {newData.map(s => (
                            <TableRow key={s.id} sx={{
                                animation: `${fadeOut} 2s cubic-bezier(0.49, 0.06, 0.9, 0.1)`
                            }}>
                                <TableCell align="left">{s.name}</TableCell>
                                <TableCell align="left">{s.email}</TableCell>
                                <TableCell align="left">{s.roles && s.roles.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                        {tableData.map(s => (
                            <TableRow key={s.id}>
                                <TableCell align="left">{s.name}</TableCell>
                                <TableCell align="left">{s.email}</TableCell>
                                <TableCell align="left">{s.roles && s.roles.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    )
}