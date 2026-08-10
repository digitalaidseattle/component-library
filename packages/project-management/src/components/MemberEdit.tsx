

/**
 *  TextEdit.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import React, { useContext, useEffect, useState } from "react";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, IconButton, MenuItem, Select, Stack, SxProps, TextField, Tooltip, Typography } from "@mui/material";
import { ProgramContext } from "./ProgramContext";
import { Profile } from "../types";

export type MemberEditProps = {
    label?: string,
    value: string,
    rows?: number,
    sx?: SxProps,
    onChange: (text: string) => void
};

export const MemberEdit: React.FC<MemberEditProps> = ({ label, value, rows, sx, onChange }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [memberId, setMemberId] = useState<string>(value ?? "");
    const [member, setMember] = useState<Profile>();
    const [active, setActive] = useState<boolean>(false);

    const { program } = useContext(ProgramContext);

    useEffect(() => {
        if (program && memberId) {
            setMember(program.members.find(mem => mem.id === memberId));
        }

    }, [program, memberId])

    const cancel = () => {
        setMemberId(value);
        setEdit(false);
        setActive(false);
    }

    const doSave = () => {
        onChange(memberId)
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
                        {member && <Stack direction={"row"}><Avatar src={member.pic} /><Typography>{member.name}</Typography></Stack>}
                    </Stack>
                </Tooltip>
            }
            {edit &&
                <>
                    <Select
                        value={memberId}
                        fullWidth={true}
                        onChange={(ev) => setMemberId(ev.target.value as string)}>
                        {program.members.map(member =>
                            <MenuItem key={member.id} value={member.id as string} >
                                <Stack direction={"row"}><Avatar src={member.pic} ></Avatar> <Typography>{member.name}</Typography></Stack>
                            </MenuItem>
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

