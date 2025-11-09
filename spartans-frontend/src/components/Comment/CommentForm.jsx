import React, { useState } from 'react';
import { commentService } from '../../services/commentService';
import { Box, TextField, Button, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setError('');
        setLoading(true);

        try {
            await commentService.createComment(postId, content);
            setContent('');
            if (onCommentAdded) onCommentAdded();
        } catch (err) {
            setError('Errore nell\'aggiunta del commento');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}
            <Box display="flex" gap={1}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Scrivi un commento..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={loading || !content.trim()}
                    endIcon={<Send />}
                >
                    Invia
                </Button>
            </Box>
        </Box>
    );
};

export default CommentForm;