import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Box,
    Collapse,
    Chip,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    ChatBubbleOutline,
    Delete,
    DirectionsRun,
    DirectionsBike,
    FitnessCenter,
    Pool,
    SportsSoccer,
    SportsBasketball,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import CommentList from '../Comment/CommentList';
import CommentForm from '../Comment/CommentForm';

const PostCard = ({ post, onDelete, onUpdate }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
    const [likesCount, setLikesCount] = useState(post.likesCount);

    const handleLike = async () => {
        try {
            await postService.toggleLike(post.id);
            setIsLiked(!isLiked);
            setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        } catch (error) {
            console.error('Errore nel like:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Sei sicuro di voler eliminare questo post?')) {
            try {
                await postService.deletePost(post.id);
                onDelete(post.id);
            } catch (error) {
                console.error('Errore eliminazione post:', error);
            }
        }
    };

    const getSportIcon = (sportType) => {
        const icons = {
            corsa: <DirectionsRun />,
            ciclismo: <DirectionsBike />,
            palestra: <FitnessCenter />,
            nuoto: <Pool />,
            calcio: <SportsSoccer />,
            basket: <SportsBasketball />,
        };
        return icons[sportType.toLowerCase()] || <DirectionsRun />;
    };

    return (
        <Card sx={{ mb: 2, boxShadow: 2 }}>
            <CardHeader
                avatar={
                    <Avatar src={post.user.profileImageUrl} alt={post.user.username}>
                        {post.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                }
                action={
                    user?.userId === post.user.id && (
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <Delete />
                        </IconButton>
                    )
                }
                title={post.user.fullName || post.user.username}
                subheader={format(new Date(post.createdAt), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
            />

            <CardContent>
                <Box sx={{ mb: 2 }}>
                    <Chip
                        icon={getSportIcon(post.sportType)}
                        label={post.sportType}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                    />
                    {post.distance && (
                        <Chip label={`${post.distance} km`} size="small" sx={{ mr: 1 }} />
                    )}
                    {post.duration && (
                        <Chip label={`${post.duration} min`} size="small" sx={{ mr: 1 }} />
                    )}
                    {post.calories && (
                        <Chip label={`${post.calories} kcal`} size="small" />
                    )}
                </Box>

                <Typography variant="body1" color="text.primary" paragraph>
                    {post.description}
                </Typography>

                {post.imageUrl && (
                    <Box
                        component="img"
                        src={post.imageUrl}
                        alt="Post"
                        sx={{
                            width: '100%',
                            maxHeight: 400,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mt: 2,
                        }}
                    />
                )}

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Attività del {format(new Date(post.activityDate), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton aria-label="like" onClick={handleLike}>
                    {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2 }}>
                    {likesCount}
                </Typography>

                <IconButton aria-label="comment" onClick={() => setShowComments(!showComments)}>
                    <ChatBubbleOutline />
                </IconButton>
                <Typography variant="body2">{post.commentsCount}</Typography>
            </CardActions>

            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <CardContent>
                    <CommentForm postId={post.id} onCommentAdded={onUpdate} />
                    <CommentList postId={post.id} />
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default PostCard;