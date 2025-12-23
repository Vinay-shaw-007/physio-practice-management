// import {
//   ArrowBack as ArrowBackIcon,
//   ArrowForward as ArrowForwardIcon,
//   CalendarMonth as CalendarIcon,
//   CheckCircle as CheckCircleIcon,
//   MedicalServices as MedicalServicesIcon,
//   Schedule as ScheduleIcon
// } from '@mui/icons-material';
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   Paper,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Added missing import
// import ConfirmationStep from '../components/booking/ConfirmationStep';
// import DateSelectionStep from '../components/booking/DateSelectionStep';
// import ServiceSelectionStep from '../components/booking/ServiceSelectionStep';
// import TimeSlotStep from '../components/booking/TimeSlotStep';
// import { bookingService } from '../services/bookingService';
// import { serviceService } from '../services/serviceConfigurationService';
// import { useAppSelector } from '../store/store';
// import { Service, UserRole } from '../types';
// import { mockStorage } from '../utils/mockStorage'; // Import storage to find doctor
// import { AvailableDate, AvailableTimeSlot } from '@/types/booking';

// const steps = ['Select Service', 'Choose Date', 'Select Time', 'Confirm Booking'];

// const BookAppointment: React.FC = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const navigate = useNavigate(); // Added hook
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Booking state
//   const [doctorId, setDoctorId] = useState<string>(''); // NEW: Dynamic Doctor ID
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
//   const [patientNotes, setPatientNotes] = useState('');

//   // Load available services
//   const [services, setServices] = useState<Service[]>([]);
//   const [loadingServices, setLoadingServices] = useState(true);

//   // 1. First, find a valid Doctor ID on mount
//   useEffect(() => {
//     const findDoctor = () => {
//       const users = mockStorage.getUsers();
//       // Find the first user who is a DOCTOR
//       const doc = users.find(u => u.role === UserRole.DOCTOR);
//       if (doc) {
//         setDoctorId(doc.id);
//         console.log("Found Doctor:", doc.name, "ID:", doc.id);
//       } else {
//         // Fallback if no doctor exists yet
//         console.warn("No doctor found in system. Using fallback '1'");
//         setDoctorId('1');
//       }
//     };
//     findDoctor();
//     loadServices();
//   }, []);

//   // 2. Load Services
//   const loadServices = async () => {
//     try {
//       setLoadingServices(true);
//       const activeServices = await serviceService.getServices({ isActive: true });
//       setServices(activeServices);
//     } catch (error) {
//       console.error('Failed to load services:', error);
//     } finally {
//       setLoadingServices(false);
//     }
//   };

//   // 3. Load Dates when Service is selected (and we have a doctor ID)
//   useEffect(() => {
//     if (selectedService && doctorId && activeStep >= 1) {
//       loadAvailableDates();
//     }
//   }, [selectedService, doctorId, activeStep]);

//   // 4. Load Time Slots
//   useEffect(() => {
//     if (selectedDate && selectedService && doctorId && activeStep >= 2) {
//       loadAvailableTimeSlots();
//     }
//   }, [selectedDate, activeStep]);

//   const loadAvailableDates = async () => {
//     if (!selectedService || !user || !doctorId) return;

//     try {
//       setLoading(true);
//       setError(null);
//       // Pass the dynamic doctorId here
//       const dates = await bookingService.getAvailableDates(doctorId, selectedService.id);
//       setAvailableDates(dates);
//     } catch (error: any) {
//       setError(error.message || 'Failed to load available dates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAvailableTimeSlots = async () => {
//     if (!selectedService || !selectedDate || !user || !doctorId) return;

//     try {
//       setLoading(true);
//       setError(null);
//       // Pass the dynamic doctorId and ServiceId here
//       const timeSlots = await bookingService.generateAvailableTimeSlots(
//         doctorId,
//         selectedDate,
//         selectedService.id, // Ensure serviceId is passed
//         selectedService.duration
//       );
//       setAvailableTimeSlots(timeSlots);
//     } catch (error: any) {
//       setError(error.message || 'Failed to load available time slots');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
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
//       handleSubmitBooking();
//     } else {
//       setActiveStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//     setError(null);
//   };

