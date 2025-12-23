// 1st Iteration
// import {
//   ArrowBack as ArrowBackIcon,
//   CalendarMonth as CalendarIcon,
//   Cancel as CancelIcon,
//   CheckCircle as CheckCircleIcon,
//   Download as DownloadIcon,
//   History as HistoryIcon,
//   MedicalServices as MedicalIcon,
//   Refresh as RefreshIcon,
//   Schedule as ScheduleIcon,
//   Search as SearchIcon,
//   Today as TodayIcon,
// } from '@mui/icons-material';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Paper,
//   Tab,
//   Tabs,
//   TextField,
//   Typography
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { format } from 'date-fns';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { patientService } from '../../services/patientService';
// import { useAppSelector } from '../../store/store';
// import { Appointment, AppointmentStatus, ServiceType } from '../../types';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   value: number;
//   index: number;
// }

// const TabPanel = (props: TabPanelProps) => {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`appointments-tabpanel-${index}`}
//       aria-labelledby={`appointments-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// };

// const getServiceIcon = (type: ServiceType) => {
//   switch (type) {
//     case ServiceType.CLINIC_VISIT:
//       return <MedicalIcon fontSize="small" />;
//     case ServiceType.HOME_VISIT:
//       return <ScheduleIcon fontSize="small" />;
//     case ServiceType.VIDEO_CONSULT:
//       return <MedicalIcon fontSize="small" />;
//     default:
//       return <MedicalIcon fontSize="small" />;
//   }
// };

// const getStatusColor = (status: AppointmentStatus) => {
//   switch (status) {
//     case AppointmentStatus.CONFIRMED:
//       return 'success';
//     case AppointmentStatus.AWAITING:
//       return 'warning';
//     case AppointmentStatus.COMPLETED:
//       return 'info';
//     case AppointmentStatus.CANCELLED:
//       return 'error';
//     default:
//       return 'default';
//   }
// };

// const PatientAppointments: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
//   const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadAppointments();
//   }, []);

//   const loadAppointments = async () => {
//     try {
//       setLoading(true);
//       const [upcoming, past] = await Promise.all([
//         patientService.getUpcomingAppointments(user?.id || 'patient1'),
//         patientService.getPastAppointments(user?.id || 'patient1', 50)
//       ]);
//       setUpcomingAppointments(upcoming);
//       setPastAppointments(past);
//     } catch (error) {
//       console.error('Failed to load appointments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const handleCancelAppointment = async (appointmentId: string) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       // In a real app, you would call an API to cancel the appointment
//       console.log('Cancelling appointment:', appointmentId);
//       // Then reload appointments
//       await loadAppointments();
//     }
//   };

//   const handleReschedule = (appointmentId: string) => {
//     // Navigate to booking page with appointment details
//     navigate('/book-appointment', { state: { reschedule: appointmentId } });
//   };

//   const renderAppointments = (appointments: Appointment[]) => {
//     if (appointments.length === 0) {
//       return (
//         <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
//           <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
//           <Typography variant="h6" color="text.secondary">
//             No appointments found
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//             {tabValue === 0
//               ? "You don't have any upcoming appointments"
//               : "You don't have any past appointments"}
//           </Typography>
//           {tabValue === 0 && (
//             <Button
//               variant="contained"
//               onClick={() => navigate('/book-appointment')}
//             >
//               Book Your First Appointment
//             </Button>
//           )}
//         </Paper>
//       );
//     }

//     return (
//       <Grid container spacing={3}>
//         {appointments.map((appointment) => {
//           const appointmentDate = new Date(appointment.date);
//           const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

//           return (
//             <Grid size={{ xs: 12 }} key={appointment.id}>
//               <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
//                 <CardContent>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 12, md: 8 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//                         {getServiceIcon(appointment.metadata?.serviceType || ServiceType.CLINIC_VISIT)}
//                         <Typography variant="h6" fontWeight="medium">
//                           {appointment.metadata?.serviceName}
//                         </Typography>
//                         <Chip
//                           label={appointment.status}
//                           size="small"
//                           color={getStatusColor(appointment.status) as any}
//                         />
//                       </Box>

