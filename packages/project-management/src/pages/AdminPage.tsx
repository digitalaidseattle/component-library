/**
 * AdminPage.tsx
 * 
 */

// material-ui
import React, { useEffect, useState } from "react";

import { InputFormDialog, InputOption } from "@digitalaidseattle/mui";
import {
    Button,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import DelimitedListInput from "../components/DelmitedListInput";
import EntityListInput from "../components/EntityListInput";
import { ProgramService } from "../services";
import { Profile, Program } from "../types";

//
export const AdminPage: React.FC = () => {
    const service = ProgramService.getInstance();
    const [openProgramModal, setOpenProgramModal] = useState<boolean>(false);
    const [programModalTitle, setProgramModalTitle] = useState<string>("");
    const [activeProfiles, setActiveProfiles] = useState<Profile[]>([]);
    const [program, setProgram] = useState<Program>();


    useEffect(() => {
        setActiveProfiles([
            { id: 'profile1', name: "Alice", email: 'test@com' },
            { id: 'profile2', name: "Bob", email: 'test@com' },
            { id: 'profile3', name: "Harry", email: 'test@com' },
            { id: 'profile4', name: "carol", email: 'test@com' }
        ])
    }, [service])

    const programInputFields: InputOption[] = [
        {
            name: "name",
            label: 'Name',
            disabled: false
        },
        {
            name: "description",
            label: 'Description',
            disabled: false,
        },
        {
            name: "node_types",
            label: 'Tracking Levels (highest-to-lowest)',
            type: 'custom',
            disabled: false,
            inputRenderer: (idx, option, value, onChange) => {
                return <DelimitedListInput
                    label={option.label}
                    value={value}
                    placeholder={'Epic, Feature, Story, Task'}
                    onChange={onChange}
                    showChips={true}
                />
            }
        },
        {
            name: "statuses",
            label: 'Statuses (soonest-to-lastest)',
            type: 'custom',
            disabled: false,
            inputRenderer: (idx, option, value, onChange) => {
                return <DelimitedListInput
                    label={option.label}
                    value={value}
                    placeholder={'Backlog, ToDo, In Progress'}
                    onChange={onChange}
                />
            }
        },
        {
            name: "members",
            label: 'Members',
            type: 'custom',
            disabled: false,
            inputRenderer: (idx, option, value, onChange) => {
                return <EntityListInput
                    source={activeProfiles}
                    label={option.label}
                    value={value}
                    onChange={onChange}
                    entityRender={e => e.name}
                />
            }
        }

    ];

    function handleOpenProgramModal(arg0: boolean): void {
        setOpenProgramModal(true);
        setProgramModalTitle("Add Program");
        setProgram(service.empty())
    }

    function handleProgamChange(resp: Program | null | undefined): void {
        console.log('handleProgamChange', resp);
        setOpenProgramModal(false);
    }

    return (
        <>
            <Card>
                <CardHeader title="Program Management Admin" />
                <CardContent>
                    <Button variant="outlined" onClick={() => handleOpenProgramModal(true)}>Add Program</Button>
                </CardContent>
            </Card>
            <InputFormDialog
                open={openProgramModal}
                title={programModalTitle}
                inputFields={programInputFields}
                entity={program}
                onChange={handleProgamChange} />
        </>
    );
}