//   const handleSubmitBooking = async () => {
//     if (!selectedService || !selectedDate || !selectedTimeSlot || !user || !doctorId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       await bookingService.createBooking({
//         serviceId: selectedService.id,
//         date: selectedDate,
//         timeSlot: selectedTimeSlot,
//         patientNotes,
//         patientId: user.id,
//         doctorId: doctorId, // Use the dynamic ID
//       });

//       // Success!
//       alert('Booking successful! Redirecting to dashboard...');
//       navigate('/patient/dashboard'); // Use navigate instead of just error message

//     } catch (error: any) {
//       setError(error.message || 'Failed to book appointment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... (Step Handlers: handleServiceSelect, etc. remain the same) ...
//   const handleServiceSelect = (service: Service) => {
//     setSelectedService(service);
//     setSelectedDate(null); // Reset downstream selections
//     setSelectedTimeSlot(null);
//     setError(null);
//   };

//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//     setSelectedTimeSlot(null);
//     setError(null);
//   };

//   const handleTimeSlotSelect = (timeSlot: string) => {
//     setSelectedTimeSlot(timeSlot);
//     setError(null);
//   };

//   // ... (Render Helpers: renderStepContent, getStepIcon, etc. remain the same) ...
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
//             doctorId={doctorId} // Pass correct ID
//             serviceId={selectedService?.id || ''}
//             selectedDate={selectedDate}
//             onSelect={handleDateSelect}
//           />
//         );
//       case 2:
//         return (
//           <TimeSlotStep
//             doctorId={doctorId} // Pass correct ID
//             date={selectedDate!}
//             serviceDuration={selectedService?.duration || 30}
//             selectedTime={selectedTimeSlot || ''}
//             onSelect={handleTimeSlotSelect}
//             serviceId={selectedService?.id || ''}
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

//   // ... (Icon helpers remain the same) ...
//   const getStepIcon = (step: number) => {
//     switch (step) {
//       case 0: return <MedicalServicesIcon />;
//       case 1: return <CalendarIcon />;
//       case 2: return <ScheduleIcon />;
//       case 3: return <CheckCircleIcon />;
//       default: return null;
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
//           Schedule your consultation with {services.length > 0 ? "Dr. Lakhi Shaw" : "our doctors"}
//         </Typography>
//       </Box>

//       {/* Stepper */}
//       <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label, index) => (
//             <Step key={label}>
//               <StepLabel StepIconComponent={() => (
//                 <Box sx={{
//                   width: 40, height: 40, borderRadius: '50%',
//                   bgcolor: activeStep >= index ? 'primary.main' : 'grey.200',
//                   color: activeStep >= index ? 'white' : 'grey.500',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
//                 }}>
//                   {activeStep > index ? <CheckCircleIcon /> : getStepIcon(index)}
//                 </Box>
//               )}>
//                 {label}
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Paper>

//       {/* Content */}
//       <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
//         {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

//         {renderStepContent(activeStep)}

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
//           <Button disabled={activeStep === 0 || loading} onClick={handleBack} startIcon={<ArrowBackIcon />}>
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleNext}
//             disabled={loading}
//             endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Confirm & Book' : 'Continue'}
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default BookAppointment;

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationStep from '../components/booking/ConfirmationStep';
import DateSelectionStep from '../components/booking/DateSelectionStep';
import DoctorSelectionStep from '../components/booking/DoctorSelectionStep';
import ServiceSelectionStep from '../components/booking/ServiceSelectionStep';
import TimeSlotStep from '../components/booking/TimeSlotStep';
import { doctorService } from '../services/doctorService';
import { serviceService } from '../services/serviceConfigurationService';
import { useAppSelector } from '../store/store';
import { Doctor, Service } from '../types';
import { bookingService } from '@/services/bookingService';
import { AvailableDate, AvailableTimeSlot } from '@/types/booking';

