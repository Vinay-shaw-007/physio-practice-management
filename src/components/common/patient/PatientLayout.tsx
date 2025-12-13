import {
    AccountCircle,
    CalendarMonth,
    ChevronLeft,
    Dashboard,
    Description,
    LocalHospital,
    Logout,
    Menu as MenuIcon,
    Receipt
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAppSelector } from '../../../store/store';

const drawerWidth = 280;

// const menuItems = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/dashboards' },
//     { text: 'Appointments', icon: <CalendarMonth />, path: '/patient/appointments' },
//     { text: 'Medical Records', icon: <MedicalServices />, path: '/patient/medical-records' },
//     { text: 'Billing & Invoices', icon: <Receipt />, path: '/patient/billing' },
//     { text: 'Book Appointment', icon: <LocalHospital />, path: '/book-appointment' },
//     { text: 'Profile', icon: <Person />, path: '/profile' },
//     { text: 'Settings', icon: <Settings />, path: '/patient/settings' },
// ];

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/patient/dashboard' },
    { text: 'My Appointments', icon: <CalendarMonth />, path: '/patient/appointments' },
    { text: 'Medical Records', icon: <Description />, path: '/patient/medical-records' },
    { text: 'Billing & Invoices', icon: <Receipt />, path: '/patient/billing' },
    { text: 'My Profile', icon: <AccountCircle />, path: '/patient/profile' },
];
const PatientLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalHospital sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h6" noWrap>
                        PhysioPro
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
            <List sx={{ flex: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                        <ListItemButton
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                slotProps={{
                                    primary: {
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleMenuOpen}>
                        <ListItemIcon>
                            <Avatar
                                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                alt={user?.name}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={user?.name}
                            secondary="Patient"
                            slotProps={{
                                primary: {
                                    fontWeight: 600,
                                },
                                secondary: {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Patient Portal
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: 'grey.50',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleNavigate('/profile')}>
                    <ListItemIcon>
                        <Avatar sx={{ width: 24, height: 24 }} />
                    </ListItemIcon>
                    My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default PatientLayout;