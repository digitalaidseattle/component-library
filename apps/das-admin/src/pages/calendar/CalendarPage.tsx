/**
 * CalendarPage.tsx
 * Display information of a ticket
 */

// react
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


// material-ui

import {
  LocalizationProvider
} from '@mui/x-date-pickers';
import DateEntryExample from './DateEntryExample';

const CalendarPage = () => {


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateEntryExample />
    </LocalizationProvider>
  );
}

export default CalendarPage;
