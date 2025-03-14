import { Stack, Typography } from "@mui/material";
import { TicketProps } from "./TicketProps";

const TicketStatus: React.FC<TicketProps> = ({ ticket }) => {
    let color;
    let title;

    switch (ticket.status) {
        case 'completed':
            color = 'success';
            title = 'Completed';
            break;
        case 'inprogress':
            color = 'warning';
            title = 'In Progress';
            break;
        case 'blocked':
            color = 'error';
            title = 'Blocked';
            break;
        case 'new':
        default:
            color = 'primary';
            title = 'New';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography color={color}>{title}</Typography>
        </Stack>
    );
};

export default TicketStatus