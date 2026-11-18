/**
 * ProgramDialog.tsx
 * 
 * @copyright Digital Aid Seattle 2026
 */
import React, { useEffect, useRef, useState } from "react";

import {
    Box,
    Chip,
    FormControl,
    FormLabel
} from "@mui/material";

import { InputFormDialog, InputOption } from "@digitalaidseattle/mui";
import { BoldItalicUnderlineToggles, headingsPlugin, listsPlugin, ListsToggle, MDXEditor, MDXEditorMethods, toolbarPlugin, UndoRedo } from "@mdxeditor/editor";
import { useProfiles } from "../services";
import { Profile, Program } from "../types";
import DelimitedListInput from "./DelmitedListInput";
import EntityListInput from "./EntityListInput";

interface Props {
    program: Program;
    title: string;
    open: boolean;
    onChange: (updated: Program | null) => void;
}

export const ProgramDialog: React.FC<Props> = ({
    program,
    title,
    open,
    onChange
}) => {
    const [activeProfiles, setActiveProfiles] = useState<Profile[]>([]);
    const { data: profiles } = useProfiles();

    const ref = useRef<MDXEditorMethods>(null);

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
                                ref={ref}
                                markdown={value ?? ""}
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
            name: "node_statuses",
            label: 'Statuses (soonest-to-lastest)',
            type: 'custom',
            disabled: false,
            inputRenderer: (idx, option, value, onChange) => {
                return <DelimitedListInput
                    label={option.label}
                    value={value}
                    placeholder={'ToDo, In Progress, Done'}
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
        onChange(updated);
    }

    return (
        <InputFormDialog
            entity={program}
            open={open}
            title={title}
            inputFields={programInputFields}
            onChange={handleChange} />
    );
}

