/**
 * AdminPage.tsx
 * 
 * @copyright Digital Aid Seattle 2026
 */
import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TextField
} from "@mui/material";

import { Profile } from "../types";
import { InputFormDialog } from "@digitalaidseattle/mui";

const UI_STRINGS = {
    CANCEL: 'Cancel',
    SUBMIT: 'Submit'
}

interface Props {
    title: string;
    opened: boolean;

    onClose: () => void;
    onSubmit: (profiles: Profile[]) => void;
}

export const ProgramModal: React.FC<Props> = ({
    title,
    opened,
    onClose,
    onSubmit
}) => {

    function handleSubmit() {
        onClose();
    }

    return (<InputFormDialog
        open={false}
        title={""}
        inputFields={[]}
        entity={undefined}
        onChange={function (resp: unknown): void {
            throw new Error("Function not implemented.");
        }} />);
}

