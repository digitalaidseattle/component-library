/**
 * DateEntryExample.tsx
 * Display information of a ticket
 */

// react
import { useState } from 'react';


// material-ui
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

import { DeleteOutlined } from '@ant-design/icons';
import {
  DateField, DatePicker
} from '@mui/x-date-pickers';
import ReadOnlyCalendar from './ReadOnlyCalendar';

const Labels = {
  title: 'Calendar Example',
  description: 'The example shows different ways to add a date, then display it.',
  dateEntries: 'Multiple date entry',
  datelist: 'Selected Dates',
  static: 'Static Calendars'
}


const DateEntryExample = () => {
  const theme = useTheme();
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);
  const [fieldDate, setFieldDate] = useState<Date | null>(new Date());
  const [pickerDate, setPickerDate] = useState<Date | null>(new Date());

  const addFieldDate = () => {
    if (fieldDate) {
      const mySet = new Set(highlightedDays);
      mySet.add(dayjs(fieldDate).startOf('day').toDate());
      setHighlightedDays(Array.from(mySet));
    }
  }

  const addPickerDate = () => {
    if (pickerDate) {
      console.log(pickerDate, dayjs(pickerDate))
      const mySet = new Set(highlightedDays);
      mySet.add(dayjs(pickerDate).startOf('day').toDate());
      setHighlightedDays(Array.from(mySet));
    }
  }

  const removeDate = (index: number) => {
    highlightedDays.splice(index, 1)
    setHighlightedDays([...highlightedDays]);
  }

  const isSelected = (day: Date): { isSelected: boolean, color: string } => {
    const selected = highlightedDays.find(d => dayjs(d).isSame(dayjs(day), 'day')) !== undefined;
    return {
      isSelected: selected,
      color: selected ? 'cyan' : ''
    }
  }

  return (
    <Card>
      <CardHeader title={Labels.title}
        subheader={Labels.description} />
      <CardContent>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {/* Different ways to add Dates */}
          <Grid size={4}>
            <Stack spacing={2}>
              <Typography variant="h6" color={theme.palette.text.primary}>{Labels.dateEntries}</Typography>
              <Stack direction="row" spacing={2}>
                <DateField label="Basic date field"
                  value={dayjs(fieldDate)}
                  onChange={(d) => setFieldDate(d!.toDate())} />
                <Button variant="outlined" onClick={addFieldDate}>Add</Button>
              </Stack>
              <Stack direction="row" spacing={2}>
                <DatePicker label="Basic date picker"
                  value={dayjs(pickerDate)}
                  onChange={(d) => setPickerDate(d!.toDate())} />
                <Button variant="outlined" onClick={addPickerDate}>Add</Button>
              </Stack>
            </Stack>
          </Grid>
          {/* Display dates  */}
          <Grid size={4}>
            <Stack spacing={2}>
              <Typography variant="h6" color={theme.palette.text.primary}>{Labels.datelist}</Typography>
              {highlightedDays.map((d, idx) =>
                <Stack direction="row" spacing={2}>
                  <IconButton onClick={() => removeDate(idx)} size={'small'}>
                    <DeleteOutlined />
                  </IconButton>
                  <Typography color={theme.palette.text.primary}>{dayjs(d).format("MMMM DD YYYY")}</Typography>
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Static calendar */}
          <Grid size={4} >
            <Stack spacing={2}>
              <Typography variant="h6" color={theme.palette.text.primary}>{Labels.static}</Typography>
              <ReadOnlyCalendar
                defaultDay={new Date()}
                selectedDay={isSelected}
              />
              <ReadOnlyCalendar
                defaultDay={dayjs().add(1, 'M').toDate()}
                selectedDay={isSelected}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

  );
}

export default DateEntryExample;
