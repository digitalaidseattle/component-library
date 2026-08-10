

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { headingsPlugin, listsPlugin, MDXEditor } from '@mdxeditor/editor';
import { FormControl, IconButton, Stack, SxProps, TextField, Tooltip, Typography } from "@mui/material";
import Markdown from 'react-markdown';

export type MarkdownEditProps = {
    label?: string,
    value: string,
    rows?: number,
    sx?: SxProps,
    onChange: (text: string) => void
};

export const MarkdownEdit: React.FC<MarkdownEditProps> = ({ label, value, rows, sx, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);
    const [active, setActive] = useState<boolean>(false);

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
                        <Markdown >{text}</Markdown>
                    </Stack>
                </Tooltip>
            }
            {edit &&
                <Stack>
                    <MDXEditor markdown={text ?? ""}
                        plugins={[headingsPlugin(), listsPlugin()]}
                        onChange={(markdown) => setText(markdown)} />
                    <Stack direction={'row'}>
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </Stack>
                </Stack>
            }
        </Stack>
    )
}

