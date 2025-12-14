import { appointmentService } from '@/services/appointmentService';
import {
  AccessTime,
  CalendarMonth,
  MedicalServices,
  Person,
  Refresh,
  Search,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import { Appointment, AppointmentStatus } from '../types';

const statusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.NEW]: '#3b82f6',
  [AppointmentStatus.AWAITING]: '#f59e0b',
  [AppointmentStatus.CONFIRMED]: '#10b981',
  [AppointmentStatus.RESCHEDULED]: '#8b5cf6',
  [AppointmentStatus.COMPLETED]: '#64748b',
  [AppointmentStatus.CANCELLED]: '#ef4444',
};

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.NEW]: 'New',
  [AppointmentStatus.AWAITING]: 'Awaiting',
  [AppointmentStatus.CONFIRMED]: 'Confirmed',
  [AppointmentStatus.RESCHEDULED]: 'Rescheduled',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELLED]: 'Cancelled',
};

const Appointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [activeTab, searchTerm, selectedDate, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      // For demo, we'll use mock data. In production, use:
      // const data = await appointmentService.getAppointments();

      // const mockAppointments: Appointment[] = [
      //   // {
      //   //   id: '1',
      //   //   patientId: '1',
      //   //   doctorId: user?.id || '1',
      //   //   serviceId: '1',
      //   //   date: new Date(),
      //   //   startTime: '10:00',
      //   //   endTime: '10:30',
      //   //   status: AppointmentStatus.CONFIRMED,
      //   //   notes: 'Follow-up for knee pain',
      //   //   symptoms: ['Knee pain', 'Swelling'],
      //   //   paymentStatus: PaymentStatus.PAID,
      //   //   amount: 600,
      //   //   createdAt: new Date(),
      //   //   updatedAt: new Date(),
      //   //   metadata: {
      //   //     patientName: 'John Doe',
      //   //     serviceName: 'Clinic Consultation',
      //   //   },
      //   // },
      //   // {
      //   //   id: '2',
      //   //   patientId: '2',
      //   //   doctorId: user?.id || '1',
      //   //   serviceId: '2',
      //   //   date: new Date(),
      //   //   startTime: '11:00',
      //   //   endTime: '12:00',
      //   //   status: AppointmentStatus.NEW,
      //   //   notes: 'Initial assessment',
      //   //   symptoms: ['Back pain'],
      //   //   paymentStatus: PaymentStatus.PENDING,
      //   //   amount: 1200,
      //   //   createdAt: new Date(),
      //   //   updatedAt: new Date(),
      //   //   metadata: {
      //   //     patientName: 'Jane Smith',
      //   //     serviceName: 'Home Visit',
      //   //   },
      //   // },
      //   // {
      //   //   id: '3',
      //   //   patientId: '3',
      //   //   doctorId: user?.id || '1',
      //   //   serviceId: '3',
      //   //   date: new Date(Date.now() + 86400000),
      //   //   startTime: '14:00',
      //   //   endTime: '14:30',
      //   //   status: AppointmentStatus.AWAITING,
      //   //   notes: 'Video follow-up',
      //   //   symptoms: ['Shoulder pain'],
      //   //   paymentStatus: PaymentStatus.PENDING,
      //   //   amount: 800,
      //   //   createdAt: new Date(),
      //   //   updatedAt: new Date(),
      //   //   metadata: {
      //   //     patientName: 'Robert Johnson',
      //   //     serviceName: 'Video Consultation',
      //   //   },
      //   // },
      // ];

      // Fetch real data from the service using the logged-in doctor's ID
      const doctorId = user?.id || '1';
      const data = await appointmentService.getAppointments({
        doctorId: doctorId,
        status: 'ALL' as AppointmentStatus
      });

      console.log(data);
      

      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(appt => appt.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        appt =>
          appt.metadata?.patientName?.toLowerCase().includes(term) ||
          appt.metadata?.serviceName?.toLowerCase().includes(term) ||
          appt.notes?.toLowerCase().includes(term)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(
        appt => format(new Date(appt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: AppointmentStatus | 'ALL') => {
    setActiveTab(newValue);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      // In production, use: await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev =>
        prev.map(appt => (appt.id === appointmentId ? { ...appt, status: newStatus } : appt))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getAppointmentsByStatus = (status: AppointmentStatus | 'ALL') => {
    if (status === 'ALL') return appointments;
    return appointments.filter(appt => appt.status === status);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and view all appointments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CalendarMonth />}
            onClick={() => {
              /* Add new appointment */
            }}
          >
            New Appointment
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search patients, services..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DatePicker
                label="Filter by date"
                value={selectedDate}
                onChange={newDate => setSelectedDate(newDate)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={activeTab}
                  label="Status"
                  onChange={e => setActiveTab(e.target.value as AppointmentStatus | 'ALL')}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  {Object.values(AppointmentStatus).map(status => (
                    <MenuItem key={status} value={status}>
                      {statusLabels[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadAppointments}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${appointments.length})`} value="ALL" />
            {Object.values(AppointmentStatus).map(status => (
              <Tab
                key={status}
                label={`${statusLabels[status]} (${getAppointmentsByStatus(status).length})`}
                value={status}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Appointments Grid */}
        {loading ? (
          <Typography>Loading appointments...</Typography>
        ) : filteredAppointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try changing your filters or create a new appointment
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredAppointments.map(appointment => (
              <Grid size={{ xs: 12 }} key={appointment.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ mr: 2 }}>
                            {appointment.metadata?.patientName}
                          </Typography>
                          <Chip
                            label={statusLabels[appointment.status]}
                            size="small"
                            sx={{
                              backgroundColor: `${statusColors[appointment.status]}20`,
                              color: statusColors[appointment.status],
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonth
                                sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }}
                              />
                              <Typography variant="body2">
                                {format(new Date(appointment.date), 'EEE, MMM dd, yyyy')}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MedicalServices
                                sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }}
                              />
                              <Typography variant="body2">
                                {appointment.metadata?.serviceName}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Person sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                              <Typography variant="body2">Duration: 30 mins</Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {appointment.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Notes: {appointment.notes}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Select
                          value={appointment.status}
                          onChange={e =>
                            handleStatusChange(appointment.id, e.target.value as AppointmentStatus)
                          }
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          {Object.values(AppointmentStatus).map(status => (
                            <MenuItem key={status} value={status}>
                              {statusLabels[status]}
                            </MenuItem>
                          ))}
                        </Select>
                        <Button variant="outlined" size="small">
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Appointments;
