

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useEffect, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IconButton, Stack, SxProps, TextField, Tooltip, Typography } from "@mui/material";
import { InputEditProps } from "./types";

export type TextEditProps = InputEditProps<string> & {
    rows?: number
};

export const TextEdit: React.FC<TextEditProps> = ({ value, rows, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        setText(value);
    }, [value])

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
                    <TextField
                        id="problem"
                        name="problem"
                        type="text"
                        value={text}
                        variant="standard"
                        fullWidth={true}
                        multiline={rows && rows > 0 ? true : false}
                        rows={rows ?? 1}
                        onChange={(ev => setText(ev.target.value))}
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

