/**
 * ProgramDialog.tsx
 * 
 * @copyright Digital Aid Seattle 2026
 */
import React, { useEffect, useState } from "react";

import {
    Box,
    Chip,
    FormControl,
    FormLabel
} from "@mui/material";

import { InputFormDialog, InputOption } from "@digitalaidseattle/mui";
import { headingsPlugin, listsPlugin, MDXEditor } from "@mdxeditor/editor";
import { useProfiles } from "../services";
import { Profile, Program } from "../types";
import DelimitedListInput from "./DelmitedListInput";
import EntityListInput from "./EntityListInput";

interface Props {
    program: Program;
    title: string;
    opened: boolean;

    onClose: () => void;
    onSubmit: (updated: Program) => void;
}

export const ProgramDialog: React.FC<Props> = ({
    program,
    title,
    opened,
    onClose,
    onSubmit
}) => {
    const [activeProfiles, setActiveProfiles] = useState<Profile[]>([]);
    const { data: profiles } = useProfiles();

    useEffect(() => {
        if (profiles) {
            const active = profiles.filter(prof => prof.status === 'Active')
                .sort((a, b) => a.name.localeCompare(b.name));
            setActiveProfiles(active)
        }
    }, [profiles])

    const programInputFields: InputOption[] = [
        {
            name: "name",
            label: 'Name',
            disabled: false
        },
        {
            name: "prefix",
            label: 'Prefix',
            disabled: false
        },
        {
            name: "description",
            label: 'Description',
            type: 'custom',
            disabled: false,
            inputRenderer: (idx, _option, value, onChange) => {
                return (
                    <FormControl fullWidth={true}>
                        <FormLabel>{'Description'}</FormLabel>
                        <Box border={1} sx={{
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                            '&:hover': { borderColor: 'text.primary' },
                        }
                        }>
                            <MDXEditor
                                key={idx}
                                markdown={value ?? ""}
                                plugins={[headingsPlugin(), listsPlugin()]}
                                onChange={onChange} />
                        </Box>
                    </FormControl>
                )
            }
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
                    entityRender={e => <Chip label={e.name}></Chip>}
                />
            }
        }

    ];


    function handleChange(updated: Program | null) {
        if (updated === null) {
            onClose();
        } else {
            onSubmit(updated);
        }
    }

    return (
        <InputFormDialog
            entity={program}
            open={opened}
            title={title}
            inputFields={programInputFields}
            onChange={handleChange} />
    );
}

