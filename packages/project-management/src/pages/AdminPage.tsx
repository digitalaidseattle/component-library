/**
 * AdminPage.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography
} from '@mui/material';
import { ProgramModal } from "../components/ProgramModal";

//
export const AdminPage: React.FC = () => {
    const [openProgramModal, setOpenProgramModal] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");

    function handleOpenProgramModal(arg0: boolean): void {
        setOpenProgramModal(true);
        setProgramModalTitle("Add Program")
    }

    return (
        <>
            <Card>
                <CardHeader title="Program Management Admin" />
                <CardContent>
                    <Button variant="outlined" onClick={() => handleOpenProgramModal(true)}>Add Program</Button>
                </CardContent>
            </Card>
            <ProgramModal
                title={programModalTitle}
                opened={openProgramModal}
                onClose={() => setOpenProgramModal(false)}
                onSubmit={() => { console.log('onSubmit'); setOpenProgramModal(false) }} />
        </>
    );
}
