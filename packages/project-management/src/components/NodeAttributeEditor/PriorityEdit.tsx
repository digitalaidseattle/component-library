

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useEffect, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IconButton, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import { InputEditProps } from "./types";

export const PriorityEdit: React.FC<InputEditProps<string>> = ({ value, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value ?? "");
    const [active, setActive] = useState<boolean>(false);

    // TODO configurable priorities?
    const [priorities] = useState<string[]>(["low", "medium", "high"]);

    useEffect(() => {
        setText(value);
    }, [value]);

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
        <Stack direction={'row'} sx={{ flexGrow: 1 }}>
            {!edit &&
                <Tooltip title='Click to edit'>
                    <Stack
                        sx={{
                            width: "100%",
                            bgcolor: active ? 'lightgray' : '',
                            cursor: active ? 'pointer' : ''
                        }}
                        onClick={() => setEdit(!edit)}
                        onMouseEnter={() => { setActive(true) }}
                        onMouseLeave={() => { setActive(false) }}>
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
                        {priorities.map(status =>
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

