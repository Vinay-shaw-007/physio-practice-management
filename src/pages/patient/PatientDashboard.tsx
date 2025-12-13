// import {
//   ArrowForward as ArrowForwardIcon,
//   CalendarMonth as CalendarIcon,
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   Favorite as FavoriteIcon,
//   HealthAndSafety as HealthIcon,
//   MedicalServices as MedicalIcon,
//   Person as PersonIcon,
//   Receipt as ReceiptIcon,
//   Schedule as ScheduleIcon,
//   AccessTime as TimeIcon,
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
// import { patientService } from '../services/patientService';
// import { useAppSelector } from '../store/store';
// import { Appointment, AppointmentStatus, MedicalRecord, Patient } from '../types';

// // Helper components
// const StatCard = ({ title, value, icon, color, subtitle }: any) => (
//   <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
//     <CardContent sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box>
//           <Typography variant="caption" color="text.secondary">
//             {title}
//           </Typography>
//           <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 'bold' }}>
//             {value}
//           </Typography>
//           {subtitle && (
//             <Typography variant="caption" color="text.secondary">
//               {subtitle}
//             </Typography>
//           )}
//         </Box>
//         <Box sx={{
//           width: 56,
//           height: 56,
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

// const AppointmentCard = ({ appointment }: any) => {
//   const appointmentDate = new Date(appointment.date);
//   const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

//   return (
//     <Paper sx={{ p: 3, borderRadius: 2, borderLeft: 4, borderColor: 'primary.main', boxShadow: 1 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <Box sx={{ flex: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//             <MedicalIcon fontSize="small" color="primary" />
//             <Typography variant="subtitle1" fontWeight="medium">
//               {appointment.metadata?.serviceName}
//             </Typography>
//             <Chip
//               label={appointment.status}
//               size="small"
//               color={
//                 appointment.status === AppointmentStatus.CONFIRMED ? 'success' :
//                   appointment.status === AppointmentStatus.AWAITING ? 'warning' :
//                     appointment.status === AppointmentStatus.COMPLETED ? 'info' : 'error'
//               }
//               variant="outlined"
//             />
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//               <Typography variant="body2">
//                 {isToday ? 'Today' : format(appointmentDate, 'EEE, MMM d')}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <TimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
//               <Typography variant="body2">
//                 {appointment.startTime} - {appointment.endTime}
//               </Typography>
//             </Box>
//           </Box>

//           <Typography variant="body2" color="text.secondary">
//             with Dr. {appointment.metadata?.doctorName}
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
//           <Typography variant="h6" color="primary.main" fontWeight="bold">
//             ₹{appointment.amount}
//           </Typography>
//           <Button size="small" variant="outlined">
//             View Details
//           </Button>
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
//   const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

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
//         records
//       ] = await Promise.all([
//         patientService.getPatientProfile(user?.id || 'patient1'),
//         patientService.getPatientStats(user?.id || 'patient1'),
//         patientService.getHealthMetrics(user?.id || 'patient1'),
//         patientService.getUpcomingAppointments(user?.id || 'patient1'),
//         patientService.getMedicalRecords(user?.id || 'patient1', 3),
//       ]);

//       setPatientData(patientProfile);
//       setStats(patientStats);
//       setHealthMetrics(metrics);
//       setUpcomingAppointments(upcoming);
//       setMedicalRecords(records);
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

//   const calculateAge = (dob: Date) => {
//     const today = new Date();
//     let age = today.getFullYear() - dob.getFullYear();
//     const monthDiff = today.getMonth() - dob.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   return (
//     <Box>
//       {/* Welcome Header */}
//       <Box sx={{ mb: 6 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
//               variant="contained"
//               startIcon={<CalendarIcon />}
//               onClick={() => navigate('/book-appointment')}
//             >
//               Book New Appointment
//             </Button>
//           </Box>
//         </Box>