//                       <Grid container spacing={2}>
//                         <Grid size={{ xs: 6, md: 3 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//                             <Box>
//                               <Typography variant="caption" color="text.secondary">
//                                 Date
//                               </Typography>
//                               <Typography variant="body2" fontWeight="medium">
//                                 {isToday ? 'Today' : format(appointmentDate, 'EEE, MMM d, yyyy')}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Grid>
//                         <Grid size={{ xs: 6, md: 3 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//                             <Box>
//                               <Typography variant="caption" color="text.secondary">
//                                 Time
//                               </Typography>
//                               <Typography variant="body2" fontWeight="medium">
//                                 {appointment.startTime} - {appointment.endTime}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Grid>
//                         <Grid size={{ xs: 6, md: 3 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <MedicalIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//                             <Box>
//                               <Typography variant="caption" color="text.secondary">
//                                 Doctor
//                               </Typography>
//                               <Typography variant="body2" fontWeight="medium">
//                                 {appointment.metadata?.doctorName}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Grid>
//                         <Grid size={{ xs: 6, md: 3 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <CheckCircleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//                             <Box>
//                               <Typography variant="caption" color="text.secondary">
//                                 Amount
//                               </Typography>
//                               <Typography variant="body2" fontWeight="medium" color="primary.main">
//                                 ₹{appointment.amount}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </Grid>
//                       </Grid>

//                       {appointment.notes && (
//                         <Box sx={{ mt: 2 }}>
//                           <Typography variant="caption" color="text.secondary">
//                             Notes:
//                           </Typography>
//                           <Typography variant="body2" sx={{ mt: 0.5 }}>
//                             {appointment.notes}
//                           </Typography>
//                         </Box>
//                       )}
//                     </Grid>

//                     <Grid size={{ xs: 12, md: 4 }}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                         {tabValue === 0 && appointment.status === AppointmentStatus.CONFIRMED && (
//                           <>
//                             <Button
//                               fullWidth
//                               variant="outlined"
//                               color="error"
//                               startIcon={<CancelIcon />}
//                               onClick={() => handleCancelAppointment(appointment.id)}
//                             >
//                               Cancel
//                             </Button>
//                             <Button
//                               fullWidth
//                               variant="contained"
//                               startIcon={<ScheduleIcon />}
//                               onClick={() => handleReschedule(appointment.id)}
//                             >
//                               Reschedule
//                             </Button>
//                           </>
//                         )}
//                         {tabValue === 1 && (
//                           <Button
//                             fullWidth
//                             variant="outlined"
//                             startIcon={<DownloadIcon />}
//                           >
//                             Download Receipt
//                           </Button>
//                         )}
//                         <Button
//                           fullWidth
//                           variant="outlined"
//                           startIcon={<HistoryIcon />}
//                         >
//                           View Details
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     );
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Box>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
//           <Box>
//             <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
//               My Appointments
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Manage your upcoming and past appointments
//             </Typography>
//           </Box>
//           <Button
//             variant="contained"
//             startIcon={<CalendarIcon />}
//             onClick={() => navigate('/book-appointment')}
//           >
//             Book New Appointment
//           </Button>
//         </Box>

//         {/* Filter Section */}
//         <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
//           <CardContent>
//             <Grid container spacing={2} alignItems="center">
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <TextField
//                   fullWidth
//                   placeholder="Search appointments..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   slotProps={{
//                     input: {
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <DatePicker
//                   label="Filter by date"
//                   value={selectedDate}
//                   onChange={(newValue) => setSelectedDate(newValue)}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, md: 2 }}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedDate(null);
//                   }}
//                   startIcon={<ArrowBackIcon />}
//                 >
//                   Clear Filters
//                 </Button>
//               </Grid>
//               <Grid size={{ xs: 12, md: 2 }}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<RefreshIcon />}
//                   onClick={loadAppointments}
//                 >
//                   Refresh
//                 </Button>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         {/* Tabs */}
//         <Paper sx={{ mb: 3, borderRadius: 2 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="fullWidth"
//             sx={{
//               '& .MuiTab-root': {
//                 fontSize: '1rem',
//                 fontWeight: 600,
//               }
//             }}
//           >
//             <Tab
//               icon={<TodayIcon />}
//               iconPosition="start"
//               label={`Upcoming (${upcomingAppointments.length})`}
//             />
//             <Tab
//               icon={<HistoryIcon />}
//               iconPosition="start"
//               label={`Past Appointments (${pastAppointments.length})`}
//             />
//           </Tabs>
//         </Paper>

//         {/* Tab Content */}
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
//             <Typography>Loading appointments...</Typography>
//           </Box>
//         ) : (
//           <TabPanel value={tabValue} index={0}>
//             {renderAppointments(upcomingAppointments)}
//           </TabPanel>
//         )}

