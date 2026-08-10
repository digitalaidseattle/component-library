

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useEffect, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, SxProps, Tooltip, Typography } from "@mui/material";
import { DatePicker, } from "@mui/x-date-pickers";
import dayjs from 'dayjs';

export type DateEditProps = {
    label?: string,
    value: Date,
    rows?: number,
    sx?: SxProps,
    onChange: (date: Date) => void
};

export const DateEdit: React.FC<DateEditProps> = ({ label, value, rows, sx, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(value);
    const [active, setActive] = useState<boolean>(false);

    const cancel = () => {
        setDate(value);
        setEdit(false);
        setActive(false);
    }

    const doSave = () => {
        onChange(date)
        setEdit(false);
        setActive(false);
    }

    return (
        <Stack direction={'row'}>
            {label && <Typography fontWeight={600} sx={{ marginRight: 2 }} >{label}:</Typography>}
            {!edit &&
                <Tooltip title='Click to edit'>
                    <Stack sx={{
                        width: "100%",
                        bgcolor: active ? 'lightgray' : '',
                        cursor: active ? 'pointer' : ''
                    }} onClick={() => setEdit(!edit)} onMouseEnter={() => { setActive(true) }} onMouseLeave={() => { setActive(false) }}>
                        <Typography >{date?.toDateString()}</Typography>
                    </Stack>
                </Tooltip>
            }
            {edit &&
                <>
                    <DatePicker
                        label={label}
                        value={dayjs(date)}
                        onChange={(value) => setDate(value?.toDate())}
                    />
                    <IconButton size="small" color="error" onClick={cancel}>
                        <CloseCircleOutlined />
                    </IconButton>
                    <IconButton size="small" color="success" onClick={doSave}>
                        <CheckCircleOutlined />
                    </IconButton>
                </>
            }
        </Stack>
    )
}

