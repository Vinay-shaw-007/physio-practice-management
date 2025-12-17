// import {
//   ArrowBack as ArrowBackIcon,
//   ArrowForward as ArrowForwardIcon,
//   CalendarMonth as CalendarIcon,
//   CheckCircle as CheckCircleIcon,
//   MedicalServices as MedicalServicesIcon,
//   Person as PersonIcon,
//   Schedule as ScheduleIcon,
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
//   Grid,
//   Paper,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { AvailableDate, AvailableTimeSlot, bookingService } from '../services/bookingService';
// import { serviceService } from '../services/serviceConfigurationService';
// import { useAppSelector } from '../store/store';
// import { Service } from '../types';

// // Import step components we'll create
// import ConfirmationStep from '../components/booking/ConfirmationStep';
// import DateSelectionStep from '../components/booking/DateSelectionStep';
// import ServiceSelectionStep from '../components/booking/ServiceSelectionStep';
// import TimeSlotStep from '../components/booking/TimeSlotStep';

// const steps = ['Select Service', 'Choose Date', 'Select Time', 'Confirm Booking'];

// const BookAppointment: React.FC = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Booking state
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
//   const [patientNotes, setPatientNotes] = useState('');

//   // Load available services
//   const [services, setServices] = useState<Service[]>([]);
//   const [loadingServices, setLoadingServices] = useState(true);

//   useEffect(() => {
//     loadServices();
//   }, []);

//   useEffect(() => {
//     if (selectedService && activeStep >= 1) {
//       loadAvailableDates();
//     }
//   }, [selectedService, activeStep]);

//   useEffect(() => {
//     if (selectedDate && selectedService && activeStep >= 2) {
//       loadAvailableTimeSlots();
//     }
//   }, [selectedDate, activeStep]);

//   const loadServices = async () => {
//     try {
//       setLoadingServices(true);
//       const activeServices = await serviceService.getServices({ isActive: true });
//       setServices(activeServices);

//       // Auto-select first service for demo purposes
//       if (activeServices.length > 0) {
//         setSelectedService(activeServices[0]);
//       }
//     } catch (error) {
//       console.error('Failed to load services:', error);
//     } finally {
//       setLoadingServices(false);
//     }
//   };

//   const loadAvailableDates = async () => {
//     if (!selectedService || !user) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const dates = await bookingService.getAvailableDates(user.id, selectedService.id);
//       setAvailableDates(dates);

//       // Auto-select first available date
//       if (dates.length > 0) {
//         setSelectedDate(dates[0].date);
//       }
//     } catch (error: any) {
//       setError(error.message || 'Failed to load available dates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAvailableTimeSlots = async () => {
//     if (!selectedService || !selectedDate || !user) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const timeSlots = await bookingService.generateAvailableTimeSlots(
//         user.id,
//         selectedDate,
//         selectedService.duration
//       );
//       setAvailableTimeSlots(timeSlots);

//       // Auto-select first available time slot
//       if (timeSlots.length > 0) {
//         setSelectedTimeSlot(timeSlots[0].startTime);
//       }
//     } catch (error: any) {
//       setError(error.message || 'Failed to load available time slots');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     // Validate current step
//     if (activeStep === 0 && !selectedService) {
//       setError('Please select a service to continue');
//       return;
//     }

//     if (activeStep === 1 && !selectedDate) {
//       setError('Please select a date to continue');
//       return;
//     }

//     if (activeStep === 2 && !selectedTimeSlot) {
//       setError('Please select a time slot to continue');
//       return;
//     }

//     setError(null);

//     if (activeStep === steps.length - 1) {
//       // Submit booking
//       handleSubmitBooking();
//     } else {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     setError(null);
//   };

//   const handleSubmitBooking = async () => {
//     if (!selectedService || !selectedDate || !selectedTimeSlot || !user) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const bookingData = {
//         serviceId: selectedService.id,
//         date: selectedDate,
//         timeSlot: selectedTimeSlot,
//         patientNotes,
//         patientId: user.id,
//         doctorId: '1', // For now, default to first doctor
//       };

//       const appointment = await bookingService.createBooking(bookingData);

//       // Show success message and reset
//       setError('Booking successful! Your appointment has been scheduled.');

