import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const CommentList = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await commentService.getCommentsByPostId(postId);
            setComments(data);
            setError('');
        } catch (err) {
            setError('Errore nel caricamento dei commenti');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleDelete = async (commentId) => {
        if (window.confirm('Vuoi eliminare questo commento?')) {
            try {
                await commentService.deleteComment(commentId);
                setComments(comments.filter((c) => c.id !== commentId));
            } catch (err) {
                console.error('Errore eliminazione commento:', err);
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (comments.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Nessun commento ancora. Sii il primo a commentare!
            </Typography>
        );
    }

    return (
        <Box>
            {comments.map((comment) => (
                <Box key={comment.id} display="flex" alignItems="start" sx={{ mb: 2 }}>
                    <Avatar
                        src={comment.user.profileImageUrl}
                        alt={comment.user.username}
                        sx={{ width: 32, height: 32, mr: 1 }}
                    >
                        {comment.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight="bold">
                                {comment.user.fullName || comment.user.username}
                            </Typography>
                            {user?.userId === comment.user.id && (
                                <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.primary">
                            {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(comment.createdAt), "d MMM 'alle' HH:mm", { locale: it })}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default CommentList;