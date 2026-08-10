

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useContext, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IconButton, MenuItem, Select, Stack, SxProps, TextField, Tooltip, Typography } from "@mui/material";
import { ProgramContext } from "./ProgramContext";

export type StatusEditProps = {
    label?: string,
    value: string,
    rows?: number,
    sx?: SxProps,
    onChange: (text: string) => void
};

export const StatusEdit: React.FC<StatusEditProps> = ({ label, value, rows, sx, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);
    const [active, setActive] = useState<boolean>(false);

    const { program } = useContext(ProgramContext);

    const cancel = () => {
        setText(value);
        setEdit(false);
        setActive(false);
    }

    const doSave = () => {
        onChange(text)
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
                        <Typography >{text}</Typography>
                    </Stack>
                </Tooltip>
            }
            {edit &&
                <>
                    <Select
                        value={text}
                        fullWidth={true}
                        onChange={(ev) => setText(ev.target.value as string)}>
                        {program.node_statuses.map(status =>
                            <MenuItem key={status} value={status} >{status}</MenuItem>
                        )}
                    </Select>
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

