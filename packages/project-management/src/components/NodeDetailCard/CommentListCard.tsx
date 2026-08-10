/**
 * ProgamsListCard.tsx
 * 
 */

// material-ui
import React, { useContext, useEffect } from "react";

import {
    Avatar,
    Grid,
    Stack,
    Typography
} from '@mui/material';

import dayjs from "dayjs";
import { useProfiles } from "../../services";
import { History, Profile } from "../../types";
import { NodeContext } from "../NodeContext";

//

type Row = History & {
    profile: Profile | undefined
}
export const HistoryListCard: React.FC = () => {

    const { node } = useContext(NodeContext);
    const { data: profiles, loading: profilesLoading } = useProfiles();
    const [rows, setRows] = React.useState<Row[]>([]);

    useEffect(() => {
        console.log('profiles', node, profiles, profilesLoading)

        if (node) {
            setRows(node.history.reverse() as Row[]);
            if (profiles) {
                const newRows = [];
                for (let child of (node.history ?? [])) {
                    const profile = profiles?.find(p => p.email === child.user);
                    const row = {
                        ...child,
                        profile: profile
                    } as unknown as Row;
                    newRows.push(row);
                }
                setRows(newRows.reverse());
            }
        }

    }, [node, profiles, profilesLoading])

    function getProfile(user: string): Profile | undefined {
        if (profilesLoading) {
            return undefined;
        }
        return (profiles ?? []).find(p => p.email === user);
    }

    return (
        <Grid container spacing={1} >
            {rows.map(row =>
                <React.Fragment key={row.date}>
                    <Grid size={2}>{dayjs(row.date).format("M/DD/YYYY hh:mm a")}</Grid>
                    <Grid size={2}>
                        {row.profile &&
                            <Stack direction={'row'} gap={1}>
                                <Avatar src={row.profile.pic} sx={{ width: 24, height: 24 }} />
                                <Typography>{row.profile.name}</Typography>
                            </Stack>
                        }
                    </Grid>
                    <Grid size={8}>{row.description}</Grid>
                </React.Fragment>)}
        </Grid >
    );
}
