/**
 * ProgramDetailCard.tsx
 * 
 */

// material-ui
import React, { useState } from "react";

import { Node, NodeListTable, NodeService, ProgramContext } from "@digitalaidseattle/program-management";
import {
    Card,
    CardHeader
} from '@mui/material';

//
export const TaskList: React.FC = () => {

    const { program } = React.useContext(ProgramContext);
    const [nodes, setNodes] = useState<Node[]>([]);

    React.useEffect(() => {
        if (program) {
            NodeService.getInstance().findByProgramId(program.id)
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
