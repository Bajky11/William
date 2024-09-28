import React from 'react';
import {Box, TextField, Button, Stack} from '@mui/material';

const CommentReply = ({replyContent, setReplyContent, handleSaveReply, handleCancelReply}) => {
    return (
        <Stack pt={1}>
            <TextField
                fullWidth
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                multiline
                rows={2}
                variant="outlined"
                placeholder="Napište odpověď..."
            />
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                <Button size="small" onClick={handleCancelReply}>Zrušit</Button>
                <Button size="small" variant="contained" onClick={handleSaveReply}>Odeslat</Button>
            </Box>
        </Stack>
    );
};

export default CommentReply;
