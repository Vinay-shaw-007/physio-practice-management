// import {
//     AccountCircle,
//     CalendarToday,
//     ChevronLeft,
//     Dashboard,
//     Description,
//     EventAvailable,
//     LocalHospital,
//     Logout,
//     MedicalServices,
//     Menu as MenuIcon,
//     People,
//     Receipt,
//     Settings
// } from '@mui/icons-material';
// import {
//     AppBar,
//     Avatar,
//     Box,
//     Divider,
//     Drawer,
//     IconButton,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText,
//     Menu,
//     MenuItem,
//     Toolbar,
//     Typography,
//     useMediaQuery,
//     useTheme,
// } from '@mui/material';
// import React, { useState } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../hooks/useAuth';
// import { useAppSelector } from '../../../store/store';
// import { UserRole } from '../../../types';

// const drawerWidth = 280;

// // Configuration for Menu Items
// const DOCTOR_MENU = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
//     { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
//     { text: 'Patients', icon: <People />, path: '/patients' },
//     { text: 'Availability', icon: <EventAvailable />, path: '/availability' },
//     { text: 'Services', icon: <MedicalServices />, path: '/services' },
//     { text: 'Settings', icon: <Settings />, path: '/settings' },
// ];

// const PATIENT_MENU = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/patient/dashboard' },
//     { text: 'My Appointments', icon: <CalendarToday />, path: '/patient/appointments' },
//     { text: 'Medical Records', icon: <Description />, path: '/patient/medical-records' },
//     { text: 'Billing & Invoices', icon: <Receipt />, path: '/patient/billing' },
//     { text: 'Settings', icon: <Settings />, path: '/patient/settings' },
// ];

// const Layout: React.FC = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const { user } = useAppSelector((state) => state.auth);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { logout } = useAuth();

