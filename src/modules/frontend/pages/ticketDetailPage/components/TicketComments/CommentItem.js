import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Box, Paper, Avatar, TextField, Typography, Stack, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplyIcon from '@mui/icons-material/Reply';
import {addComment, commentsSlice, removeComment, updateComment} from "@/utils/redux/slices/slices";
import CommentReply from './CommentReply';
import {timestampToDateString} from "@/modules/shared/generalFunctions/time/timestampToDateString";
import {timestampToTimeString} from "@/modules/shared/generalFunctions/time/timestampToTimeString";
import {ActionIcon} from "@/modules/shared/components/ActionIcon";

const CommentItem = ({comment, depth = 0}) => {
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.loggedUser);
    const isUserComment = comment.user_id === loggedUser.id;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    // OK
    const handleEditComment = () => setIsEditing(true);

    // OK
    const handleSaveEditComment = () => {
        dispatch(updateComment({id: comment.id, updatedData: {content: editContent}}));
        setIsEditing(false);
    };

    // OK
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
    };

    //OK
    const handleDeleteComment = () => dispatch(removeComment(comment.id));

    // OK
    const handleReplyComment = () => setIsReplying(true);


    const handleSaveReply = () => {
        dispatch(addComment({
            user_id: loggedUser.id,
            ticket_id: comment.ticket_id,
            parent_comment_id: comment.id,
            content: replyContent,
            created_at: new Date()
        }));

        setIsReplying(false);
        setReplyContent('');
    };

    const handleCancelReply = () => setIsReplying(false);

    return (<Box sx={{pl: depth * 4, pt: 1}}>
        <Paper
            sx={{
                backgroundColor: isUserComment ? '#f0f0f0' : 'background.paper',
                border: isUserComment ? '1px solid black' : 'background.paper',
                padding: 1,
            }}
        >
            <Stack direction="row" spacing={2}>
                <Avatar sx={{width: '32px', height: '32px'}}>{comment.user_name?.charAt(0) || 'U'}</Avatar>
                <Stack>
                    <Typography variant="subtitle1">{comment.user_name || 'Neznámý uživatel'}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {timestampToDateString(comment.created_at)} {timestampToTimeString(comment.created_at)}
                    </Typography>

                    {isEditing ? (<TextField
                        fullWidth
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{mt: 1}}
                    />) : (<Typography variant="body1" sx={{mt: 1}}>
                        {comment.content}
                    </Typography>)}

                    <Stack direction="row" spacing={1} sx={{mt: 1}}>
                        {isEditing ? (<>
                            <ActionIcon
                                onClick={handleSaveEditComment}
                                IconComponent={SaveIcon}
                                ariaLabel="save"
                            />
                            <ActionIcon
                                onClick={handleCancelEdit}
                                IconComponent={CancelIcon}
                                ariaLabel="cancel"
                            />
                        </>) : (<>
                            <ActionIcon
                                onClick={handleReplyComment}
                                IconComponent={ReplyIcon}
                                ariaLabel="reply"
                            />
                            {isUserComment && (<>
                                <ActionIcon
                                    onClick={handleEditComment}
                                    IconComponent={EditIcon}
                                    ariaLabel="edit"
                                />
                                <ActionIcon
                                    onClick={handleDeleteComment}
                                    IconComponent={DeleteIcon}
                                    ariaLabel="delete"
                                />
                            </>)}
                        </>)}
                    </Stack>

                    {isReplying && (<CommentReply
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        handleSaveReply={handleSaveReply}
                        handleCancelReply={handleCancelReply}
                    />)}
                </Stack>
            </Stack>
        </Paper>

        {comment.replies && comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1}/>))}
    </Box>);
};

export default CommentItem;
