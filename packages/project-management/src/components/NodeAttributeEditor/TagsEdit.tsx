/**
 * GrantOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React from "react";

import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
    Chip,
    IconButton,
    Stack,
    TextField
} from "@mui/material";

const TagButton = ({ onChange }: { onChange: (newValue: string | null) => void }) => {
    const [edit, setEdit] = React.useState<boolean>(false);
    const [tag, setTag] = React.useState<string>('New Tag');

    function cancel() {
        setEdit(false);
        setTag("New Tag");
    }
    function doSave() {
        onChange(tag);
        setEdit(false);
        setTag("New Tag");
    }

    return (
        <>
            {!edit && <IconButton onClick={() => setEdit(true)}><PlusCircleOutlined /></IconButton>}
            {edit &&
                <>
                    <TextField
                        id="problem"
                        name="problem"
                        type="text"
                        value={tag}
                        variant="standard"
                        onChange={(ev => setTag(ev.target.value))}
                    />
                    <IconButton size="small" color="error" onClick={cancel}>
                        <CloseCircleOutlined />
                    </IconButton>
                    <IconButton size="small" color="success" onClick={doSave}>
                        <CheckCircleOutlined />
                    </IconButton>
                </>
            }
        </>
    )
}

export const TagsEdit = ({
    value : tags,
    onChange
}: {
    value: string[],
    onChange: (updated: string[]) => void,
}) => {

    function handleDeleteTag(tag: string): void {
        const index = tags.indexOf(tag);
        if (index > -1) {
            tags.splice(index, 1);
            onChange([...tags]);
        }
    }

    function handleAddTag(newValue: string | null): void {
        if (newValue) {
            onChange([...tags ?? [], newValue]);
        }
    }

    return (
        <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
            {(tags ?? []).map((tag, idx) => <Chip key={idx} label={tag} onDelete={() => handleDeleteTag(tag)} />)}
            <TagButton onChange={handleAddTag} />
        </Stack>
    );

}
