import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    MenuItem,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    SportsSoccer,
    Menu as MenuIcon,
    AccountCircle,
    Home,
    Add,
} from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/login');
    };

    const handleProfile = () => {
        handleCloseUserMenu();
        navigate('/profile');
    };

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo Desktop */}
                    <SportsSoccer sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SportMoments
                    </Typography>

                    {/* Menu Mobile */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/'); }}>
                                <Home sx={{ mr: 1 }} />
                                <Typography textAlign="center">Home</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/create'); }}>
                                <Add sx={{ mr: 1 }} />
                                <Typography textAlign="center">Nuovo Post</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Logo Mobile */}
                    <SportsSoccer sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SportMoments
                    </Typography>

                    {/* Menu Desktop */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 3 }}>
                        <Button
                            onClick={() => navigate('/')}
                            startIcon={<Home />}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Home
                        </Button>
                        <Button
                            onClick={() => navigate('/create')}
                            startIcon={<Add />}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Nuovo Post
                        </Button>
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            {user?.profileImageUrl ? (
                                <Avatar alt={user.username} src={user.profileImageUrl} />
                            ) : (
                                <Avatar>
                                    <AccountCircle />
                                </Avatar>
                            )}
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem disabled>
                                <Typography textAlign="center" fontWeight="bold">
                                    {user?.username}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleProfile}>
                                <Typography textAlign="center">Il mio Profilo</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;