// import {
//   ArrowForward as ArrowForwardIcon,
//   CalendarMonth as CalendarIcon,
//   LocalHospital as ClinicIcon,
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   Favorite as FavoriteIcon,
//   HealthAndSafety as HealthIcon,
//   Home as HomeIcon,
//   MedicalServices as MedicalIcon,
//   Notifications as NotificationsIcon,
//   Payment as PaymentIcon,
//   Person as PersonIcon,
//   Receipt as ReceiptIcon,
//   Schedule as ScheduleIcon,
//   AccessTime as TimeIcon,
//   TrendingUp as TrendingUpIcon,
//   Videocam as VideoIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';
// import {
//   Alert,
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Divider,
//   Grid,
//   IconButton,
//   Paper,
//   Stack,
//   Typography
// } from '@mui/material';
// import { format } from 'date-fns';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MedicalRecord, patientService } from '../services/patientService';
// import { useAppSelector } from '../store/store';
// import { Appointment, AppointmentStatus, Patient, ServiceType } from '../types';

// // Helper components
// const StatCard = ({ title, value, icon, color, subtitle }: any) => (
//   <Card sx={{ height: '100%' }}>
//     <CardContent sx={{ p: 2 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box>
//           <Typography variant="caption" color="text.secondary">
//             {title}
//           </Typography>
//           <Typography variant="h4" sx={{ mt: 0.5 }}>
//             {value}
//           </Typography>
//           {subtitle && (
//             <Typography variant="caption" color="text.secondary">
//               {subtitle}
//             </Typography>
//           )}
//         </Box>
//         <Box sx={{
//           width: 48,
//           height: 48,
//           borderRadius: '50%',
//           bgcolor: `${color}20`,
//           color,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//           {icon}
//         </Box>
//       </Box>
//     </CardContent>
//   </Card>
// );

// const HealthMetricCard = ({ title, value, unit, status, trend }: any) => {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'excellent':
//       case 'normal':
//       case 'healthy':
//         return 'success.main';
//       case 'warning':
//       case 'borderline':
//         return 'warning.main';
//       case 'danger':
//       case 'high':
//       case 'low':
//         return 'error.main';
//       default:
//         return 'text.primary';
//     }
//   };

//   return (
//     <Paper sx={{ p: 2, borderRadius: 2 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <Box>
//           <Typography variant="caption" color="text.secondary">
//             {title}
//           </Typography>
//           <Typography variant="h5" sx={{ mt: 0.5 }}>
//             {value} {unit}
//           </Typography>
//         </Box>
//         <Chip
//           label={status}
//           size="small"
//           sx={{
//             bgcolor: `${getStatusColor(status)}20`,
//             color: getStatusColor(status),
//             borderColor: getStatusColor(status),
//           }}
//           variant="outlined"
//         />
//       </Box>
//       {trend && (
//         <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//           <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
//           <Typography variant="caption" color="text.secondary">
//             {trend}
//           </Typography>
//         </Box>
//       )}
//     </Paper>
//   );
// };

// const AppointmentCard = ({ appointment, type = 'upcoming' }: any) => {
//   const getServiceIcon = (type: ServiceType) => {
//     switch (type) {
//       case ServiceType.CLINIC_VISIT:
//         return <ClinicIcon fontSize="small" />;
//       case ServiceType.HOME_VISIT:
//         return <HomeIcon fontSize="small" />;
//       case ServiceType.VIDEO_CONSULT:
//         return <VideoIcon fontSize="small" />;
//       default:
//         return <MedicalIcon fontSize="small" />;
//     }
//   };

//   const getStatusColor = (status: AppointmentStatus) => {
//     switch (status) {
//       case AppointmentStatus.CONFIRMED:
//         return 'success';
//       case AppointmentStatus.AWAITING:
//         return 'warning';
//       case AppointmentStatus.COMPLETED:
//         return 'info';
//       case AppointmentStatus.CANCELLED:
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

