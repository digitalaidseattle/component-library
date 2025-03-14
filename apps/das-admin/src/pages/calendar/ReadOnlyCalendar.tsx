/**
 * ReadOnlyCalendar.tsx
 * Display information of a ticket
 */

// react


// material-ui
import {
    Stack,
    Typography
} from '@mui/material';

import {
    DateCalendar,
    DayCalendarSkeleton,
    PickersCalendarHeaderProps, PickersDay, pickersDayClasses, PickersDayProps
} from '@mui/x-date-pickers';
import { format } from 'date-fns/format';


interface ReadOnlyCalendarProps {
    defaultDay: Date,
    selectedDay: (date: Date) => { isSelected: boolean, color: string }
}

const ReadOnlyCalendar: React.FC<ReadOnlyCalendarProps> = ({ defaultDay, selectedDay }) => {

    const CustomCalendarHeader = (props: PickersCalendarHeaderProps<Date>) => {
        const { currentMonth } = props;
        return (
            <Stack spacing={1} direction="row">
                <Typography variant="body2">{format(currentMonth, "MMMM yyy")}</Typography>
            </Stack>
        );
    }

    function CustomDay(props: PickersDayProps<Date>) {
        const { day, outsideCurrentMonth, ...other } = props;
        const { isSelected, color } = selectedDay(props.day);
        // const isSelected = highlightedDays.find(d => isSameDay(d, props.day)) !== undefined;
        // logic could be injected here to vary the color
        const special = {
            [`&.${pickersDayClasses.selected}`]: {
                backgroundColor: color
            }
        }
        return (
            // pickersDayClasses.selected
            <PickersDay {...other}
                sx={special}
                selected={isSelected}
                outsideCurrentMonth={outsideCurrentMonth} day={day} />
        );
    }

    return (
        <DateCalendar
            defaultValue={defaultDay}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
                day: CustomDay,
                calendarHeader: CustomCalendarHeader
            }}
            readOnly={true}
        />
    );
}

export default ReadOnlyCalendar;