//       // Reset form and go to first step
//       setTimeout(() => {
//         setActiveStep(0);
//         setSelectedService(null);
//         setSelectedDate(null);
//         setSelectedTimeSlot(null);
//         setPatientNotes('');
//         setError(null);
//       }, 3000);

//     } catch (error: any) {
//       setError(error.message || 'Failed to book appointment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleServiceSelect = (service: Service) => {
//     setSelectedService(service);
//     setError(null);
//   };

//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//     setError(null);
//   };

//   const handleTimeSlotSelect = (timeSlot: string) => {
//     setSelectedTimeSlot(timeSlot);
//     setError(null);
//   };

//   const renderStepContent = (step: number) => {
//     switch (step) {
//       case 0:
//         return (
//           <ServiceSelectionStep
//             services={services}
//             selectedService={selectedService}
//             onSelectService={handleServiceSelect}
//             loading={loadingServices}
//           />
//         );
//       case 1:
//         return (
//           <DateSelectionStep
//             availableDates={availableDates}
//             selectedDate={selectedDate}
//             onSelectDate={handleDateSelect}
//             loading={loading}
//           />
//         );
//       case 2:
//         return (
//           <TimeSlotStep
//             availableTimeSlots={availableTimeSlots}
//             selectedTimeSlot={selectedTimeSlot}
//             onSelectTimeSlot={handleTimeSlotSelect}
//             loading={loading}
//             selectedDate={selectedDate}
//           />
//         );
//       case 3:
//         return (
//           <ConfirmationStep
//             selectedService={selectedService}
//             selectedDate={selectedDate}
//             selectedTimeSlot={selectedTimeSlot}
//             patientNotes={patientNotes}
//             onNotesChange={setPatientNotes}
//             loading={loading}
//           />
//         );
//       default:
//         return <Typography>Unknown step</Typography>;
//     }
//   };

//   const getStepIcon = (step: number) => {
//     switch (step) {
//       case 0:
//         return <MedicalServicesIcon />;
//       case 1:
//         return <CalendarIcon />;
//       case 2:
//         return <ScheduleIcon />;
//       case 3:
//         return <CheckCircleIcon />;
//       default:
//         return null;
//     }
//   };

//   const getStepTitle = () => {
//     switch (activeStep) {
//       case 0:
//         return 'Select a Service';
//       case 1:
//         return 'Choose a Date';
//       case 2:
//         return 'Pick a Time Slot';
//       case 3:
//         return 'Confirm Your Booking';
//       default:
//         return 'Book Appointment';
//     }
//   };

//   const getStepDescription = () => {
//     switch (activeStep) {
//       case 0:
//         return 'Choose the type of consultation you need';
//       case 1:
//         return 'Select a date when the doctor is available';
//       case 2:
//         return 'Choose your preferred time slot';
//       case 3:
//         return 'Review and confirm your appointment details';
//       default:
//         return '';
//     }
//   };

//   if (loadingServices) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Header */}
//       <Box sx={{ mb: 6, textAlign: 'center' }}>
//         <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
//           Book an Appointment
//         </Typography>
//         <Typography variant="h6" color="text.secondary">
//           Schedule your physiotherapy consultation in just a few steps
//         </Typography>
//       </Box>

//       {/* Progress Stepper */}
//       <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label, index) => (
//             <Step key={label}>
//               <StepLabel
//                 StepIconComponent={() => (
//                   <Box
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: '50%',
//                       bgcolor: activeStep >= index ? 'primary.main' : 'grey.200',
//                       color: activeStep >= index ? 'white' : 'grey.500',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     {activeStep > index ? <CheckCircleIcon /> : getStepIcon(index)}
//                   </Box>
//                 )}
//               >
//                 <Typography
//                   variant="body2"
//                   fontWeight={activeStep === index ? 'bold' : 'normal'}
//                   color={activeStep === index ? 'primary.main' : 'text.secondary'}
//                 >
//                   {label}
//                 </Typography>
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Paper>

//       {/* Current Step Content */}
//       <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
//             {getStepTitle()}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             {getStepDescription()}
//           </Typography>
//         </Box>

