import { Link } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { TicketProps } from "./TicketProps";


// ==============================|| Table Cell Renderers ||============================== //

const TicketLink: React.FC<TicketProps> = ({ ticket }) => {
    return (
        <Link color="secondary" component={RouterLink} to={`/crud-example/ticket/${ticket.id}`}>
            {ticket.id}
        </Link>
    )
}
 export default TicketLink