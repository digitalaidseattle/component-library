/**
 * ExcelPage.tsx
 * Example of uploading an excel spreadsheet into DB and displaying the data


*/
import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useNotifications } from '@digitalaidseattle/core';
import { staffService } from './staffService';
import StaffTable from './StaffTable';
import { Staff } from './types';

const ExcelPage = () => {

    const [staff, setStaff] = useState<Staff[]>([]);
    // newStaff state is used for rendering newly added rows separately from the rest, so we can highlight them on upload.
    const [newStaff, setNewStaff] = useState<Staff[]>([]);

    const notification = useNotifications();

    useEffect(() => {
        staffService.getAll()
            .then(res => setStaff(res))
    }, [])

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const file = event.target.files[0];
        // get parsed array from the uploaded excel file
        const newStaffData = await staffService.parse(file)
            .catch(err => notification.error('Error while parsing: ' + err.message));
        // upload parsed data to supabase
        if (newStaffData) {
            staffService.batchInsert(newStaffData)
                .then(() => {
                    // append (previously uploaded) staff to staff state, so changes are reflected in table
                    setStaff([...newStaff, ...staff]);
                    // update state with the just uploaded data
                    setNewStaff([...newStaffData])
                    notification.success('Success! Uploaded data to staff table.')
                })
                .catch((error) => notification.error(error.toString()));
        }
    }

    const download = () => {
        staffService.download("staff.xlsx", staff)
            .then(() => notification.success('Success! Exported staff table.'))
    }

    return (
        <Card>
            <CardHeader title="Excel Upload Example" />
            <CardContent>
                <Typography variant="body2">
                    This demo parses data from an excel file (.xlsx) that has the columns: <b>name</b>, <b>email</b>, and <b>roles</b>.
                    <br />
                    Try it out with <b>staff-test.xlsx</b> located in the github repository, under <b>test/resources</b>.
                    <br />
                    Or try downloading an excel spreadsheet.
                </Typography>
                <Stack direction={'row'} spacing={2} m={2}>
                    <Box sx={{ marginY: '1rem' }}>
                        <input
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="contained-button-file"
                            onChange={(e) => handleUpload(e)}
                        />
                    </Box>
                    <Button variant='outlined'
                        onClick={download}>Export</Button>
                </Stack>
                <StaffTable tableData={staff} newData={newStaff} />
            </CardContent>
        </Card>
    );
}

export default ExcelPage;
