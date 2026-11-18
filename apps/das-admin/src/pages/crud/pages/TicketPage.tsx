/**
 * TicketPage.tsx
 * Display information of a ticket
 */

// react
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Breadcrumbs, Button, Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';

import { Identifier, RefreshContext } from '@digitalaidseattle/core';
import TicketForm from '../components/TicketForm';
import TicketHistoryCard from '../components/TicketHistoryCard';
import { TicketsDAO } from '../api/TicketsDAO';
import { TicketService } from '../api/ticketService';
import { Ticket } from '../api/types';

const Labels = {
  updateMessage: 'Ticket updated.',
  saveButton: 'Save',
  resetButton: 'Reset',
}
const TicketPage = () => {
  const dao = TicketsDAO.getInstance();
  const ticketService = TicketService.getInstance();

  const { id } = useParams();
  const { refresh, setRefresh } = useContext(RefreshContext);

  const [ticket, setTicket] = useState<Ticket>();
  const [changes, setChanges] = useState<Partial<Ticket>>({});
  const [messages, setMessages] = useState<Map<string, string>>(new Map());
  const [staff, setStaff] = useState<string[]>();

  useEffect(() => {
    dao.getById(id as Identifier)
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

  useEffect(() => {
    console.log('refresh', refresh)
  }, [refresh]);

  const handleChange = (field: string, value: unknown) => {
    (changes as any)[field] = value;
    setChanges({ ...changes })

    const clone = Object.assign({}, ticket);
    const updated = Object.assign(clone, changes)
    setTicket(updated)

    setMessages(ticketService.validateTicket(updated));
  }

  const reset = () => {
    dao.getById(id as Identifier)
      .then(ticket => setTicket(ticket!))
  }

  const save = () => {
    if (ticket) {
      dao.update(ticket?.id!, changes)
        .then((resp: Ticket) => {
          setTicket(resp);
          setChanges({});
          setRefresh(refresh + 1);
        })
    }
  }

  return (ticket &&
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit"
          href="/">
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/crud-example`}
        >
          Tickets
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Ticket Detail</Typography>
      </Breadcrumbs>
      <Stack gap={2}>
        <Card>
          <CardHeader
            title={`Ticket: ${ticket.summary} (id = ${ticket.id})`}
            action={
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
            }
          />
          <CardContent>
            <TicketForm
              ticket={ticket}
              staff={staff!}
              messages={messages!}
              onChanged={handleChange}
            />
          </CardContent>
        </Card>
        <TicketHistoryCard ticket={ticket} />
      </Stack>
    </>
  );
}

export default TicketPage;
