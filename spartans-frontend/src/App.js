import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

// Componente per proteggere le rotte
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Caricamento...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

// Componente per reindirizzare utenti loggati
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Caricamento...</div>;
    }

    return !user ? children : <Navigate to="/" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Rotte Pubbliche */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <RegisterPage />
                                </PublicRoute>
                            }
                        />

                        {/* Rotte Private */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <HomePage />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <CreatePostPage />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <ProfilePage />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />

                        {/* Reindirizzamento per rotte non trovate */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;