//   const appointmentDate = new Date(appointment.date);
//   const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

//   return (
//     <Paper sx={{ p: 2, mb: 2, borderLeft: 4, borderColor: 'primary.main' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <Box sx={{ flex: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//             {getServiceIcon(appointment.metadata?.serviceType)}
//             <Typography variant="subtitle1" fontWeight="medium">
//               {appointment.metadata?.serviceName}
//             </Typography>
//             <Chip
//               label={appointment.status}
//               size="small"
//               color={getStatusColor(appointment.status) as any}
//               variant="outlined"
//             />
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//               <Typography variant="body2">
//                 {isToday ? 'Today' : format(appointmentDate, 'EEE, MMM d')}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <TimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//               <Typography variant="body2">
//                 {appointment.startTime} - {appointment.endTime}
//               </Typography>
//             </Box>
//           </Box>

//           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//             with {appointment.metadata?.doctorName}
//           </Typography>

//           {appointment.notes && (
//             <Typography variant="caption" color="text.secondary">
//               Notes: {appointment.notes}
//             </Typography>
//           )}
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
//           <Typography variant="h6" color="primary.main" fontWeight="bold">
//             ₹{appointment.amount}
//           </Typography>

//           <Box sx={{ display: 'flex', gap: 1 }}>
//             {type === 'upcoming' && (
//               <>
//                 <Button size="small" variant="outlined" color="error">
//                   Cancel
//                 </Button>
//                 <Button size="small" variant="contained">
//                   Reschedule
//                 </Button>
//               </>
//             )}
//             {type === 'past' && (
//               <Button size="small" variant="outlined" startIcon={<ReceiptIcon />}>
//                 Receipt
//               </Button>
//             )}
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// const PatientDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
//   const [loading, setLoading] = useState(true);
//   const [patientData, setPatientData] = useState<Patient | null>(null);
//   const [stats, setStats] = useState<any>(null);
//   const [healthMetrics, setHealthMetrics] = useState<any>(null);
//   const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
//   const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
//   const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
//   const [invoices, setInvoices] = useState<any[]>([]);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [
//         patientProfile,
//         patientStats,
//         metrics,
//         upcoming,
//         past,
//         records,
//         patientInvoices
//       ] = await Promise.all([
//         patientService.getPatientProfile(user?.id || 'patient1'),
//         patientService.getPatientStats(user?.id || 'patient1'),
//         patientService.getHealthMetrics(user?.id || 'patient1'),
//         patientService.getUpcomingAppointments(user?.id || 'patient1'),
//         patientService.getPastAppointments(user?.id || 'patient1', 5),
//         patientService.getMedicalRecords(user?.id || 'patient1', 3),
//         patientService.getInvoices(user?.id || 'patient1'),
//       ]);

//       setPatientData(patientProfile);
//       setStats(patientStats);
//       setHealthMetrics(metrics);
//       setUpcomingAppointments(upcoming);
//       setPastAppointments(past);
//       setMedicalRecords(records);
//       setInvoices(patientInvoices);
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const calculateBMI = (height: number, weight: number) => {
//     const heightInMeters = height / 100;
//     return (weight / (heightInMeters * heightInMeters)).toFixed(1);
//   };

//   return (
//     <Box>
//       {/* Welcome Header */}
//       <Box sx={{ mb: 4 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Box>
//             <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
//               Welcome back, {patientData?.name?.split(' ')[0]}!
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Here's your health summary and upcoming appointments
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<EditIcon />}
//               onClick={() => navigate('/profile')}
//             >
//               Edit Profile
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<CalendarIcon />}
//               onClick={() => navigate('/book-appointment')}
//             >
//               Book New Appointment
//             </Button>
//           </Box>
//         </Box>

