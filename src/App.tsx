import { Box } from '@mui/material';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Layout & Protected Route
import Layout from './components/common/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import AppointmentsPage from './pages/Appointments';
import AvailabilitySettings from './pages/AvailabilitySettings';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import LoginPage from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import PatientList from './pages/PatientList';
import RegisterPage from './pages/Register';
import ServiceConfiguration from './pages/ServiceConfiguration';
import SettingsPage from './pages/Settings';

// Hooks

// Types
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientProfile from './pages/PatientProfile';
import { UserRole } from './types';
import PatientLayout from './components/common/patient/PatientLayout';

const App: React.FC = () => {
    // Show loading screen while validating token
    // if (true) {
    //     return (
    //         <Box
    //             sx={{
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 minHeight: '100vh',
    //                 bgcolor: 'background.default',
    //             }}
    //         >
    //             <CircularProgress />
    //             <Box sx={{ ml: 2 }}>
    //                 <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
    //                     Initializing application...
    //                 </Box>
    //                 <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
    //                     Validating authentication
    //                 </Box>
    //             </Box>
    //         </Box>
    //     );
    // }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Doctor Routes */}
                <Route element={<ProtectedRoute allowedRoles={[UserRole.DOCTOR]} />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DoctorDashboard />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                        <Route path="/patients" element={<PatientList />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/availability" element={<AvailabilitySettings />} />
                        <Route path="/services" element={<ServiceConfiguration />} />
                    </Route>
                </Route>

                {/* Protected Patient Routes */}
                <Route element={<ProtectedRoute allowedRoles={[UserRole.PATIENT]} />}>
                    {/* Patient Layout Routes */}
                    <Route element={<PatientLayout />}>
                        <Route path="/dashboards" element={<PatientDashboard />} />
                        <Route path="/patient/appointments" element={<PatientAppointments />} />
                        <Route path="/patient/medical-records" element={<div>Medical Records - Coming Soon</div>} />
                        <Route path="/patient/billing" element={<div>Billing & Invoices - Coming Soon</div>} />
                        <Route path="/patient/settings" element={<div>Settings - Coming Soon</div>} />
                        <Route path="/profile" element={<PatientProfile />} />
                    </Route>

                    {/* Standalone Patient Routes (without layout) */}
                    <Route path="/book-appointment" element={<BookAppointment />} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Box>
    );
};

export default App;
