
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



const items: Map<DDCategory<string>, TicketWrapper[]> = new Map<DDCategory<string>, TicketWrapper[]>([
    [
        categories[0], // 'In Progress' category object
        [
            { id: "2", status: 'backlog', description: 'Second Ticket' },
            { id: "3", status: 'backlog', description: 'Third Ticket' },
            { id: "4", status: 'backlog', description: 'fourth Ticket' },
            { id: "5", status: 'backlog', description: 'Ticket 5' },
            { id: "6", status: 'backlog', description: ' Ticket 6' }
        ]
    ],
    [
        categories[1], // 'In Progress' category object
        [{ id: "1", status: 'in-progress', description: 'First Ticket' }]
    ],
]);

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

    const headerRenderer = (cat: DDCategory<string>): ReactNode => {
        return (
            <Box>
                <Typography variant="h6">Status: {cat.label}</Typography>
            </Box>
        )
    };

    return (
        <Box id="DnD" width="100%">
            <MainCard title="Drag Drop Sample">
                <DragAndDrop
                    onChange={(c: Map<string, unknown>, t: TicketWrapper) => handleChange(c, t)}
                    items={items}
                    categories={categories}
                    cardRenderer={cardRenderer}
                    headerRenderer={headerRenderer} />
            </MainCard>
        </Box>
    )
}