//         <TabPanel value={tabValue} index={1}>
//           {renderAppointments(pastAppointments)}
//         </TabPanel>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default PatientAppointments;

// 2nd Iteration
// import {
//   CalendarToday as CalendarIcon,
//   EventBusy as CancelIcon,
//   EditCalendar as RescheduleIcon,
//   AccessTime as TimeIcon
// } from '@mui/icons-material';
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   Paper,
//   Tab,
//   Tabs,
//   Typography
// } from '@mui/material';
// import { DatePicker, TimePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { format } from 'date-fns';
// import React, { useEffect, useState } from 'react';
// import { bookingService } from '../../services/bookingService';
// import { patientService } from '../../services/patientService';
// import { useAppSelector } from '../../store/store';
// import { Appointment, AppointmentStatus } from '../../types';

// const PatientAppointments: React.FC = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const [tabValue, setTabValue] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);

//   // Reschedule Dialog State
//   const [rescheduleOpen, setRescheduleOpen] = useState(false);
//   const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
//   const [newDate, setNewDate] = useState<Date | null>(null);
//   const [newTime, setNewTime] = useState<Date | null>(null);
//   const [rescheduleLoading, setRescheduleLoading] = useState(false);

//   useEffect(() => {
//     loadAppointments();
//   }, [user]);

//   const loadAppointments = async () => {
//     setLoading(true);
//     try {
//       const all = await patientService.getUpcomingAppointments(user?.id || '1');
//       const past = await patientService.getPastAppointments(user?.id || '1');
//       setAppointments([...all, ...past]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       try {
//         await bookingService.cancelBooking(id, 'Patient requested cancellation');
//         loadAppointments();
//       } catch (error) {
//         alert('Failed to cancel appointment');
//       }
//     }
//   };

//   const openReschedule = (appt: Appointment) => {
//     setSelectedAppt(appt);
//     setNewDate(new Date(appt.date));
//     const [h, m] = appt.startTime.split(':').map(Number);
//     const t = new Date(); t.setHours(h, m, 0, 0);
//     setNewTime(t);
//     setRescheduleOpen(true);
//   };

//   const handleRescheduleSubmit = async () => {
//     if (!selectedAppt || !newDate || !newTime) return;

//     setRescheduleLoading(true);
//     try {
//       const timeStr = format(newTime, 'HH:mm');
//       await bookingService.rescheduleAppointment(selectedAppt.id, newDate, timeStr);
//       setRescheduleOpen(false);
//       loadAppointments();
//       alert('Appointment rescheduled successfully!');
//     } catch (error) {
//       console.error(error);
//       alert('Failed to reschedule. Slot might be unavailable.');
//     } finally {
//       setRescheduleLoading(false);
//     }
//   };

//   const filteredAppointments = appointments.filter(a => {
//     const apptDate = new Date(a.date);
//     apptDate.setHours(0, 0, 0, 0);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const isUpcoming = apptDate >= today &&
//       a.status !== AppointmentStatus.CANCELLED &&
//       a.status !== AppointmentStatus.COMPLETED;

//     return tabValue === 0 ? isUpcoming : !isUpcoming;
//   });

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>My Appointments</Typography>

//       <Paper sx={{ mb: 3 }}>
//         <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
//           <Tab label="Upcoming" />
//           <Tab label="Past / Cancelled" />
//         </Tabs>
//       </Paper>

//       {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} /> : (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           {filteredAppointments.length === 0 ? (
//             <Alert severity="info">No appointments found in this category.</Alert>
//           ) : (
//             filteredAppointments.map((appt) => (
//               <Card key={appt.id} variant="outlined" sx={{ borderColor: tabValue === 0 ? 'primary.light' : 'divider' }}>
//                 <CardContent>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 12, sm: 8 }}>
//                       <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//                         <Chip label={appt.status} color={appt.status === 'CONFIRMED' ? 'success' : 'default'} size="small" />
//                         <Chip label={appt.metadata?.serviceName} variant="outlined" size="small" />
//                       </Box>
//                       <Typography variant="h6">Dr. {appt.metadata?.doctorName}</Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, color: 'text.secondary' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <CalendarIcon fontSize="small" />
//                           <Typography variant="body2">{format(new Date(appt.date), 'EEE, MMM d, yyyy')}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <TimeIcon fontSize="small" />
//                           <Typography variant="body2">{appt.startTime} - {appt.endTime}</Typography>
//                         </Box>
//                       </Box>
//                     </Grid>

