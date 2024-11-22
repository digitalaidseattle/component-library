
import { DDType, DDCategory } from '@digitalaidseattle/draganddrop/dist/declarations/src/components/types';
import { DragAndDrop } from '@digitalaidseattle/draganddrop';
import { MainCard } from '@digitalaidseattle/mui';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

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

export const DragAndDropExample = () => {

    const handleChange = (changes: Map<string, unknown>, ticket: TicketWrapper) => {
        console.log(changes, ticket);
    }

    const cardRenderer = (item: TicketWrapper): ReactNode => {
        return (
            <Card>
                <CardContent>
                    <Typography>id: {item.id}</Typography>
                    <Typography>description: {item.description}</Typography>
                    <Button onClick={() => alert('ouch!')} >Click Me!</Button>
                </CardContent>
            </Card>
        )
    };

    return (
        <Box id="DnD" width="100%">
            <MainCard title="Drag Drop Sample">
                <DragAndDrop
                    onChange={(c: Map<string, unknown>, t: TicketWrapper) => handleChange(c, t)}
                    items={items}
                    categories={categories}
                    isCategory={(tix: TicketWrapper, cat: DDCategory<string>) => tix.status === cat.value}
                    cardRenderer={cardRenderer} />
            </MainCard>
        </Box>
    )
}
