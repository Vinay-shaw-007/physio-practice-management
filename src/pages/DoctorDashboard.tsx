// import {
//   CalendarToday as CalendarIcon,
//   Groups as GroupsIcon,
//   AccessTime as TimeIcon,
//   TrendingUp as TrendingUpIcon
// } from '@mui/icons-material';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Container,
//   Divider,
//   Grid,
//   Paper,
//   Typography,
//   useTheme
// } from '@mui/material';
// import { isToday } from 'date-fns';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { appointmentService } from '../services/appointmentService';
// import { useAppSelector } from '../store/store';
// import { Appointment, AppointmentStatus } from '../types';

// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   trend?: string;
// }> = ({ title, value, icon, color, trend }) => (
//   <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
//     <CardContent>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//         <Box>
//           <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//             {title}
//           </Typography>
//           <Typography variant="h4" fontWeight="bold">
//             {value}
//           </Typography>
//         </Box>
//         <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}>
//           {icon}
//         </Avatar>
//       </Box>
//       {trend && (
//         <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
//           <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> {trend} vs last week
//         </Typography>
//       )}
//     </CardContent>
//   </Card>
// );

// const DoctorDashboard: React.FC = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
//   const [loading, setLoading] = useState(true);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [stats, setStats] = useState({
//     todayCount: 0,
//     pendingCount: 0,
//     totalPatients: 0, // Mock total
//     revenue: 0
//   });

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       // Fetch all appointments for this doctor
//       const allAppts = await appointmentService.getAppointments({
//         doctorId: user?.id || '1',
//         status: 'ALL'
//       });

//       setAppointments(allAppts);

//       // Calculate stats
//       const todayAppts = allAppts.filter(a => isToday(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED);
//       const pendingAppts = allAppts.filter(a => a.status === AppointmentStatus.NEW);
//       const confirmedRevenue = allAppts
//         .filter(a => a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CONFIRMED)
//         .reduce((sum, a) => sum + (a.amount || 0), 0);

//       setStats({
//         todayCount: todayAppts.length,
//         pendingCount: pendingAppts.length,
//         totalPatients: 0,
//         revenue: confirmedRevenue
//       });
//     } catch (error) {
//       console.error('Failed to load dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTodaysAppointments = () => {
//     return appointments
//       .filter(a => isToday(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED)
//       .sort((a, b) => a.startTime.localeCompare(b.startTime));
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const todaysAppointments = getTodaysAppointments();
//   const nextAppointment = todaysAppointments.find(a => {
//     const [h, m] = a.startTime.split(':').map(Number);
//     const apptTime = new Date();
//     apptTime.setHours(h, m, 0, 0);
//     return apptTime > new Date();
//   });

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Header */}
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Welcome back, Dr. {user?.name?.split(' ')[1] || 'Doctor'}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Here's what's happening in your clinic today.
//           </Typography>
//         </Box>
//         <Button variant="contained" onClick={() => navigate('/appointments')}>
//           View All Appointments
//         </Button>
//       </Box>

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid size={{xs: 12, sm: 6, md: 3}}>
//           <StatCard
//             title="Appointments Today"
//             value={stats.todayCount}
//             icon={<CalendarIcon />}
//             color={theme.palette.primary.main}
//           />
//         </Grid>
//         <Grid size={{xs: 12, sm: 6, md: 3}}>
//           <StatCard
//             title="Pending Requests"
//             value={stats.pendingCount}
//             icon={<TimeIcon />}
//             color={theme.palette.warning.main}
//           />
//         </Grid>
//         <Grid size={{xs: 12, sm: 6, md: 3}}>
//           <StatCard
//             title="Total Patients"
//             value={stats.totalPatients}
//             icon={<GroupsIcon />}
//             color={theme.palette.info.main}
//             trend=""
//           />
//         </Grid>
//         <Grid size={{xs: 12, sm: 6, md: 3}}>
//           <StatCard
//             title="Total Revenue"
//             value={`$${stats.revenue}`}
//             icon={<TrendingUpIcon />}
//             color={theme.palette.success.main}
//             trend=""
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Today's Schedule */}
//         <Grid size={{xs: 12, md: 8}}>
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               Today's Schedule
//             </Typography>
//             <Divider sx={{ mb: 3 }} />

