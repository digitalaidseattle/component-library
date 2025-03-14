/**
 * DateEntryExample.tsx
 * Display information of a ticket
 */

// react
import { useState } from 'react';


// material-ui
import {
  Button,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DeleteOutlined } from '@ant-design/icons';
import {
  DateField, DatePicker
} from '@mui/x-date-pickers';
import { add, isSameDay, startOfDay } from 'date-fns';
import { format } from 'date-fns/format';
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
      mySet.add(startOfDay(fieldDate));
      setHighlightedDays(Array.from(mySet));
    }
  }

  const addPickerDate = () => {
    if (pickerDate) {
      const mySet = new Set(highlightedDays);
      mySet.add(startOfDay(pickerDate));
      setHighlightedDays(Array.from(mySet));
    }
  }

  const removeDate = (index: number) => {
    highlightedDays.splice(index, 1)
    setHighlightedDays([...highlightedDays]);
  }

  const isSelected = (day: Date): { isSelected: boolean, color: string } => {
    const selected = highlightedDays.find(d => isSameDay(d, day)) !== undefined;
    return {
      isSelected: selected,
      color: selected ? 'cyan' : ''
    }
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Title row */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Stack direction="row" justifyContent={'space-between'} >
          <Typography variant="h5" color={theme.palette.text.primary}>{Labels.title}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Stack direction="row" justifyContent={'space-between'} >
          <Typography>{Labels.description}</Typography>
        </Stack>
      </Grid>
      {/* Different ways to add Dates */}
      <Grid item xs={12} lg={4}>
        <Stack spacing={2}>
          <Typography variant="h6" color={theme.palette.text.primary}>{Labels.dateEntries}</Typography>
          <Stack direction="row" spacing={2}>
            <DateField label="Basic date field"
              value={fieldDate}
              onChange={(d) => setFieldDate(d)} />
            <Button variant="outlined" onClick={addFieldDate}>Add</Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <DatePicker label="Basic date picker"
              value={pickerDate}
              onChange={(d) => setPickerDate(d)} />
            <Button variant="outlined" onClick={addPickerDate}>Add</Button>
          </Stack>
        </Stack>
      </Grid>
      {/* Display dates  */}
      <Grid item xs={12} lg={4}>
        <Stack spacing={2}>
          <Typography variant="h6" color={theme.palette.text.primary}>{Labels.datelist}</Typography>
          {highlightedDays.map((d, idx) =>
            <Stack direction="row" spacing={2}>
              <IconButton onClick={() => removeDate(idx)} size={'small'}>
                <DeleteOutlined />
              </IconButton>
              <Typography color={theme.palette.text.primary}>{format(d, "MMMM d yyy")}</Typography>
            </Stack>
          )}
        </Stack>
      </Grid>

      {/* Static calendar */}
      <Grid item xs={12} lg={4}>
        <Stack spacing={2}>
          <Typography variant="h6" color={theme.palette.text.primary}>{Labels.static}</Typography>
          <ReadOnlyCalendar
            defaultDay={new Date()}
            selectedDay={isSelected}
          />
          <ReadOnlyCalendar
            defaultDay={add(new Date(), { months: 1 })}
            selectedDay={isSelected}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default DateEntryExample;
