import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Container,
    Paper,
    Box,
    Avatar,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
    EmojiEvents,
    Favorite,
    ChatBubble,
    Article,
} from '@mui/icons-material';
import api from '../../services/api';

const UserProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0,
    });
    const [profileData, setProfileData] = useState({
        fullName: '',
        bio: '',
        profileImageUrl: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userResponse = await api.get('/users/me');
            const statsResponse = await api.get(`/users/${user.userId}/stats`);

            setProfileData({
                fullName: userResponse.data.fullName || '',
                bio: userResponse.data.bio || '',
                profileImageUrl: userResponse.data.profileImageUrl || '',
            });

            setStats(statsResponse.data);
            setError('');
        } catch (err) {
            setError('Errore nel caricamento del profilo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setError('');
            setSuccess('');
            await api.put('/users/profile', profileData);
            setSuccess('Profilo aggiornato con successo!');
            setEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Errore nell\'aggiornamento del profilo');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        fetchUserData();
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Profilo Utente */}
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant="h4" fontWeight="bold">
                        Il Mio Profilo
                    </Typography>
                    {!editing ? (
                        <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => setEditing(true)}
                        >
                            Modifica
                        </Button>
                    ) : (
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                sx={{ mr: 1 }}
                            >
                                Salva
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancel}
                            >
                                Annulla
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                        src={profileData.profileImageUrl}
                        alt={user?.username}
                        sx={{ width: 100, height: 100, mr: 3 }}
                    >
                        {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flexGrow={1}>
                        {editing ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Nome Completo"
                                    name="fullName"
                                    value={profileData.fullName}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    multiline
                                    rows={2}
                                    value={profileData.bio}
                                    onChange={handleChange}
                                    placeholder="Racconta qualcosa di te..."
                                />
                            </>
                        ) : (
                            <>
                                <Typography variant="h5" fontWeight="bold">
                                    {profileData.fullName || user?.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    @{user?.username}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                    {profileData.bio || 'Nessuna bio impostata'}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>

                {editing && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <TextField
                            fullWidth
                            label="URL Immagine Profilo"
                            name="profileImageUrl"
                            value={profileData.profileImageUrl}
                            onChange={handleChange}
                            placeholder="https://esempio.com/avatar.jpg"
                        />
                    </>
                )}
            </Paper>

            {/* Statistiche */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Le Tue Statistiche
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {stats.totalPosts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Post Pubblicati
                                    </Typography>
                                </Box>
                                <Article sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="error">
                                        {stats.totalLikes}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Like Ricevuti
                                    </Typography>
                                </Box>
                                <Favorite sx={{ fontSize: 48, color: 'error.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {stats.totalComments}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Commenti Scritti
                                    </Typography>
                                </Box>
                                <ChatBubble sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Badge e Traguardi */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <EmojiEvents sx={{ fontSize: 32, color: 'warning.main', mr: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                        I Tuoi Traguardi
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {stats.totalPosts >= 1 && (
                        <Grid item xs={6} sm={4}>
                            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        ?? Primo Post
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        Hai pubblicato il tuo primo momento!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {stats.totalPosts >= 10 && (
                        <Grid item xs={6} sm={4}>
                            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        ?? Attivo
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        10 post pubblicati!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {stats.totalLikes >= 50 && (
                        <Grid item xs={6} sm={4}>
                            <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        ?? Popolare
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        50+ like ricevuti!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {stats.totalComments >= 20 && (
                        <Grid item xs={6} sm={4}>
                            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        ?? Comunicativo
                                    </Typography>
                                    <Typography variant="caption" align="center" display="block">
                                        20+ commenti scritti!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {stats.totalPosts === 0 && stats.totalLikes === 0 && stats.totalComments === 0 && (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                Inizia a pubblicare per sbloccare i tuoi primi traguardi! ??
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserProfile;