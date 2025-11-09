import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/postService';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    Grid,
    Alert,
} from '@mui/material';
import { Send } from '@mui/icons-material';

const sportTypes = [
    'Corsa',
    'Ciclismo',
    'Palestra',
    'Nuoto',
    'Calcio',
    'Basket',
    'Tennis',
    'Yoga',
    'Boxe',
    'Altro',
];

const PostForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        description: '',
        sportType: '',
        activityDate: new Date().toISOString().slice(0, 16),
        distance: '',
        duration: '',
        calories: '',
        imageUrl: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const postData = {
                ...formData,
                distance: formData.distance ? parseFloat(formData.distance) : null,
                duration: formData.duration ? parseInt(formData.duration) : null,
                calories: formData.calories ? parseInt(formData.calories) : null,
            };

            await postService.createPost(postData);
            navigate('/');
        } catch (err) {
            setError('Errore nella creazione del post. Riprova.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Condividi il tuo Momento Sportivo
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Descrizione"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        placeholder="Racconta il tuo traguardo o momento sportivo..."
                    />

                    <TextField
                        fullWidth
                        select
                        label="Tipo di Sport"
                        name="sportType"
                        value={formData.sportType}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    >
                        {sportTypes.map((sport) => (
                            <MenuItem key={sport} value={sport}>
                                {sport}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Data e Ora Attività"
                        name="activityDate"
                        type="datetime-local"
                        value={formData.activityDate}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Distanza (km)"
                                name="distance"
                                type="number"
                                value={formData.distance}
                                onChange={handleChange}
                                inputProps={{ step: '0.1', min: '0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Durata (min)"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleChange}
                                inputProps={{ min: '0' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Calorie (kcal)"
                                name="calories"
                                type="number"
                                value={formData.calories}
                                onChange={handleChange}
                                inputProps={{ min: '0' }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="URL Immagine (opzionale)"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                        placeholder="https://esempio.com/immagine.jpg"
                    />

                    <Box display="flex" gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<Send />}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Pubblicazione...' : 'Pubblica'}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Annulla
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default PostForm;