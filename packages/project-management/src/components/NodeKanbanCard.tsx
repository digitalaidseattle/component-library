/**
 * NodeKanban
 *
 *
 */
import { Avatar, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from "react";

import { MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from "../services";
import { Node, NodeKanbanProps, Profile } from "../types";

export function NodeKanbanCard({ node, onFocusChange }: NodeKanbanProps) {

    const [assignee, setAssignee] = React.useState<Profile | null>(null);

    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { data: profiles } = useProfiles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (node && profiles) {
            setAssignee(profiles.find(prof => prof.id === node.assignee_id)!)
        }
    }, [node, profiles]);

    function openNode(node: Node) {
        navigate(`/programs/${node.program_id}/nodes/${node.node_no}`);
    }

    return (node &&
        <Card>
            <CardHeader
                sx={{ padding: 1 }}
                title={node.node_no}
                action={
                    <>
                        <IconButton
                            id={buttonId}
                            size='small'
                            aria-controls={open ? menuId : undefined}
                            aria-haspopup="true"
                            aria-expanded={open}
                            onClick={handleClick}
                        >
                            <MoreOutlined />
                        </IconButton>
                        <Menu
                            id={`menuId`}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                list: {
                                    'aria-labelledby': buttonId,
                                },
                            }}
                        >
                            <MenuItem onClick={() => onFocusChange(node)}>Set in focus</MenuItem>
                            <MenuItem onClick={() => openNode(node)}>Open</MenuItem>
                        </Menu>
                    </>
                }>
            </CardHeader>
            <CardActionArea onDoubleClick={() => openNode(node)}>
                <CardContent sx={{ padding: 1 }}>
                    <Typography fontWeight={600}>{node.name}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Chip color="primary"
                        size='small'
                        label={node.type}
                        variant="outlined" />
                    {assignee && <Tooltip title={assignee.name}>
                        <Avatar src={assignee.pic} sx={{ width: 24, height: 24 }} />
                    </Tooltip>}
                </CardActions>
            </CardActionArea>
        </Card>
    )
}