//         {/* Stats Cards */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <StatCard
//               title="Upcoming Appointments"
//               value={stats?.upcomingAppointments || 0}
//               icon={<CalendarIcon />}
//               color="#3b82f6"
//               subtitle="Next: Tomorrow"
//             />
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <StatCard
//               title="Total Spent"
//               value={`₹${stats?.totalSpent?.toLocaleString() || 0}`}
//               icon={<PaymentIcon />}
//               color="#10b981"
//               subtitle="This year"
//             />
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <StatCard
//               title="Days Since Last Visit"
//               value={stats?.daysSinceLastVisit || 0}
//               icon={<ScheduleIcon />}
//               color="#8b5cf6"
//               subtitle="Keep up the good work!"
//             />
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <StatCard
//               title="Health Score"
//               value={`${stats?.averageRating || 0}/5`}
//               icon={<HealthIcon />}
//               color="#f59e0b"
//               subtitle="Based on assessments"
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       <Grid container spacing={4}>
//         {/* Left Column - Health & Profile */}
//         <Grid size={{ xs: 12, lg: 4 }}>
//           {/* Profile Card */}
//           <Card sx={{ mb: 4 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Avatar
//                     sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}
//                     alt={patientData?.name}
//                   >
//                     {patientData?.name?.charAt(0)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h6" fontWeight="bold">
//                       {patientData?.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Patient ID: #{patientData?.id?.toUpperCase()}
//                     </Typography>
//                     <Chip
//                       label="Active Member"
//                       size="small"
//                       color="success"
//                       sx={{ mt: 1 }}
//                     />
//                   </Box>
//                 </Box>
//                 <IconButton>
//                   <NotificationsIcon />
//                 </IconButton>
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Age
//                   </Typography>
//                   <Typography variant="body2" fontWeight="medium">
//                     {patientData?.dateOfBirth ?
//                       Math.floor((new Date().getTime() - new Date(patientData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : '--'} years
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Gender
//                   </Typography>
//                   <Typography variant="body2" fontWeight="medium">
//                     {patientData?.gender}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Blood Group
//                   </Typography>
//                   <Typography variant="body2" fontWeight="medium">
//                     {patientData?.bloodGroup || 'Not specified'}
//                   </Typography>
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     BMI
//                   </Typography>
//                   <Typography variant="body2" fontWeight="medium">
//                     {patientData?.height && patientData?.weight ?
//                       calculateBMI(patientData.height, patientData.weight) : '--'}
//                   </Typography>
//                 </Grid>
//               </Grid>

//               <Divider sx={{ my: 2 }} />

//               {/* Emergency Contact */}
//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//                   Emergency Contact
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
//                   <PersonIcon color="error" />
//                   <Box>
//                     <Typography variant="body2" fontWeight="medium">
//                       {patientData?.emergencyContact?.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {patientData?.emergencyContact?.relationship} • {patientData?.emergencyContact?.phone}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>

//           {/* Health Metrics */}
//           <Card sx={{ mb: 4 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Health Metrics
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Last updated: {format(healthMetrics?.lastUpdated || new Date(), 'MMM d')}
//                 </Typography>
//               </Box>

//               <Stack spacing={2}>
//                 <HealthMetricCard
//                   title="Blood Pressure"
//                   value={`${healthMetrics?.bloodPressure?.systolic}/${healthMetrics?.bloodPressure?.diastolic}`}
//                   unit="mmHg"
//                   status={healthMetrics?.bloodPressure?.status}
//                 />
//                 <HealthMetricCard
//                   title="Heart Rate"
//                   value={healthMetrics?.heartRate?.value}
//                   unit="bpm"
//                   status={healthMetrics?.heartRate?.status}
//                 />
//                 <HealthMetricCard
//                   title="Cholesterol"
//                   value={healthMetrics?.cholesterol?.value}
//                   unit="mg/dL"
//                   status={healthMetrics?.cholesterol?.status}
//                   trend="Stable"
//                 />
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* Medical Alerts */}
//           {patientData?.allergies && patientData.allergies.length > 0 && (
//             <Card sx={{ mb: 4 }}>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <WarningIcon color="warning" />
//                   Medical Alerts
//                 </Typography>
//                 <Alert severity="warning" sx={{ mb: 2 }}>
//                   <Typography variant="subtitle2">Allergies</Typography>
//                   <Typography variant="body2">
//                     {patientData.allergies.join(', ')}
//                   </Typography>
//                 </Alert>
//                 {patientData.medicalHistory && (
//                   <Alert severity="info">
//                     <Typography variant="subtitle2">Medical History</Typography>
//                     <Typography variant="body2">
//                       {patientData.medicalHistory}
//                     </Typography>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </Grid>

