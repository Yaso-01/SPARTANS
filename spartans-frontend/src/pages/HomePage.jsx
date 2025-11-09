import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/Post/PostList';

const sportTypes = [
    { label: 'Tutti', value: '' },
    { label: 'Corsa', value: 'Corsa' },
    { label: 'Ciclismo', value: 'Ciclismo' },
    { label: 'Palestra', value: 'Palestra' },
    { label: 'Nuoto', value: 'Nuoto' },
    { label: 'Calcio', value: 'Calcio' },
    { label: 'Basket', value: 'Basket' },
];

const HomePage = () => {
    const [selectedSport, setSelectedSport] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newValue) => {
        setSelectedSport(newValue);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mb: 3 }}>
                <Container maxWidth="lg">
                    <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="bold" gutterBottom>
                        Benvenuto su SportMoments
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Condividi i tuoi traguardi sportivi con la community!
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => navigate('/create')}
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                        Crea Nuovo Post
                    </Button>
                </Container>
            </Box>

            {/* Filtri Sport */}
            <Container maxWidth="lg">
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={selectedSport}
                        onChange={handleTabChange}
                        variant={isMobile ? 'scrollable' : 'standard'}
                        scrollButtons={isMobile ? 'auto' : false}
                        aria-label="sport filters"
                    >
                        {sportTypes.map((sport) => (
                            <Tab key={sport.value} label={sport.label} value={sport.value} />
                        ))}
                    </Tabs>
                </Box>

                {/* Lista Post */}
                <PostList sportFilter={selectedSport} />
            </Container>
        </Box>
    );
};

export default HomePage;