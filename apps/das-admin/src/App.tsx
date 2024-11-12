
import { ReactNode } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { LoadingContextProvider } from '@digitalaidseattle/core';
import { DragAndDrop } from '@digitalaidseattle/draganddrop';
import { DDType, DDCategory } from '@digitalaidseattle/draganddrop/dist/declarations/src/components/types';
import './App.css';


type Ticket = {
  id: string;
  status: "backlog" | "in-progress" | "complete";
  description: string;
}
type TicketWrapper = Ticket & DDType
const categories: DDCategory<string>[] = [
  { label: 'Backlog', value: 'backlog', },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
]

const items: TicketWrapper[] = [
  { id: "1", status: 'in-progress', description: 'First Ticket' },
  { id: "2", status: 'backlog', description: 'Second Ticket' }
]
function App() {

  const handleChange = (changes: Map<string, unknown>, ticket: TicketWrapper) => {
    console.log(changes, ticket);
  }

  const cardRenderer = (item: TicketWrapper): ReactNode => {
    return (<Card>
      <CardContent>
        <Typography>id: {item.id}</Typography>
        <Typography>description: {item.description}</Typography>
        <Button onClick={() => alert('ouch!')} >Click Me!</Button>
      </CardContent>
    </Card>)
  };

  return (
    <>
      <LoadingContextProvider>
        <Typography>Test</Typography>
        <DragAndDrop
          onChange={(c: Map<string, unknown>, t: TicketWrapper) => handleChange(c, t)}
          items={items}
          categories={categories}
          isCategory={(tix: TicketWrapper, cat: DDCategory<string>) => tix.status === cat.value}
          cardRenderer={cardRenderer} />
      </LoadingContextProvider>
    </>
  )
}

export default App