//             {todaysAppointments.length === 0 ? (
//               <Box sx={{ py: 4, textAlign: 'center' }}>
//                 <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
//                 <Typography color="text.secondary">No appointments scheduled for today</Typography>
//               </Box>
//             ) : (
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 {todaysAppointments.map((appt) => (
//                   <Paper
//                     key={appt.id}
//                     variant="outlined"
//                     sx={{
//                       p: 2,
//                       display: 'flex',
//                       alignItems: 'center',
//                       borderLeft: `4px solid ${appt.status === AppointmentStatus.COMPLETED ? theme.palette.success.main : theme.palette.primary.main
//                         }`
//                     }}
//                   >
//                     <Box sx={{ minWidth: 100 }}>
//                       <Typography variant="h6" fontWeight="bold">
//                         {appt.startTime}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {appt.metadata?.serviceName}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ flexGrow: 1, ml: 2 }}>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {appt.metadata?.patientName || 'Patient'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {appt.notes || 'No notes provided'}
//                       </Typography>
//                     </Box>
//                     <Chip
//                       label={appt.status}
//                       size="small"
//                       color={appt.status === AppointmentStatus.COMPLETED ? 'success' : 'primary'}
//                       variant="outlined"
//                     />
//                   </Paper>
//                 ))}
//               </Box>
//             )}
//           </Paper>
//         </Grid>

//         {/* Next Up / Quick Actions */}
//         <Grid size={{ xs: 12, md: 4}}>
//           {/* Next Patient Card */}
//           <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
//             <CardContent>
//               <Typography variant="overline" sx={{ opacity: 0.8 }}>
//                 Up Next
//               </Typography>
//               {nextAppointment ? (
//                 <>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
//                     <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
//                       {nextAppointment.metadata?.patientName?.charAt(0) || 'P'}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6">
//                         {nextAppointment.metadata?.patientName}
//                       </Typography>
//                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                         {nextAppointment.startTime} - {nextAppointment.endTime}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
//                     {nextAppointment.metadata?.serviceName}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     fullWidth
//                     onClick={() => navigate(`/appointments/${nextAppointment.id}`)}
//                   >
//                     View Details
//                   </Button>
//                 </>
//               ) : (
//                 <Box sx={{ py: 2 }}>
//                   <Typography variant="h6">No upcoming patients</Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                     You're all caught up for now!
//                   </Typography>
//                 </Box>
//               )}
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/availability')}>
//                 Manage Availability
//               </Button>
//               <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/services')}>
//                 Update Services
//               </Button>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default DoctorDashboard;

import {
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  Groups as GroupsIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon
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
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import { format, isFuture, isToday } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { useAppSelector } from '../store/store';
import { Appointment, AppointmentStatus } from '../types';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
      {trend && (
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
          <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> {trend} vs last week
        </Typography>
      )}
    </CardContent>
  </Card>
);

const DoctorDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tabValue, setTabValue] = useState(0); // 0 = Today, 1 = Upcoming
  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    totalPatients: 124,
    revenue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Default to '1' if user.id is missing (safe fallback for mock mode)
      const doctorId = user?.id || '1';

      console.log(`Fetching appointments for Doctor ID: ${doctorId}`);

      // Fetch all appointments for this doctor
      const allAppts = await appointmentService.getAppointments({
        doctorId: doctorId,
        status: 'ALL'
      });

      console.log("Fetched appointments:", allAppts);
      setAppointments(allAppts);

      // Calculate stats
      const todayAppts = allAppts.filter(a => isToday(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED);
      const pendingAppts = allAppts.filter(a => a.status === AppointmentStatus.NEW);
      const confirmedRevenue = allAppts
        .filter(a => a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CONFIRMED)
        .reduce((sum, a) => sum + (a.amount || 0), 0);

      setStats({
        todayCount: todayAppts.length,
        pendingCount: pendingAppts.length,
        totalPatients: 124,
        revenue: confirmedRevenue
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayAppointments = () => {
    if (tabValue === 0) {
      // Today's appointments
      return appointments
        .filter(a => isToday(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    } else {
      // Upcoming appointments (Future dates)
      return appointments
        .filter(a => isFuture(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayList = getDisplayAppointments();

  // Calculate next immediate patient for the sidebar widget
  const nextAppointment = appointments
    .filter(a => isToday(new Date(a.date)) && a.status !== AppointmentStatus.CANCELLED)
    .find(a => {
      const [h, m] = a.startTime.split(':').map(Number);
      const apptTime = new Date();
      apptTime.setHours(h, m, 0, 0);
      return apptTime > new Date();
    });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || 'Dr. Johnson'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening in your clinic.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadDashboardData}
            variant="outlined"
          >
            Refresh Data
          </Button>
          <Button variant="contained" onClick={() => navigate('/appointments')}>
            Manage All
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Appointments Today"
            value={stats.todayCount}
            icon={<CalendarIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Requests"
            value={stats.pendingCount}
            icon={<TimeIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<GroupsIcon />}
            color={theme.palette.info.main}
            trend="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue}`}
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
            trend="+5%"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Schedule Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab label="Today's Schedule" />
                <Tab label="Upcoming" />
              </Tabs>
            </Box>

            {displayList.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
                <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  {tabValue === 0 ? "No appointments scheduled for today" : "No upcoming appointments found"}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {displayList.map((appt) => (
                  <Paper
                    key={appt.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 },
                      borderLeft: `4px solid ${appt.status === AppointmentStatus.COMPLETED ? theme.palette.success.main :
                          appt.status === AppointmentStatus.NEW ? theme.palette.warning.main :
                            theme.palette.primary.main
                        }`
                    }}
                    onClick={() => navigate(`/appointments`)} // Or open detail modal
                  >
                    <Box sx={{ minWidth: 120 }}>
                      {tabValue === 1 && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {format(new Date(appt.date), 'MMM d, yyyy')}
                        </Typography>
                      )}
                      <Typography variant="h6" fontWeight="bold">
                        {appt.startTime}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appt.metadata?.serviceName}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {appt.metadata?.patientName || 'Unknown Patient'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {appt.notes || 'No notes provided'}
                      </Typography>
                    </Box>
                    <Chip
                      label={appt.status}
                      size="small"
                      color={
                        appt.status === AppointmentStatus.COMPLETED ? 'success' :
                          appt.status === AppointmentStatus.NEW ? 'warning' : 'primary'
                      }
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Up Next Card */}
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>
                Up Next (Today)
              </Typography>
              {nextAppointment ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                      {nextAppointment.metadata?.patientName?.charAt(0) || 'P'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {nextAppointment.metadata?.patientName}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {nextAppointment.startTime} - {nextAppointment.endTime}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    {nextAppointment.metadata?.serviceName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate(`/appointments`)}
                  >
                    View Details
                  </Button>
                </>
              ) : (
                <Box sx={{ py: 2 }}>
                  <Typography variant="h6">No pending patients</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    You're all caught up for today!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
                fullWidth
                onClick={() => navigate('/availability')}
              >
                Manage Availability
              </Button>
              <Button
                variant="outlined"
                startIcon={<GroupsIcon />}
                sx={{ justifyContent: 'flex-start', py: 1 }}
                fullWidth
                onClick={() => navigate('/patients')}
              >
                Patient Directory
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;