//     // DETERMINE ROLE & CONFIGURATION
//     const isPatient = user?.role === UserRole.PATIENT;
//     const menuItems = isPatient ? PATIENT_MENU : DOCTOR_MENU;
//     const appTitle = isPatient ? 'Patient Portal' : 'PhysioPro Dashboard';
//     const profilePath = isPatient ? '/patient/settings' : '/settings'; // Doctor profile is inside Settings now

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleLogout = () => {
//         logout();
//         handleMenuClose();
//     };

//     const handleNavigate = (path: string) => {
//         navigate(path);
//         if (isMobile) {
//             setMobileOpen(false);
//         }
//     };

//     const drawer = (
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             {/* Sidebar Header */}
//             <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2, gap: 2 }}>
//                 <LocalHospital sx={{ fontSize: 32, color: 'primary.main' }} />
//                 <Typography variant="h6" fontWeight="bold" color="primary.main" noWrap>
//                     PhysioPro
//                 </Typography>
//                 {isMobile && (
//                     <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
//                         <ChevronLeft />
//                     </IconButton>
//                 )}
//             </Toolbar>

//             <Divider />

//             {/* Navigation Items */}
//             <List sx={{ flex: 1, py: 2 }}>
//                 {menuItems.map((item) => {
//                     const isActive = location.pathname === item.path;
//                     return (
//                         <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
//                             <ListItemButton
//                                 onClick={() => handleNavigate(item.path)}
//                                 selected={isActive}
//                                 sx={{
//                                     borderRadius: 2,
//                                     '&.Mui-selected': {
//                                         backgroundColor: 'primary.main',
//                                         color: 'white',
//                                         '&:hover': { backgroundColor: 'primary.dark' },
//                                         '& .MuiListItemIcon-root': { color: 'white' }
//                                     },
//                                     '&:hover': {
//                                         backgroundColor: 'action.hover',
//                                     },
//                                 }}
//                             >
//                                 <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main', minWidth: 40 }}>
//                                     {item.icon}
//                                 </ListItemIcon>
//                                 <ListItemText
//                                     primary={item.text}
//                                     primaryTypographyProps={{
//                                         fontWeight: isActive ? 700 : 500,
//                                         fontSize: '0.95rem'
//                                     }}
//                                 />
//                             </ListItemButton>
//                         </ListItem>
//                     );
//                 })}
//             </List>

//             <Divider />

//             {/* User Profile at Bottom of Sidebar */}
//             <Box sx={{ p: 2 }}>
//                 <ListItemButton
//                     onClick={handleMenuOpen}
//                     sx={{ borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
//                 >
//                     <ListItemIcon sx={{ minWidth: 40 }}>
//                         <Avatar
//                             sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
//                             alt={user?.name}
//                         >
//                             {user?.name?.charAt(0)}
//                         </Avatar>
//                     </ListItemIcon>
//                     <ListItemText
//                         primary={user?.name}
//                         secondary={isPatient ? "Patient" : "Doctor"}
//                         primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
//                         secondaryTypographyProps={{ fontSize: '0.75rem' }}
//                     />
//                 </ListItemButton>
//             </Box>
//         </Box>
//     );

//     return (
//         <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//             {/* Top App Bar */}
//             <AppBar
//                 position="fixed"
//                 sx={{
//                     width: { md: `calc(100% - ${drawerWidth}px)` },
//                     ml: { md: `${drawerWidth}px` },
//                     backgroundColor: 'background.paper',
//                     color: 'text.primary',
//                     boxShadow: 1,
//                 }}
//             >
//                 <Toolbar>
//                     <IconButton
//                         color="inherit"
//                         aria-label="open drawer"
//                         edge="start"
//                         onClick={handleDrawerToggle}
//                         sx={{ mr: 2, display: { md: 'none' } }}
//                     >
//                         <MenuIcon />
//                     </IconButton>
//                     <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
//                         {appTitle}
//                     </Typography>
//                 </Toolbar>
//             </AppBar>

//             {/* Sidebar Drawer */}
//             <Box
//                 component="nav"
//                 sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
//             >
//                 <Drawer
//                     variant={isMobile ? "temporary" : "permanent"}
//                     open={isMobile ? mobileOpen : true}
//                     onClose={handleDrawerToggle}
//                     ModalProps={{ keepMounted: true }}
//                     sx={{
//                         '& .MuiDrawer-paper': {
//                             boxSizing: 'border-box',
//                             width: drawerWidth,
//                             borderRight: '1px solid',
//                             borderColor: 'divider'
//                         },
//                     }}
//                 >
//                     {drawer}
//                 </Drawer>
//             </Box>

//             {/* Main Content */}
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     width: { md: `calc(100% - ${drawerWidth}px)` },
//                     minHeight: '100vh',
//                     backgroundColor: 'grey.50',
//                 }}
//             >
//                 <Toolbar /> {/* Spacer for fixed AppBar */}
//                 <Outlet />
//             </Box>

//             {/* User Dropdown Menu */}
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                 slotProps={{
//                     paper: {
//                         elevation: 3,
//                         sx: { minWidth: 180, mt: 1 }
//                     }
//                 }}
//             >
//                 <MenuItem onClick={() => { handleNavigate(profilePath); handleMenuClose(); }}>
//                     <ListItemIcon>
//                         <AccountCircle fontSize="small" />
//                     </ListItemIcon>
//                     My Profile
//                 </MenuItem>
//                 <Divider />
//                 <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
//                     <ListItemIcon>
//                         <Logout fontSize="small" color="error" />
//                     </ListItemIcon>
//                     Logout
//                 </MenuItem>
//             </Menu>
//         </Box>
//     );
// };

// export default Layout;

import {
    AccountCircle,
    CalendarToday,
    ChevronLeft,
    Dashboard,
    Description,
    EventAvailable,
    LocalHospital,
    Logout,
    MedicalServices,
    Menu as MenuIcon,
    People,
    Receipt,
    Settings
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAppSelector } from '../../../store/store';
import { UserRole } from '../../../types';

const DRAWER_WIDTH = 280;

const DOCTOR_MENU = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
    { text: 'Patients', icon: <People />, path: '/patients' },
    { text: 'Availability', icon: <EventAvailable />, path: '/availability' },
    { text: 'Services', icon: <MedicalServices />, path: '/services' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const PATIENT_MENU = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/patient/dashboard' },
    { text: 'My Appointments', icon: <CalendarToday />, path: '/patient/appointments' },
    { text: 'Medical Records', icon: <Description />, path: '/patient/medical-records' },
    { text: 'Billing & Invoices', icon: <Receipt />, path: '/patient/billing' },
    { text: 'My Profile', icon: <AccountCircle />, path: '/patient/profile' },
];

const Layout: React.FC = () => {
    const theme = useTheme();
    // FIX: Changed from 'md' to 'lg' (1200px)
    // This ensures Tablets (iPad Air/Pro) get the Hamburger Menu
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isPatient = user?.role === UserRole.PATIENT;
    const menuItems = isPatient ? PATIENT_MENU : DOCTOR_MENU;
    const appTitle = isPatient ? 'Patient Portal' : 'PhysioPro Dashboard';
    const profilePath = isPatient ? '/patient/profile' : '/settings';

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
        if (isMobile) setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2, gap: 2 }}>
                <LocalHospital sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold" color="primary.main" noWrap>
                    PhysioPro
                </Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
                        <ChevronLeft />
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
            <List sx={{ flex: 1, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { backgroundColor: 'primary.dark' },
                                        '& .MuiListItemIcon-root': { color: 'white' }
                                    },
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={handleMenuOpen}
                    sx={{ borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                            sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                            alt={user?.name}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={user?.name}
                        secondary={isPatient ? "Patient" : "Doctor"}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    // FIX: Switch logic from md to lg
                    width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { lg: `${DRAWER_WIDTH}px` },
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        // FIX: Show menu button on all screens smaller than laptop (lg)
                        sx={{ mr: 2, display: { lg: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        {appTitle}
                    </Typography>

                    <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
            >
                {/* Temporary Drawer for Mobile & Tablet */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        // FIX: Display up to lg breakpoint
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            backgroundImage: 'none'
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Permanent Drawer for Laptop/Desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        // FIX: Only display on lg and up
                        display: { xs: 'none', lg: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            backgroundImage: 'none'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    // FIX: Adjust width calculation for lg breakpoint
                    width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
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
                PaperProps={{
                    elevation: 2,
                    sx: { minWidth: 180, mt: 1.5, borderRadius: 2 }
                }}
            >
                <MenuItem onClick={() => { handleNavigate(profilePath); handleMenuClose(); }}>
                    <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                    My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Layout;