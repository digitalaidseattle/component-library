/**
 * TagButton.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React, { useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  IconButton,
  TextField
} from "@mui/material";

export const TagButton = ({ onChange }: { onChange: (newValue: string | null) => void }) => {
  const [edit, setEdit] = React.useState<boolean>(false);
  const [tag, setTag] = useState<string>('New Tag');

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