//         {/* Middle Column - Appointments & Medical Records */}
//         <Grid size={{ xs: 12, lg: 5 }}>
//           {/* Upcoming Appointments */}
//           <Card sx={{ mb: 4 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Upcoming Appointments
//                 </Typography>
//                 <Button
//                   size="small"
//                   endIcon={<ArrowForwardIcon />}
//                   onClick={() => {/* Navigate to appointments page */ }}
//                 >
//                   View All
//                 </Button>
//               </Box>

//               {upcomingAppointments.length === 0 ? (
//                 <Paper sx={{ p: 4, textAlign: 'center' }}>
//                   <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary">
//                     No upcoming appointments
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                     Schedule your next consultation to continue your treatment
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     onClick={() => navigate('/book-appointment')}
//                   >
//                     Book Appointment
//                   </Button>
//                 </Paper>
//               ) : (
//                 upcomingAppointments.map(appointment => (
//                   <AppointmentCard key={appointment.id} appointment={appointment} type="upcoming" />
//                 ))
//               )}
//             </CardContent>
//           </Card>

//           {/* Recent Medical Records */}
//           <Card>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Medical Records
//                 </Typography>
//                 <Button
//                   size="small"
//                   endIcon={<ArrowForwardIcon />}
//                   onClick={() => {/* Navigate to medical records page */ }}
//                 >
//                   View All
//                 </Button>
//               </Box>

