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
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientList from './pages/patient/PatientList';
import RegisterPage from './pages/Register';
import ServiceConfiguration from './pages/ServiceConfiguration';
import SettingsPage from './pages/Settings';

// Hooks

// Types
import PatientLayout from './components/common/patient/PatientLayout';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientBilling from './pages/patient/PatientBilling';
import PatientMedicalRecords from './pages/patient/PatientMedicalRecords';
import PatientProfile from './pages/patient/PatientProfile';
import { UserRole } from './types';

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
                <Route
                    path="/"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.DOCTOR]} />
                    }
                >
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="appointments" element={<AppointmentsPage />} />
                        <Route path="appointments/:id" element={<AppointmentsPage />} />
                        <Route path="patients" element={<PatientList />} />
                        <Route path="availability" element={<AvailabilitySettings />} />
                        <Route path="services" element={<ServiceConfiguration />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* Protected Patient Routes */}
                <Route path="/patient" element={<ProtectedRoute allowedRoles={[UserRole.PATIENT]} />}>
                    {/* Patient Layout Routes */}
                    <Route element={<PatientLayout />}>
                        <Route index element={<Navigate to="/patient/dashboard" replace />} />
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="appointments" element={<PatientAppointments />} />
                        <Route path="medical-records" element={<PatientMedicalRecords />} />
                        <Route path="billing" element={<PatientBilling />} />
                        <Route path="profile" element={<PatientProfile />} />
                        <Route path="settings" element={<div>Settings - Coming Soon</div>} />
                    </Route>

                    {/* Standalone Patient Routes (without layout) */}
                    <Route path="book-appointment" element={<BookAppointment />} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Box>
    );
};

export default App;
