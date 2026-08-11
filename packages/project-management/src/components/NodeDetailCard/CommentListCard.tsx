/**
 * CommentListCard.tsx
 * 
 */

// material-ui
import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Stack,
    Typography
} from '@mui/material';

import { RefreshContext, useAuthService } from "@digitalaidseattle/core";
import { BoldItalicUnderlineToggles, headingsPlugin, listsPlugin, ListsToggle, MDXEditor, MDXEditorMethods, toolbarPlugin, UndoRedo } from "@mdxeditor/editor";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import { useProfiles } from "../../services";
import { NodeService } from "../../services/NodeService";
import { Comment, Node, Profile } from "../../types";
import { NodeContext } from "../NodeContext";
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";

//


type CommentData = Comment & {
    profile: Profile | undefined
}

function CommentCard({ index, comment }: { index: number, comment: CommentData }): ReactNode {
    const nodeService = NodeService.getInstance();
    const auth = useAuthService();

    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [doEdit, setDoEdit] = useState<boolean>(false);
    const [newComment, setNewComment] = React.useState<string>("");

    const ref = useRef<MDXEditorMethods>(null);
    const { node, setNode } = useContext(NodeContext);
    const { setRefresh } = useContext(RefreshContext);

    useEffect(() => {
        if (index === -1) {
            setCanEdit(true);
        } else {
            auth.getUser().then(user => {
                setCanEdit(user?.email.toLowerCase() === comment.user.toLowerCase());
            })
        }
    }, [auth, comment]);

    async function handleEdit() {
        setNewComment(index === -1 ? "" : comment.content);
        setDoEdit(true);
    }

    async function handleSave() {
        nodeService.updateComment(node, index, newComment)
            .then((updated) => {
                setNode(updated);
                ref.current?.setMarkdown("");
                setNewComment("");
                setRefresh(0);
            })
    }

    async function handleCancel() {
        ref.current?.setMarkdown("");
        setNewComment(index === -1 ? "" : "");
        setRefresh(0);
        setDoEdit(false);
    }

    return (
        <Card>
            <CardContent sx={{ padding: 2 }}>
                {doEdit
                    ? <MDXEditor
                        ref={ref}
                        markdown={newComment}
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
                        onChange={md => setNewComment(md)} />
                    : <Markdown>{comment.content}</Markdown>
                }
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {canEdit
                    ? doEdit
                        ? (
                            <Stack direction={'row'}>
                                <IconButton size="small" color="error" onClick={handleCancel}>
                                    <CloseCircleOutlined />
                                </IconButton>
                                <IconButton size="small" color="success" onClick={handleSave}>
                                    <CheckCircleOutlined />
                                </IconButton>
                            </Stack>
                        )
                        : (
                            <IconButton size="small" color="primary" onClick={handleEdit}>
                                <EditOutlined />
                            </IconButton>
                        )
                    : <span>&nbsp;</span>
                }
                {index !== -1 &&
                    <Stack direction={'row'}>
                        {comment.profile &&
                            <Stack direction={'row'} gap={1}>
                                <Avatar src={comment.profile.pic} sx={{ width: 24, height: 24 }} />
                                <Typography>{comment.profile.name}</Typography>
                            </Stack>
                        }
                        <Typography sx={{ marginLeft: 1 }} fontStyle={'italic'}> {dayjs(comment.date).format("M/DD/YYYY hh:mm a")}</Typography>
                    </Stack>
                }
            </CardActions>
        </Card >
    )
}


export const CommentListCard: React.FC = () => {

    const { node } = useContext(NodeContext);
    const { data: profiles, loading: profilesLoading } = useProfiles();

    const [rows, setRows] = React.useState<CommentData[]>([]);

    useEffect(() => {
        if (node) {
            setRows(node.comments.reverse() as CommentData[]);
            if (profiles) {
                const newRows = node.comments
                    .map(comm => {
                        const profile = profiles.find(p => p.email.toLowerCase() === comm.user.toLowerCase());
                        const row = {
                            ...comm,
                            profile: profile
                        } as unknown as CommentData;
                        return row;
                    })
                    .sort((a,b) => a.date.localeCompare(b.date))
                setRows(newRows);
            }
        }
    }, [node, profiles]);

    return (
        <Stack sx={{ marginTop: 1, gap: 1 }}>
            <CommentCard index={-1} comment={{
                user: '',
                content: '*Click to start editing.*',
                date: new Date().toISOString(),
                profile: undefined
            }} />
            {rows.map((row, idx) => <CommentCard key={idx} index={idx} comment={row} />)}
        </Stack>
    );
}
