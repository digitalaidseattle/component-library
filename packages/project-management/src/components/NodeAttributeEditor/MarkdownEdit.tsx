

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useEffect, useRef, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { BoldItalicUnderlineToggles, headingsPlugin, listsPlugin, ListsToggle, MDXEditor, MDXEditorMethods, toolbarPlugin, UndoRedo } from '@mdxeditor/editor';
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import Markdown from 'react-markdown';
import { InputEditProps } from "./types";

export const MarkdownEdit: React.FC<InputEditProps<string>> = ({ value, onChange }) => {
    const ref = useRef<MDXEditorMethods>(null);

    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);
    const [active, setActive] = useState<boolean>(false);

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
                <Stack
                    sx={{
                        width: "100%",
                        bgcolor: active ? 'lightgray' : '',
                        cursor: active ? 'pointer' : ''
                    }}
                    onClick={() => setEdit(!edit)}
                    onMouseEnter={() => { setActive(true) }}
                    onMouseLeave={() => { setActive(false) }}>
                    <Tooltip title='Click to edit'>
                        <Box>
                            <Markdown>{text ?? "*Click to edit*"}</Markdown>
                        </Box>
                    </Tooltip>
                </Stack>
            }
            {edit &&
                <Stack sx={{ flexGrow: 1 }}>
                    <MDXEditor
                        ref={ref}
                        markdown={text ?? ""}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            toolbarPlugin({
                                toolbarClassName: 'my-classname',
                                toolbarContents: () => (
                                    <>
                                        <UndoRedo />
                                        <BoldItalicUnderlineToggles />
                                        <ListsToggle />
                                    </>
                                )
                            })
                        ]}
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