//         {error && (
//           <Alert
//             severity={error.includes('successful') ? 'success' : 'error'}
//             sx={{ mb: 3 }}
//             onClose={() => setError(null)}
//           >
//             {error}
//           </Alert>
//         )}

//         {renderStepContent(activeStep)}

//         {/* Navigation Buttons */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
//           <Button
//             disabled={activeStep === 0 || loading}
//             onClick={handleBack}
//             startIcon={<ArrowBackIcon />}
//           >
//             Back
//           </Button>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             {selectedService && activeStep >= 1 && (
//               <Chip
//                 label={`${selectedService.name} - ${selectedService.duration} min`}
//                 color="primary"
//                 variant="outlined"
//                 size="small"
//               />
//             )}

//             <Button
//               variant="contained"
//               onClick={handleNext}
//               disabled={loading}
//               endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
//             >
//               {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : activeStep === steps.length - 1 ? (
//                 'Confirm & Book'
//               ) : (
//                 'Continue'
//               )}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Booking Summary Sidebar (for larger screens) */}
//       <Grid container spacing={4}>
//         <Grid size={{ xs: 12, lg: 8 }}>
//           {/* Step content already rendered above */}
//         </Grid>
//         <Grid size={{ xs: 12, lg: 4 }}>
//           <Card sx={{ position: 'sticky', top: 20 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom fontWeight="bold">
//                 Booking Summary
//               </Typography>

//               <Box sx={{ mt: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                   <Typography variant="body2">
//                     <strong>Patient:</strong> {user?.name}
//                   </Typography>
//                 </Box>

//                 {selectedService && (
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                       Selected Service
//                     </Typography>
//                     <Typography variant="body1" fontWeight="medium">
//                       {selectedService.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {selectedService.duration} min • {selectedService.type.replace('_', ' ')}
//                     </Typography>
//                   </Box>
//                 )}

//                 {selectedDate && (
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                       Selected Date
//                     </Typography>
//                     <Typography variant="body1" fontWeight="medium">
//                       {selectedDate.toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </Typography>
//                   </Box>
//                 )}

//                 {selectedTimeSlot && (
//                   <Box sx={{ mb: 2 }}>
//                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                       Selected Time
//                     </Typography>
//                     <Typography variant="body1" fontWeight="medium">
//                       {selectedTimeSlot}
//                     </Typography>
//                   </Box>
//                 )}

//                 {selectedService && (
//                   <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
//                     <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                       Total Amount
//                     </Typography>
//                     <Typography variant="h5" color="primary.main" fontWeight="bold">
//                       ₹{selectedService.price}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Payment required at the time of service
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default BookAppointment;

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  MedicalServices as MedicalServicesIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added missing import
import ConfirmationStep from '../components/booking/ConfirmationStep';
import DateSelectionStep from '../components/booking/DateSelectionStep';
import ServiceSelectionStep from '../components/booking/ServiceSelectionStep';
import TimeSlotStep from '../components/booking/TimeSlotStep';
import { bookingService } from '../services/bookingService';
import { serviceService } from '../services/serviceConfigurationService';
import { useAppSelector } from '../store/store';
import { Service, UserRole } from '../types';
import { mockStorage } from '../utils/mockStorage'; // Import storage to find doctor
import { AvailableDate, AvailableTimeSlot } from '@/types/booking';

const steps = ['Select Service', 'Choose Date', 'Select Time', 'Confirm Booking'];