//         {/* Stats Cards */}
//         <Grid container spacing={3} sx={{ mb: 6 }}>
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
//               title="Total Visits"
//               value={stats?.totalVisits || 0}
//               icon={<FavoriteIcon />}
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
//         {/* Left Column - Profile & Health Summary */}
//         <Grid size={{ xs: 12, lg: 4 }}>
//           {/* Profile Card */}
//           <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Avatar
//                     sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
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
//                 <IconButton onClick={() => navigate('/profile')}>
//                   <EditIcon />
//                 </IconButton>
//               </Box>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 6 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Age
//                   </Typography>
//                   <Typography variant="body2" fontWeight="medium">
//                     {patientData?.dateOfBirth ?
//                       calculateAge(new Date(patientData.dateOfBirth)) : '--'} years
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

//               <Divider sx={{ my: 3 }} />

//               {/* Emergency Contact */}
//               <Box>
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

//           {/* Quick Actions */}
//           <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Stack spacing={1}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<CalendarIcon />}
//                   onClick={() => navigate('/book-appointment')}
//                 >
//                   Book Appointment
//                 </Button>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<ReceiptIcon />}
//                   onClick={() => navigate('/patient/billing')}
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
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Middle Column - Upcoming Appointments */}
//         <Grid size={{ xs: 12, lg: 5 }}>
//           {/* Upcoming Appointments */}
//           <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Upcoming Appointments
//                 </Typography>
//                 <Button
//                   size="small"
//                   endIcon={<ArrowForwardIcon />}
//                   onClick={() => navigate('/patient/appointments')}
//                 >
//                   View All
//                 </Button>
//               </Box>

//               {upcomingAppointments.length === 0 ? (
//                 <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
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
//                 <Stack spacing={2}>
//                   {upcomingAppointments.map(appointment => (
//                     <AppointmentCard key={appointment.id} appointment={appointment} />
//                   ))}
//                 </Stack>
//               )}
//             </CardContent>
//           </Card>

//           {/* Health Metrics */}
//           <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
//                 Health Metrics
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 6, md: 3 }}>
//                   <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
//                     <Typography variant="caption" color="text.secondary">
//                       Blood Pressure
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary.main">
//                       {healthMetrics?.bloodPressure?.systolic || '--'}/{healthMetrics?.bloodPressure?.diastolic || '--'}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       mmHg
//                     </Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 6, md: 3 }}>
//                   <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
//                     <Typography variant="caption" color="text.secondary">
//                       Heart Rate
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary.main">
//                       {healthMetrics?.heartRate?.value || '--'}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       bpm
//                     </Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 6, md: 3 }}>
//                   <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
//                     <Typography variant="caption" color="text.secondary">
//                       Cholesterol
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary.main">
//                       {healthMetrics?.cholesterol?.value || '--'}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       mg/dL
//                     </Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid size={{ xs: 6, md: 3 }}>
//                   <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
//                     <Typography variant="caption" color="text.secondary">
//                       Last Updated
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary.main">
//                       {format(new Date(), 'MMM d')}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {format(new Date(), 'yyyy')}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column - Recent Activity */}
//         <Grid size={{ xs: 12, lg: 3 }}>
//           {/* Medical Alerts */}
//           {patientData?.allergies && patientData.allergies.length > 0 && (
//             <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
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

//           {/* Recent Medical Records */}
//           <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6" fontWeight="bold">
//                   Recent Records
//                 </Typography>
//                 <Button
//                   size="small"
//                   endIcon={<ArrowForwardIcon />}
//                   onClick={() => navigate('/patient/medical-records')}
//                 >
//                   View All
//                 </Button>
//               </Box>

//               <Stack spacing={2}>
//                 {medicalRecords.slice(0, 3).map(record => (
//                   <Paper key={record.id} sx={{ p: 2, borderRadius: 2 }}>
//                     <Box>
//                       <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//                         {record.title}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {format(record.date, 'MMM d, yyyy')}
//                       </Typography>
//                       <Typography variant="body2" sx={{ mt: 1 }} noWrap>
//                         {record.description}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 ))}
//               </Stack>
//             </CardContent>
//           </Card>