//               <Stack spacing={2}>
//                 {medicalRecords.map(record => (
//                   <Paper key={record.id} sx={{ p: 2, borderRadius: 2 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                       <Box>
//                         <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//                           {record.title}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {format(record.date, 'MMM d, yyyy')} • {record.doctorName}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mt: 1 }}>
//                           {record.description}
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//                           {record.tags.map(tag => (
//                             <Chip key={tag} label={tag} size="small" variant="outlined" />
//                           ))}
//                         </Box>
//                       </Box>
//                       <IconButton size="small">
//                         <DownloadIcon />
//                       </IconButton>
//                     </Box>
//                   </Paper>
//                 ))}
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column - Recent Activity & Quick Actions */}
//         <Grid size={{ xs: 12, lg: 3 }}>
//           {/* Quick Actions */}
//           <Card sx={{ mb: 4 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Stack spacing={1}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<CalendarIcon />}
//                   onClick={() => navigate('/book-appointment')}
//                 >
//                   Book Appointment
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<ReceiptIcon />}
//                   onClick={() => {/* Navigate to invoices */ }}
//                 >
//                   View Invoices
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<DownloadIcon />}
//                   onClick={() => {/* Download records */ }}
//                 >
//                   Download Records
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<FavoriteIcon />}
//                   onClick={() => {/* Rate doctors */ }}
//                 >
//                   Rate Services
//                 </Button>
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* Recent Past Appointments */}
//           <Card sx={{ mb: 4 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Recent Visits
//               </Typography>
//               <Stack spacing={2}>
//                 {pastAppointments.map(appointment => (
//                   <Paper key={appointment.id} sx={{ p: 1.5, borderRadius: 2 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Box>
//                         <Typography variant="body2" fontWeight="medium">
//                           {format(new Date(appointment.date), 'MMM d')}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {appointment.metadata?.serviceName}
//                         </Typography>
//                       </Box>
//                       <Chip
//                         label={`₹${appointment.amount}`}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </Box>
//                   </Paper>
//                 ))}
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* Payment Summary */}
//           <Card>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Payment Summary
//               </Typography>
//               <Box sx={{ mb: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Paid
//                   </Typography>
//                   <Typography variant="body2" fontWeight="bold">
//                     ₹{invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Pending
//                   </Typography>
//                   <Typography variant="body2" fontWeight="bold" color="error.main">
//                     ₹{invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0)}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Divider sx={{ my: 2 }} />
//               <Button
//                 fullWidth
//                 variant="contained"
//                 startIcon={<PaymentIcon />}
//                 onClick={() => {/* Navigate to payment */ }}
//               >
//                 Pay Now
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Bottom Section - Recent Invoices */}
//       <Card sx={{ mt: 4 }}>
//         <CardContent>
//           <Typography variant="h6" fontWeight="bold" gutterBottom>
//             Recent Invoices
//           </Typography>
//           <Grid container spacing={2}>
//             {invoices.slice(0, 3).map(invoice => (
//               <Grid size={{ xs: 12, md: 4 }} key={invoice.id}>
//                 <Paper sx={{ p: 2, borderRadius: 2 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       {invoice.invoiceNumber}
//                     </Typography>
//                     <Chip
//                       label={invoice.status}
//                       size="small"
//                       color={invoice.status === 'PAID' ? 'success' : 'warning'}
//                     />
//                   </Box>
//                   <Typography variant="body2" color="text.secondary">
//                     {format(invoice.date, 'MMM d, yyyy')} • {invoice.service}
//                   </Typography>
//                   <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
//                     ₹{invoice.amount}
//                   </Typography>
//                   <Button
//                     size="small"
//                     startIcon={<DownloadIcon />}
//                     sx={{ mt: 1 }}
//                   >
//                     Download
//                   </Button>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default PatientDashboard;


import {
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  HealthAndSafety as HealthIcon,
  MedicalServices as MedicalIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedicalRecord, patientService } from '../services/patientService';
import { useAppSelector } from '../store/store';
import { Appointment, AppointmentStatus, Patient } from '../types';