const STEPS = ['Select Service', 'Choose Doctor', 'Choose Date', 'Select Time', 'Confirm'];

const BookAppointment: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [patientNotes, setPatientNotes] = useState('');

  // 1. Load Services
  useEffect(() => {
    const loadServices = async () => {
      try {
        // FIX 1: Changed getAllServices -> getServices
        const data = await serviceService.getServices({ isActive: true });
        setServices(data);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };
    loadServices();
  }, []);

  // 2. Load Dates
  useEffect(() => {
    if (activeStep === 2 && selectedService) {
      loadDates();
    }
  }, [activeStep, selectedService, selectedDoctor]);

  // 3. Load Times
  useEffect(() => {
    if (activeStep === 3 && selectedDate) {
      loadTimes();
    }
  }, [activeStep, selectedDate]);

  const loadDates = async () => {
    if (!selectedService || !user) return;
    setLoading(true);
    try {
      let targetDoctorId = selectedDoctor?.id;
      if (!targetDoctorId) {
        const docs = await doctorService.getDoctorsByService(selectedService.id);
        if (docs.length > 0) targetDoctorId = docs[0].id;
        else throw new Error("No doctors available for this service.");
      }
      const dates = await bookingService.getAvailableDates(targetDoctorId!, selectedService.id);
      setAvailableDates(dates);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTimes = async () => {
    if (!selectedService || !selectedDate || !user) return;
    setLoading(true);
    try {
      let targetDoctorId = selectedDoctor?.id;
      if (!targetDoctorId) {
        const docs = await doctorService.getDoctorsByService(selectedService.id);
        if (docs.length > 0) targetDoctorId = docs[0].id;
      }
      const slots = await bookingService.generateAvailableTimeSlots(
        targetDoctorId!,
        selectedDate,
        selectedService.id,
        selectedService.duration
      );
      setAvailableTimeSlots(slots);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError(null);
    if (activeStep === 0 && !selectedService) return setError("Please select a service.");
    if (activeStep === 2 && !selectedDate) return setError("Please select a date.");
    if (activeStep === 3 && !selectedTimeSlot) return setError("Please select a time.");

    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTimeSlot) return;
    setLoading(true);
    try {
      let finalDoctorId = selectedDoctor?.id;
      if (!finalDoctorId) {
        const docs = await doctorService.getDoctorsByService(selectedService.id);
        finalDoctorId = docs[0]?.id || '1';
      }

      await bookingService.createBooking({
        patientId: user.id,
        doctorId: finalDoctorId,
        serviceId: selectedService.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientNotes: patientNotes
      });

      navigate('/patient/appointments');
    } catch (err: any) {
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ServiceSelectionStep
            services={services}
            selectedService={selectedService}
            onSelectService={setSelectedService}
            loading={loading}
          />
        );
      case 1:
        return (
          <DoctorSelectionStep
            serviceId={selectedService?.id || ''}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
          />
        );
      case 2:
        return (
          // FIX 2: Updated props to match the new Presentational Component
          <DateSelectionStep
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            loading={loading}
          />
        );
      case 3:
        return (
          // FIX 3: Updated props to match the new Presentational Component
          <TimeSlotStep
            availableTimeSlots={availableTimeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
            loading={loading}
            date={selectedDate!}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            patientNotes={patientNotes}
            onNotesChange={setPatientNotes}
            loading={loading}
            // FIX 4: Passed missing doctorName prop
            doctorName={selectedDoctor?.name || 'Any Available Doctor'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>Book Appointment</Typography>
        <Typography variant="h6" color="text.secondary">Follow the steps to schedule your visit</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 4, minHeight: 400 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={() => setActiveStep(prev => prev - 1)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {selectedService && activeStep > 0 && (
              <Chip label={selectedService.name} color="primary" variant="outlined" />
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={activeStep === STEPS.length - 1 ? null : <ArrowForwardIcon />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === STEPS.length - 1 ? 'Confirm & Book' : 'Continue'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointment;