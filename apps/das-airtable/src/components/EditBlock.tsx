

/**
 *  EpicPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { IconButton, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";

export type EditBlockProps = {
    label: string,
    value: string,
    save: (text: string) => void
};

export const EditBlock: React.FC<EditBlockProps> = ({ label, value, save }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const cancel = () => {
        setText(value);
        setEdit(false);
    }
    const doSave = () => {
        save(text)
        setEdit(false);
    }

    return (
        <>
            <Typography fontWeight={600}>{label}:
                {!edit &&
                    <IconButton size="small" color="primary" onClick={() => setEdit(!edit)}>
                        <EditOutlined />
                    </IconButton>
                }
                {edit &&
                    <>
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </>
                }
            </Typography>
            {!edit && <Typography>{text}</Typography>}
            {edit && <TextField
                id="problem"
                name="problem"
                type="text"
                value={text}
                fullWidth
                variant="standard"
                multiline
                rows={4}
                onChange={(ev => setText(ev.target.value))}
            />}
        </>)
}

export const EditLink: React.FC<EditBlockProps> = ({ label, value, save }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [text, setText] = useState<string>(value);

    const cancel = () => {
        setText(value);
        setEdit(false);
    }
    const doSave = () => {
        save(text)
        setEdit(false);
    }

    return (
        <>
            <Typography fontWeight={600}>{label}:
                {!edit &&
                    <IconButton size="small" color="primary" onClick={() => setEdit(!edit)}>
                        <EditOutlined />
                    </IconButton>
                }
                {edit &&
                    <>
                        <IconButton size="small" color="error" onClick={cancel}>
                            <CloseCircleOutlined />
                        </IconButton>
                        <IconButton size="small" color="success" onClick={doSave}>
                            <CheckCircleOutlined />
                        </IconButton>
                    </>
                }
            </Typography>
            {!edit && <Link href={text} >{text}</Link>}
            {edit && <TextField
                id="problem"
                name="problem"
                type="text"
                value={text}
                fullWidth
                variant="standard"
                multiline
                rows={4}
                onChange={(ev => setText(ev.target.value))}
            />}
        </>)
}