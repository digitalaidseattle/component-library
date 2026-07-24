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
    Stack
} from "@mui/material";

import { Profile } from "../types";

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

    return (<Dialog
        open={opened}
        onClose={onClose}
        PaperProps={{
            sx: { width: '40rem', maxWidth: '90vw' },
        }}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Stack sx={{ display: "flex", flexWrap: "wrap" }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    {/* <Select
                        sx={{ m: 1, width: "100%" }}
                        multiple
                        value={selectedProfiles}
                        onChange={handleChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) =>
                            selected.map((s_id) => findFacilitator(s_id)!.name).join(", ")
                        }
                    >
                        {profiles.map((prof) => (
                            <MenuItem key={prof.id as string | undefined} value={prof.id as string | undefined}>
                                <Checkbox
                                    checked={
                                        selectedProfiles.find((s_id) => s_id === prof.id) !==
                                        undefined
                                    }
                                />
                                <ListItemText primary={prof.name} />
                            </MenuItem>
                        ))}
                    </Select> */}
                </FormControl>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>{UI_STRINGS.CANCEL}</Button>
            <Button
                type="submit"
                color="primary"
                variant="contained"
                onClick={handleSubmit}>{UI_STRINGS.SUBMIT}</Button>
        </DialogActions>
    </Dialog >
    );
}