// Helper components
const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: `${color}20`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AppointmentCard = ({ appointment }: any) => {
  const appointmentDate = new Date(appointment.date);
  const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Paper sx={{ p: 3, borderRadius: 2, borderLeft: 4, borderColor: 'primary.main', boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <MedicalIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">
              {appointment.metadata?.serviceName}
            </Typography>
            <Chip
              label={appointment.status}
              size="small"
              color={
                appointment.status === AppointmentStatus.CONFIRMED ? 'success' :
                appointment.status === AppointmentStatus.AWAITING ? 'warning' :
                appointment.status === AppointmentStatus.COMPLETED ? 'info' : 'error'
              }
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {isToday ? 'Today' : format(appointmentDate, 'EEE, MMM d')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {appointment.startTime} - {appointment.endTime}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            with Dr. {appointment.metadata?.doctorName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            ₹{appointment.amount}
          </Typography>
          <Button size="small" variant="outlined">
            View Details
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        patientProfile,
        patientStats,
        metrics,
        upcoming,
        records
      ] = await Promise.all([
        patientService.getPatientProfile(user?.id || 'patient1'),
        patientService.getPatientStats(user?.id || 'patient1'),
        patientService.getHealthMetrics(user?.id || 'patient1'),
        patientService.getUpcomingAppointments(user?.id || 'patient1'),
        patientService.getMedicalRecords(user?.id || 'patient1', 3),
      ]);

      setPatientData(patientProfile);
      setStats(patientStats);
      setHealthMetrics(metrics);
      setUpcomingAppointments(upcoming);
      setMedicalRecords(records);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Welcome back, {patientData?.name?.split(' ')[0]}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Here's your health summary and upcoming appointments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/book-appointment')}
            >
              Book New Appointment
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              title="Upcoming Appointments"
              value={stats?.upcomingAppointments || 0}
              icon={<CalendarIcon />}
              color="#3b82f6"
              subtitle="Next: Tomorrow"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              title="Total Visits"
              value={stats?.totalVisits || 0}
              icon={<FavoriteIcon />}
              color="#10b981"
              subtitle="This year"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              title="Days Since Last Visit"
              value={stats?.daysSinceLastVisit || 0}
              icon={<ScheduleIcon />}
              color="#8b5cf6"
              subtitle="Keep up the good work!"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              title="Health Score"
              value={`${stats?.averageRating || 0}/5`}
              icon={<HealthIcon />}
              color="#f59e0b"
              subtitle="Based on assessments"
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Profile & Health Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Profile Card */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                    alt={patientData?.name}
                  >
                    {patientData?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {patientData?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient ID: #{patientData?.id?.toUpperCase()}
                    </Typography>
                    <Chip
                      label="Active Member"
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                <IconButton onClick={() => navigate('/profile')}>
                  <EditIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {patientData?.dateOfBirth ?
                      calculateAge(new Date(patientData.dateOfBirth)) : '--'} years
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {patientData?.gender}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Blood Group
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {patientData?.bloodGroup || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    BMI
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {patientData?.height && patientData?.weight ?
                      calculateBMI(patientData.height, patientData.weight) : '--'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Emergency Contact */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Emergency Contact
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <PersonIcon color="error" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {patientData?.emergencyContact?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patientData?.emergencyContact?.relationship} • {patientData?.emergencyContact?.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate('/book-appointment')}
                >
                  Book Appointment
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={() => navigate('/patient/billing')}
                >
                  View Invoices
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {/* Download records */ }}
                >
                  Download Records
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column - Upcoming Appointments */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {/* Upcoming Appointments */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Appointments
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/patient/appointments')}
                >
                  View All
                </Button>
              </Box>

              {upcomingAppointments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No upcoming appointments
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Schedule your next consultation to continue your treatment
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/book-appointment')}
                  >
                    Book Appointment
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Health Metrics
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Blood Pressure
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {healthMetrics?.bloodPressure?.systolic || '--'}/{healthMetrics?.bloodPressure?.diastolic || '--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      mmHg
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Heart Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {healthMetrics?.heartRate?.value || '--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      bpm
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Cholesterol
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {healthMetrics?.cholesterol?.value || '--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      mg/dL
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {format(new Date(), 'MMM d')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(), 'yyyy')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Recent Activity */}
        <Grid size={{ xs: 12, lg: 3 }}>
          {/* Medical Alerts */}
          {patientData?.allergies && patientData.allergies.length > 0 && (
            <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" />
                  Medical Alerts
                </Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Allergies</Typography>
                  <Typography variant="body2">
                    {patientData.allergies.join(', ')}
                  </Typography>
                </Alert>
                {patientData.medicalHistory && (
                  <Alert severity="info">
                    <Typography variant="subtitle2">Medical History</Typography>
                    <Typography variant="body2">
                      {patientData.medicalHistory}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Medical Records */}
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Records
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/patient/medical-records')}
                >
                  View All
                </Button>
              </Box>

              <Stack spacing={2}>
                {medicalRecords.slice(0, 3).map(record => (
                  <Paper key={record.id} sx={{ p: 2, borderRadius: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {record.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(record.date, 'MMM d, yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                        {record.description}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Health Tips
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Stay Hydrated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drink at least 8 glasses of water daily for better recovery.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'success.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Regular Exercise
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Follow your prescribed exercises daily for optimal results.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'warning.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Pain Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use ice packs for acute pain and heat for chronic stiffness.
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;