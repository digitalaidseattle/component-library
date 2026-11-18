/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { Configuration, Node, NodeListTable, ProgramContext } from "@digitalaidseattle/program-management";
import {
    Card,
    CardHeader
} from '@mui/material';

//
export const TaskList: React.FC = () => {
    const nodeService = Configuration.getInstance().getNodeService();

    const { program } = React.useContext(ProgramContext);
    const [nodes, setNodes] = useState<Node[]>([]);

    React.useEffect(() => {
        if (program) {
            nodeService.findByProgramId(program.id)
                .then(all => {
                    setNodes(all
                        .filter(node => node.type === 'Task')
                        .sort((t1, t2) => t1.node_no.localeCompare(t2.node_no)));
                })
        }
    }, [program]);


    return (program &&
        <>
            <Card>
                <CardHeader title={`Venture: ${program?.name}`} />
                <NodeListTable nodes={nodes} />
            </Card >
        </>
    );
}
