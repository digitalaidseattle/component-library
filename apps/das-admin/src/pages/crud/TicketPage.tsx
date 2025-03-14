/**
 * TicketPage.tsx
 * Display information of a ticket
 */

// react
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Button, Grid, Stack, Typography } from '@mui/material';

import { Identifier } from '@digitalaidseattle/core';
import { ticketService } from './ticketService';
import TicketForm from './components/TicketForm';
import TicketHistoryCard from './components/TicketHistoryCard';

const Labels = {
  updateMessage: 'Ticket updated.',
  saveButton: 'Save',
  resetButton: 'Reset',
}
const TicketPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket>();
  const [changes, setChanges] = useState<Partial<Ticket>>({});
  const [messages, setMessages] = useState<Map<string, string>>(new Map());
  const [staff, setStaff] = useState<string[]>();

  useEffect(() => {
    ticketService.getById(id as Identifier)
      .then(ticket => {
        if (ticket) {
          setTicket(ticket);
          setChanges({});
        }
      })
  }, [id]);

  useEffect(() => {
    setStaff(['Bob', 'Alice', 'Carol', 'Seamus']);
  }, []);

  const handleChange = (field: string, value: unknown) => {
    (changes as any)[field] = value;
    setChanges({ ...changes })

    const clone = Object.assign({}, ticket);
    const updated = Object.assign(clone, changes)
    setTicket(updated)

    setMessages(ticketService.validateTicket(updated));
  }

  const reset = () => {
    ticketService.getById(id as Identifier)
      .then(ticket => setTicket(ticket!))
  }

  const save = () => {
    if (ticket) {
      ticketService.update(ticket?.id!, changes)
        .then((resp: Ticket) => {
          setTicket(resp);
          setChanges({});
        })
    }
  }

  return (
    ticket &&
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Stack direction="row" justifyContent={'space-between'} >
            <Typography variant="h5">{`Ticket: ${ticket.summary} (id = ${ticket.id})`}</Typography>
            <Stack direction="row" spacing={'1rem'}>
              <Button
                title={Labels.resetButton}
                variant="contained"
                color="secondary"
                onClick={reset}>
                {Labels.resetButton}
              </Button>
              <Button
                title={Labels.saveButton}
                variant="contained"
                color="primary"
                disabled={Object.entries(changes).length === 0 || messages!.size > 0}
                onClick={save}>
                {Labels.saveButton}
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {/* row 2 */}
        <Grid item xs={12} md={7} lg={8}>
          <TicketForm
            ticket={ticket}
            staff={staff!}
            messages={messages!}
            onChanged={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <TicketHistoryCard ticket={ticket} />
        </Grid>
      </Grid>
    </>
  );
}

export default TicketPage;
