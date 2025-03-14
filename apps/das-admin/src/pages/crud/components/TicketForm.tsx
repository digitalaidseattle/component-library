import { Autocomplete, MenuItem, Select, Stack, TextField } from "@mui/material";

import { MainCard } from "@digitalaidseattle/mui";
import { TicketProps } from "./TicketProps";



// project import
interface TicketFormProps extends TicketProps {
    onChanged: (field: string, value: unknown) => void;
    staff: string[];
    messages: Map<string, string>;
}
const TicketForm: React.FC<TicketFormProps> = ({ ticket, staff, messages, onChanged }) => {
    return (
        <MainCard>
            <Stack spacing={'1rem'}>
                <TextField
                    id="clientName"
                    error={messages.get('clientName') !== undefined}
                    helperText={messages.get('clientName')}
                    name="clientName"
                    type="text"
                    label="Client Name"
                    fullWidth
                    variant="outlined"
                    value={ticket.clientName}
                    required={true}
                    onChange={(e) => onChanged('clientName', e.target.value)}
                />
                <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    fullWidth
                    variant="outlined"
                    value={ticket.email}
                    onChange={(e) => onChanged('email', e.target.value)}
                />
                <TextField
                    id="phone"
                    name="phone"
                    type="phone"
                    label="Phone"
                    fullWidth
                    variant="outlined"
                    value={ticket.phone}
                    onChange={(e) => onChanged('phone', e.target.value)}
                />
                <TextField
                    id="summary"
                    error={messages.get('summary') !== undefined}
                    helperText={messages.get('summary')}
                    name="summary"
                    type="text"
                    label="Summary"
                    fullWidth
                    variant="outlined"
                    required={true}
                    value={ticket.summary}
                    onChange={(e) => onChanged('summary', e.target.value)}
                />
                <TextField
                    id="description"
                    name="description"
                    type="text"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={ticket.description}
                    onChange={(e) => onChanged('description', e.target.value)}
                />
                <Select
                    id="inputSource"
                    name="inputSource"
                    value={ticket.inputSource}
                    label="Input Source"
                    fullWidth
                    onChange={(event) => onChanged('inputSource', event.target.value)}>
                    {['email', 'phone', 'walk-in'].map((s, idx: number) => <MenuItem key={idx} value={s}>{s}</MenuItem>)}
                </Select>
                <Autocomplete
                    id="assignee"
                    value={ticket.assignee}
                    onChange={(_event: any, newValue: string | null) => {
                        onChanged('assignee', newValue);
                    }}
                    sx={{ width: "100%" }}
                    options={staff}
                    renderInput={(params) => <TextField {...params} label="Assigned to" />}
                />
            </Stack>
        </MainCard>
    )
}

export default TicketForm;

