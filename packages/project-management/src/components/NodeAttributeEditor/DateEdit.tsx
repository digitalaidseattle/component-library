

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useEffect, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DatePicker, } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import { InputEditProps } from "./types";

export const DateEdit: React.FC<InputEditProps<Date>> = ({ value, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(value);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        setDate(value);
    }, [value]);

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
        <Stack direction={'row'} sx={{ flexGrow: 1 }}>
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
                        sx={{ width: "100%" }}
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