//                     {tabValue === 0 && (
//                       <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           startIcon={<RescheduleIcon />}
//                           onClick={() => openReschedule(appt)}
//                         >
//                           Reschedule
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="error"
//                           startIcon={<CancelIcon />}
//                           onClick={() => handleCancel(appt.id)}
//                         >
//                           Cancel
//                         </Button>
//                       </Grid>
//                     )}
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </Box>
//       )}

//       {/* Reschedule Dialog */}
//       <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)}>
//         <DialogTitle>Reschedule Appointment</DialogTitle>
//         <DialogContent sx={{ pt: 2, minWidth: 300 }}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
//               <DatePicker
//                 label="New Date"
//                 value={newDate}
//                 onChange={setNewDate}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//               <TimePicker
//                 label="New Time"
//                 value={newTime}
//                 onChange={setNewTime}
//                 slotProps={{ textField: { fullWidth: true } }}
//               />
//             </Box>
//           </LocalizationProvider>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRescheduleOpen(false)}>Cancel</Button>
//           <Button onClick={handleRescheduleSubmit} variant="contained" disabled={rescheduleLoading}>
//             {rescheduleLoading ? 'Updating...' : 'Confirm'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default PatientAppointments;

import { AvailableDate, AvailableTimeSlot } from '@/types/booking';
import {
    CalendarToday as CalendarIcon,
    EventBusy as CancelIcon,
    EditCalendar as RescheduleIcon,
    AccessTime as TimeIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isSameDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';
import { Appointment, AppointmentStatus } from '../../types';
import AppointmentDetailsModal from '@/components/appointments/AppointmentDetailsModal';

const PatientAppointments: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // NEW: State for Details Modal
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

    // Reschedule Dialog State
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [newDate, setNewDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [rescheduleLoading, setRescheduleLoading] = useState(false);

    // Availability State
    const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
    const [datesLoading, setDatesLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    useEffect(() => {
        loadAppointments();
    }, [user]);

    useEffect(() => {
        if (selectedAppt && newDate) {
            loadSlotsForDate(selectedAppt.doctorId, newDate, selectedAppt.serviceId);
        }
    }, [newDate, selectedAppt]);

    const handleViewDetails = (appt: Appointment) => {
        setViewAppointment(appt);
        setDetailsModalOpen(true);
    };

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const all = await patientService.getUpcomingAppointments(user?.id || '1');
            const past = await patientService.getPastAppointments(user?.id || '1');
            setAppointments([...all, ...past]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await bookingService.cancelBooking(id, 'Patient requested cancellation');
                loadAppointments();
            } catch (error) {
                alert('Failed to cancel appointment');
            }
        }
    };

    const openReschedule = async (appt: Appointment) => {
        setSelectedAppt(appt);
        setNewDate(null);
        setSelectedSlot('');
        setRescheduleOpen(true);

        setDatesLoading(true);
        try {
            const dates = await bookingService.getAvailableDates(appt.doctorId, appt.serviceId);
            setAvailableDates(dates);
        } catch (error) {
            console.error("Failed to load available dates", error);
        } finally {
            setDatesLoading(false);
        }
    };

    const loadSlotsForDate = async (doctorId: string, date: Date, serviceId: string) => {
        setSlotsLoading(true);
        setAvailableSlots([]);
        setSelectedSlot('');
        try {
            const duration = 30; // Mock duration
            // Update to pass serviceId
            const slots = await bookingService.generateAvailableTimeSlots(doctorId, date, serviceId, duration);
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Failed to load slots", error);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleRescheduleSubmit = async () => {
        if (!selectedAppt || !newDate || !selectedSlot) return;

        setRescheduleLoading(true);
        try {
            await bookingService.rescheduleAppointment(selectedAppt.id, newDate, selectedSlot);
            setRescheduleOpen(false);
            loadAppointments();
            alert('Appointment rescheduled successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to reschedule. Slot might be unavailable.');
        } finally {
            setRescheduleLoading(false);
        }
    };

    // const filteredAppointments = appointments.filter(a => {
    //     const apptDate = new Date(a.date);
    //     apptDate.setHours(0, 0, 0, 0);
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     const isUpcoming = apptDate >= today &&
    //         a.status !== AppointmentStatus.CANCELLED &&
    //         a.status !== AppointmentStatus.COMPLETED;

    //     return tabValue === 0 ? isUpcoming : !isUpcoming;
    // });

    const filteredAppointments = appointments.filter(a => {
        const apptDate = new Date(a.date);
        apptDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Active / Upcoming
        const isUpcoming = apptDate >= today &&
            a.status !== AppointmentStatus.CANCELLED &&
            a.status !== AppointmentStatus.COMPLETED &&
            a.status !== AppointmentStatus.ABSENT; // Added ABSENT to exclusion

        return tabValue === 0 ? isUpcoming : !isUpcoming;
    });

    const isDateAvailable = (date: Date) => {
        return availableDates.some(d => isSameDay(d.date, date));
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>My Appointments</Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
                    <Tab label="Upcoming" />
                    <Tab label="Past / Cancelled" />
                </Tabs>
            </Paper>

            {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} /> : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredAppointments.length === 0 ? (
                        <Alert severity="info">No appointments found in this category.</Alert>
                    ) : (
                        filteredAppointments.map((appt) => (
                            <Card key={appt.id} variant="outlined" sx={{ borderColor: tabValue === 0 ? 'primary.light' : 'divider' }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        {/* FIX: Using new Grid size syntax */}
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                <Chip label={appt.status} color={appt.status === 'CONFIRMED' ? 'success' : 'default'} size="small" />
                                                <Chip label={appt.metadata?.serviceName} variant="outlined" size="small" />
                                            </Box>
                                            <Typography variant="h6">Dr. {appt.metadata?.doctorName}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, color: 'text.secondary' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarIcon fontSize="small" />
                                                    <Typography variant="body2">{format(new Date(appt.date), 'EEE, MMM d, yyyy')}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TimeIcon fontSize="small" />
                                                    <Typography variant="body2">{appt.startTime} - {appt.endTime}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {tabValue === 0 && (
                                            /* FIX: Using new Grid size syntax */
                                            <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<RescheduleIcon />}
                                                    onClick={() => openReschedule(appt)}
                                                >
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleCancel(appt.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        )}

                                        {/* NEW: Buttons for Past/Completed Tab */}
                                        {tabValue === 1 && (
                                            <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                                {appt.status === AppointmentStatus.COMPLETED && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<ViewIcon />}
                                                        onClick={() => handleViewDetails(appt)}
                                                    >
                                                        View Summary
                                                    </Button>
                                                )}
                                                {/* If ABSENT, show a static label or nothing */}
                                                {appt.status === AppointmentStatus.ABSENT && (
                                                    <Chip label="Missed" color="warning" variant="outlined" />
                                                )}
                                                {/* You can add a "Book Again" button here too if you want */}
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                            {/* Date Selection */}
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Select New Date</Typography>
                                <DatePicker
                                    value={newDate}
                                    onChange={setNewDate}
                                    loading={datesLoading}
                                    // FIX: Custom loading component inside the calendar popup
                                    renderLoading={() => (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', width: '100%' }}>
                                            <CircularProgress size={30} sx={{ mb: 2 }} />
                                            <Typography variant="body2" color="text.secondary">Fetching available dates...</Typography>
                                        </Box>
                                    )}
                                    shouldDisableDate={(date) => !isDateAvailable(date)}
                                    disablePast
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            helperText: datesLoading ? "Please wait..." : "Only available dates are enabled"
                                        }
                                    }}
                                />
                            </Box>

                            {/* Slot Selection */}
                            {newDate && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>Select New Time</Typography>
                                    {slotsLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                                            <CircularProgress size={20} />
                                            <Typography variant="body2" color="text.secondary">Loading slots...</Typography>
                                        </Box>
                                    ) : availableSlots.length === 0 ? (
                                        <Alert severity="warning">No slots available for this date.</Alert>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 200, overflowY: 'auto' }}>
                                            {availableSlots.map((slot) => (
                                                <Chip
                                                    key={slot.startTime}
                                                    label={slot.startTime}
                                                    onClick={() => setSelectedSlot(slot.startTime)}
                                                    color={selectedSlot === slot.startTime ? 'primary' : 'default'}
                                                    variant={selectedSlot === slot.startTime ? 'filled' : 'outlined'}
                                                    clickable
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRescheduleOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleRescheduleSubmit}
                        variant="contained"
                        disabled={rescheduleLoading || !newDate || !selectedSlot}
                    >
                        {rescheduleLoading ? 'Updating...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            <AppointmentDetailsModal
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                appointment={viewAppointment}
            />
        </Container>
    );
};

export default PatientAppointments;