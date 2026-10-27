/**
 * NodeKanban
 *
 *
 */
import { Avatar, Card, CardActions, CardContent, CardHeader, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from "react";

import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RefreshContext, useNotifications } from '@digitalaidseattle/core';
import { Node, NodeKanbanProps, NodeService, Profile, ProgramContext } from '@digitalaidseattle/program-management';

export function KanbanCard({ node, onFocusChange }: NodeKanbanProps) {

    const [assignee, setAssignee] = React.useState<Profile | null>(null);

    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;

    const memberButtonId = `${id}-member-button`;
    const memberMenuId = `${id}-member-menu`;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [memberAnchorEl, setMemberAnchorEl] = React.useState<null | HTMLElement>(null);
    const memberOpen = Boolean(memberAnchorEl);
    const navigate = useNavigate();
    const { program } = React.useContext(ProgramContext);
    const { setRefresh } = React.useContext(RefreshContext);
    const notifications = useNotifications();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (node && program) {
            setAssignee(program.members.find(mem => mem.id === node.assignee_id) ?? null);
        }
    }, [node, program]);

    function changeAssignee(member: Profile | null) {
        setMemberAnchorEl(null);
        if (node && (member?.id ?? null) !== (node.assignee_id ?? null)) {
            NodeService.getInstance()
                .changeAttribute(node, "assignee_id", (member?.id as string | undefined) ?? null)
                .then(() => {
                    setAssignee(member);
                    setRefresh(Date.now());
                })
                .catch(err => notifications.error(`Assign failed: ${err.message}`));
        }
    }

    function openNode(node: Node) {
        navigate(`./nodes/${node.node_no}`);
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
            <CardContent >
                <Typography >{node.name}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                {(node.tags ?? []).map((tag, idx) => (
                    <Chip key={idx}
                        color="primary"
                        size='small'
                        variant='outlined'
                        label={tag} />
                ))}
                <Tooltip title={assignee ? assignee.name : "Unassigned"}>
                    <IconButton
                        id={memberButtonId}
                        aria-controls={memberOpen ? memberMenuId : undefined}
                        aria-haspopup="true"
                        aria-expanded={memberOpen}
                        onClick={(e) => setMemberAnchorEl(e.currentTarget)}>
                        {assignee
                            ? <Avatar src={assignee.pic} sx={{ width: 24, height: 24 }} />
                            : <Typography><QuestionCircleOutlined /></Typography>
                        }
                    </IconButton>
                </Tooltip>
                <Menu
                    id={memberMenuId}
                    anchorEl={memberAnchorEl}
                    open={memberOpen}
                    onClose={() => setMemberAnchorEl(null)}
                    slotProps={{
                        list: {
                            'aria-labelledby': memberButtonId,
                        },
                    }}
                >
                    <MenuItem selected={!assignee} onClick={() => changeAssignee(null)}>
                        <ListItemIcon><QuestionCircleOutlined /></ListItemIcon>
                        <ListItemText>Unassigned</ListItemText>
                    </MenuItem>
                    {(program?.members ?? []).map(member => (
                        <MenuItem key={member.id}
                            selected={assignee?.id === member.id}
                            onClick={() => changeAssignee(member)}>
                            <ListItemIcon><Avatar src={member.pic} sx={{ width: 24, height: 24 }} /></ListItemIcon>
                            <ListItemText>{member.name}</ListItemText>
                        </MenuItem>
                    ))}
                </Menu>
            </CardActions>
        </Card>
    )
}
