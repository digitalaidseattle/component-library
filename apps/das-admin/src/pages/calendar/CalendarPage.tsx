/**
 * CalendarPage.tsx
 * Display information of a ticket
 */

// react


// material-ui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import {
  LocalizationProvider
} from '@mui/x-date-pickers';
import DateEntryExample from './DateEntryExample';

const CalendarPage = () => {


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateEntryExample />
    </LocalizationProvider>
  );
}

export default CalendarPage;