//           {/* Health Tips */}
//           <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Health Tips
//               </Typography>
//               <Stack spacing={2}>
//                 <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.50' }}>
//                   <Typography variant="subtitle2" fontWeight="bold">
//                     Stay Hydrated
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Drink at least 8 glasses of water daily for better recovery.
//                   </Typography>
//                 </Paper>
//                 <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'success.50' }}>
//                   <Typography variant="subtitle2" fontWeight="bold">
//                     Regular Exercise
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Follow your prescribed exercises daily for optimal results.
//                   </Typography>
//                 </Paper>
//                 <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'warning.50' }}>
//                   <Typography variant="subtitle2" fontWeight="bold">
//                     Pain Management
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Use ice packs for acute pain and heat for chronic stiffness.
//                   </Typography>
//                 </Paper>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default PatientDashboard;

import {
  WaterDrop as BloodIcon,
  CalendarMonth as CalendarIcon,
  Favorite as HeartIcon,
  MonitorWeight as WeightIcon
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';
import { Appointment } from '../../types';

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
  color: string;
}> = ({ icon, label, value, status, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Avatar sx={{ bgcolor: `${color}15`, color: color, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" fontWeight="bold">{value}</Typography>
      <Typography variant="caption" sx={{ color: status === 'Normal' || status === 'Healthy' ? 'success.main' : 'warning.main' }}>
        {status}
      </Typography>
    </Box>
  </Paper>
);

const PatientDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const patientId = user?.id || '1';

      // Parallel fetch
      const [upcomingAppts, healthMetrics] = await Promise.all([
        patientService.getUpcomingAppointments(patientId, 1),
        patientService.getHealthMetrics(patientId)
      ]);

      setNextAppointment(upcomingAppts[0] || null);
      setMetrics(healthMetrics);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Hello, {user?.name?.split(' ')[0] || 'Patient'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your health overview for today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Appointment Card (Wide) */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Next Appointment</Typography>
                <CalendarIcon sx={{ opacity: 0.8 }} />
              </Box>

              {nextAppointment ? (
                <Grid container alignItems="center" spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {format(new Date(nextAppointment.date), 'EEEE, MMM d')}
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
                      {nextAppointment.startTime} - {nextAppointment.endTime}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Chip label={nextAppointment.metadata?.serviceName} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label={`Dr. ${nextAppointment.metadata?.doctorName || 'Johnson'}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate('/patient/appointments')}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ py: 2 }}>
                  <Typography variant="h6" gutterBottom>No upcoming appointments</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/patient/book-appointment')}
                    sx={{ mt: 2 }}
                  >
                    Book Now
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Button
                fullWidth variant="outlined"
                sx={{ height: 100, flexDirection: 'column', gap: 1 }}
                onClick={() => navigate('/patient/book-appointment')}
              >
                <CalendarIcon fontSize="large" color="primary" />
                Book New
              </Button>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Button
                fullWidth variant="outlined"
                sx={{ height: 100, flexDirection: 'column', gap: 1 }}
                onClick={() => navigate('/patient/medical-records')}
              >
                <Box component="span" sx={{ fontSize: 24 }}>📄</Box>
                Records
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Health Metrics Side Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Health Metrics</Typography>
          <Grid container spacing={2} direction="column">
            <Grid>
              <MetricCard
                icon={<HeartIcon />}
                label="Heart Rate"
                value={`${metrics?.heartRate?.value || '--'} bpm`}
                status={metrics?.heartRate?.status || '--'}
                color={theme.palette.error.main}
              />
            </Grid>
            <Grid>
              <MetricCard
                icon={<BloodIcon />}
                label="Blood Pressure"
                value={`${metrics?.bloodPressure?.systolic}/${metrics?.bloodPressure?.diastolic}`}
                status={metrics?.bloodPressure?.status || '--'}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid>
              <MetricCard
                icon={<WeightIcon />}
                label="BMI"
                value={`${metrics?.bmi?.value || '--'}`}
                status={metrics?.bmi?.status || '--'}
                color={theme.palette.warning.main}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;