const BookAppointment: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate(); // Added hook
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking state
  const [doctorId, setDoctorId] = useState<string>(''); // NEW: Dynamic Doctor ID
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [patientNotes, setPatientNotes] = useState('');

  // Load available services
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // 1. First, find a valid Doctor ID on mount
  useEffect(() => {
    const findDoctor = () => {
      const users = mockStorage.getUsers();
      // Find the first user who is a DOCTOR
      const doc = users.find(u => u.role === UserRole.DOCTOR);
      if (doc) {
        setDoctorId(doc.id);
        console.log("Found Doctor:", doc.name, "ID:", doc.id);
      } else {
        // Fallback if no doctor exists yet
        console.warn("No doctor found in system. Using fallback '1'");
        setDoctorId('1');
      }
    };
    findDoctor();
    loadServices();
  }, []);

  // 2. Load Services
  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const activeServices = await serviceService.getServices({ isActive: true });
      setServices(activeServices);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  // 3. Load Dates when Service is selected (and we have a doctor ID)
  useEffect(() => {
    if (selectedService && doctorId && activeStep >= 1) {
      loadAvailableDates();
    }
  }, [selectedService, doctorId, activeStep]);

  // 4. Load Time Slots
  useEffect(() => {
    if (selectedDate && selectedService && doctorId && activeStep >= 2) {
      loadAvailableTimeSlots();
    }
  }, [selectedDate, activeStep]);

  const loadAvailableDates = async () => {
    if (!selectedService || !user || !doctorId) return;

    try {
      setLoading(true);
      setError(null);
      // Pass the dynamic doctorId here
      const dates = await bookingService.getAvailableDates(doctorId, selectedService.id);
      setAvailableDates(dates);
    } catch (error: any) {
      setError(error.message || 'Failed to load available dates');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTimeSlots = async () => {
    if (!selectedService || !selectedDate || !user || !doctorId) return;

    try {
      setLoading(true);
      setError(null);
      // Pass the dynamic doctorId and ServiceId here
      const timeSlots = await bookingService.generateAvailableTimeSlots(
        doctorId,
        selectedDate,
        selectedService.id, // Ensure serviceId is passed
        selectedService.duration
      );
      setAvailableTimeSlots(timeSlots);
    } catch (error: any) {
      setError(error.message || 'Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setError('Please select a service to continue');
      return;
    }
    if (activeStep === 1 && !selectedDate) {
      setError('Please select a date to continue');
      return;
    }
    if (activeStep === 2 && !selectedTimeSlot) {
      setError('Please select a time slot to continue');
      return;
    }

    setError(null);

    if (activeStep === steps.length - 1) {
      handleSubmitBooking();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !user || !doctorId) return;

    try {
      setLoading(true);
      setError(null);

      await bookingService.createBooking({
        serviceId: selectedService.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientNotes,
        patientId: user.id,
        doctorId: doctorId, // Use the dynamic ID
      });

      // Success!
      alert('Booking successful! Redirecting to dashboard...');
      navigate('/patient/dashboard'); // Use navigate instead of just error message

    } catch (error: any) {
      setError(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // ... (Step Handlers: handleServiceSelect, etc. remain the same) ...
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedDate(null); // Reset downstream selections
    setSelectedTimeSlot(null);
    setError(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setError(null);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setError(null);
  };

  // ... (Render Helpers: renderStepContent, getStepIcon, etc. remain the same) ...
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ServiceSelectionStep
            services={services}
            selectedService={selectedService}
            onSelectService={handleServiceSelect}
            loading={loadingServices}
          />
        );
      case 1:
        return (
          <DateSelectionStep
            doctorId={doctorId} // Pass correct ID
            serviceId={selectedService?.id || ''}
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
          />
        );
      case 2:
        return (
          <TimeSlotStep
            doctorId={doctorId} // Pass correct ID
            date={selectedDate!}
            serviceDuration={selectedService?.duration || 30}
            selectedTime={selectedTimeSlot || ''}
            onSelect={handleTimeSlotSelect}
            serviceId={selectedService?.id || ''}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            patientNotes={patientNotes}
            onNotesChange={setPatientNotes}
            loading={loading}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  // ... (Icon helpers remain the same) ...
  const getStepIcon = (step: number) => {
    switch (step) {
      case 0: return <MedicalServicesIcon />;
      case 1: return <CalendarIcon />;
      case 2: return <ScheduleIcon />;
      case 3: return <CheckCircleIcon />;
      default: return null;
    }
  };

  if (loadingServices) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Book an Appointment
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Schedule your consultation with {services.length > 0 ? "Dr. Lakhi Shaw" : "our doctors"}
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={() => (
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%',
                  bgcolor: activeStep >= index ? 'primary.main' : 'grey.200',
                  color: activeStep >= index ? 'white' : 'grey.500',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {activeStep > index ? <CheckCircleIcon /> : getStepIcon(index)}
                </Box>
              )}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Content */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Confirm & Book' : 'Continue'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointment;