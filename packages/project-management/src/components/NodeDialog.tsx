/**
 * NodeDialog
 *
 */

import { InputFormDialog, InputOption } from '@digitalaidseattle/mui';
import React, { useEffect, useState } from 'react';
import { Node } from '../types';
import { ProgramContext } from './ProgramContext';

type NodeDialogProps = {
    title: string;
    node: Node;
    open: boolean;
    onChange: (updated: Node | null) => void
};

export default function NodeDialog({
    title,
    node,
    open,
    onChange
}: NodeDialogProps) {

    const { program } = React.useContext(ProgramContext);
    const [inputFields, setInputFields] = useState<InputOption[]>([]);
    useEffect(() => {
        setInputFields([
            {
                name: "name",
                label: 'Name',
                disabled: false
            },
            {
                name: "description",
                label: 'Description',
                size: 4,
                disabled: false,
            },
            {
                name: "status",
                label: 'Status',
                type: 'select',
                disabled: false,
                options: program.node_statuses
                    .map(status => ({ label: status, value: status }))
            },
            {
                name: "assignee_id",
                label: 'Assigned To',
                type: 'select',
                disabled: false,
                options: program.members
                    .map(member => ({ label: member.name, value: member.id as string}))
            }

        ])

    }, [program])

    function handleChange(updated: Node | null) {
        onChange(updated)
    }

    return (
        <InputFormDialog
            entity={node}
            open={open}
            title={title}
            inputFields={inputFields}
            onChange={handleChange} />
    );

}
