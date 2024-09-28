import React, {useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useSupabaseRealtimeTable from "@/utils/supabase/hooks/useSupabaseRealtimeTable";
import {addComment, COMMENTS_TABLE_NAME, commentsSlice} from "@/utils/redux/slices/slices";
import {Box, List, TextField, Button, Typography, Stack} from '@mui/material';
import CommentItem from './CommentItem';

export function TicketComments({ticket}) {

    const filters = useMemo(() => ([
            {key: 'ticket_id', value: ticket.id},
        ]
    ), [ticket]);

    useSupabaseRealtimeTable(COMMENTS_TABLE_NAME, commentsSlice.actions, filters);
    const comments = useSelector(state => state.comments.data);
    const loggedUser = useSelector(state => state.loggedUser);
    const dispatch = useDispatch();

    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        dispatch(addComment({
            user_id: loggedUser.id,
            ticket_id: ticket.id,
            content: newComment,
            created_at: new Date()
        }));
        setNewComment('');
    };

    const buildCommentTree = (comments) => {
        const commentMap = {};
        const roots = [];

        comments.forEach(comment => {
            commentMap[comment.id] = {...comment, replies: []};
        });

        comments.forEach(comment => {
            if (comment.parent_comment_id) {
                const parent = commentMap[comment.parent_comment_id];
                if (parent) {
                    parent.replies.push(commentMap[comment.id]);
                }
            } else {
                roots.push(commentMap[comment.id]);
            }
        });

        return roots;
    };

    const commentTree = buildCommentTree(comments);

    return (
        <Box > {/* sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: { xs: 1, sm: 2 } }} */}
            <Typography variant="h5" gutterBottom>Komentáře</Typography>

            <Stack>
                {commentTree.map(comment => (
                    <CommentItem key={comment.id} comment={comment}/>
                ))}
            </Stack>

            <Box pt={2}>
                <TextField
                    fullWidth
                    label="Přidat komentář"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    multiline
                    rows={2}
                    variant="outlined"
                />
                <Button variant="contained" sx={{mt: 1}} onClick={handleAddComment}>
                    Odeslat
                </Button>
            </Box>
        </Box>
    );
}
