import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import { Container, Typography, CircularProgress, Box, Alert } from '@mui/material';
import PostCard from './PostCard';

const PostList = ({ sportFilter }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = sportFilter
                ? await postService.getPostsBySportType(sportFilter)
                : await postService.getAllPosts();
            setPosts(data);
            setError('');
        } catch (err) {
            setError('Errore nel caricamento dei post');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [sportFilter]);

    const handleDelete = (postId) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (posts.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Alert severity="info">
                    Nessun post da visualizzare. Sii il primo a condividere un momento sportivo!
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDelete}
                    onUpdate={fetchPosts}
                />
            ))}
        </Container>
    );
};

export default PostList;