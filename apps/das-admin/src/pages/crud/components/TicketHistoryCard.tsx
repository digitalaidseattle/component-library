import { Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import dayjs from 'dayjs';

import { MainCard } from "@digitalaidseattle/mui";
import { TicketProps } from "./TicketProps";
import { TicketHistory } from "../api/types";
import { useEffect, useState } from "react";

const TicketHistoryCard: React.FC<TicketProps> = ({ ticket }) => {
    const [histories, setHistories] = useState<TicketHistory[]>([]);

    useEffect(() => {
        if (ticket) {
            console.log(ticket)
            setHistories(ticket.ticket_history ?? []);
            // .sort((h1: TicketHistory, h2: TicketHistory) => h2.created_at.getTime() - h1.created_at.getTime())
        }
    }, [ticket])
    return (
        <Card>
            <CardHeader title="History" />
            <CardContent >
                {histories.length === 0 && <Typography>No History found</Typography>}
                {histories.length > 0 &&
                    <Stack spacing={'1rem'}>
                        {(histories)
                            .map((hist: TicketHistory, idx: number) => {
                                const date = hist.created_at;
                                return <MainCard key={idx}>
                                    <Typography>Action: {hist.description}</Typography>
                                    <Typography>Date: {dayjs(date).format("MM-dd-YYYY")} {dayjs(date).format("hh:mm")}</Typography>
                                    <Typography>Change By: {hist.change_by}</Typography>
                                </MainCard>
                            })}
                    </Stack>
                }
            </CardContent>
        </Card>);
}

export default TicketHistoryCard;

