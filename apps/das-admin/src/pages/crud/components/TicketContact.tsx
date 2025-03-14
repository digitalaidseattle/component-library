
import { TicketProps } from "./TicketProps";

const TicketContact: React.FC<TicketProps> = ({ ticket }) => {
    const strings = [ticket.email, ticket.phone];
    return strings.filter(s => s).join(" | ");
}

export default TicketContact