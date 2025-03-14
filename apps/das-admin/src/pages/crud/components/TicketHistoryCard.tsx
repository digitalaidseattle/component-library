import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";

import { MainCard } from "@digitalaidseattle/mui";
import { TicketProps } from "./TicketProps";

const TicketHistoryCard: React.FC<TicketProps> = ({ ticket }) => {
    return (<MainCard title="History">
        <Stack spacing={'1rem'}>
            {ticket.ticket_history
                // .sort((h1: TicketHistory, h2: TicketHistory) => h2.created_at.getTime() - h1.created_at.getTime())
                .map((hist: TicketHistory, idx: number) => {
                    const date = hist.created_at;
                    return <MainCard key={idx}>
                        <Typography>Action: {hist.description}</Typography>
                        <Typography>Date: {format(date, "MM-dd-yyyy")} {format(date, "hh:mm")}</Typography>
                        <Typography>Change By: {hist.change_by}</Typography>
                    </MainCard>
                })}
        </Stack>
    </MainCard>);
}

export default TicketHistoryCard;

