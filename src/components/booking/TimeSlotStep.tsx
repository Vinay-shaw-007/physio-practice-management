// import {
//     Box,
//     Button,
//     CircularProgress,
//     Grid,
//     Typography,
//     Alert
// } from '@mui/material';
// import { format } from 'date-fns';
// import React, { useEffect, useState } from 'react';
// import { bookingService, AvailableTimeSlot } from '../../services/bookingService';
// import { AccessTime as TimeIcon } from '@mui/icons-material';

// interface TimeSlotStepProps {
//     doctorId: string;
//     date: Date;
//     serviceDuration: number;
//     selectedTime: string;
//     onSelect: (time: string) => void;
// }

// const TimeSlotStep: React.FC<TimeSlotStepProps> = ({
//     doctorId,
//     date,
//     serviceDuration,
//     selectedTime,
//     onSelect
// }) => {
//     const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let isMounted = true; // prevent setting state on unmounted component

//         const loadSlots = async () => {
//             setLoading(true);
//             try {
//                 const availableSlots = await bookingService.generateAvailableTimeSlots(
//                     doctorId,
//                     date,
//                     serviceDuration
//                 );
//                 if (isMounted) {
//                     setSlots(availableSlots);
//                 }
//             } catch (error) {
//                 console.error('Failed to load slots', error);
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };
//         loadSlots();

//         return () => { isMounted = false; };

//         // FIX: Use date.getTime() to compare primitive values, avoiding infinite loops
//     }, [doctorId, date.getTime(), serviceDuration]);

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (slots.length === 0) {
//         return (
//             <Box sx={{ textAlign: 'center', py: 4 }}>
//                 <Alert severity="warning" sx={{ maxWidth: 400, mx: 'auto' }}>
//                     No available slots for this date. Please try another day.
//                 </Alert>
//             </Box>
//         );
//     }

//     return (
//         <Box>
//             <Typography variant="h6" gutterBottom align="center" sx={{ mb: 1 }}>
//                 Available Time Slots
//             </Typography>
//             <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
//                 {format(date, 'EEEE, MMMM d, yyyy')}
//             </Typography>

//             <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800, mx: 'auto' }}>
//                 {slots.map((slot) => (
//                     <Grid size={{ xs: 6, sm: 4, md: 3}} key={slot.startTime}>
//                         <Button
//                             variant={selectedTime === slot.startTime ? 'contained' : 'outlined'}
//                             color="primary"
//                             fullWidth
//                             onClick={() => onSelect(slot.startTime)}
//                             startIcon={<TimeIcon />}
//                             sx={{
//                                 py: 1.5,
//                                 borderRadius: 2,
//                                 borderWidth: selectedTime === slot.startTime ? 0 : 1
//                             }}
//                         >
//                             {slot.startTime}
//                         </Button>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     );
// };

// export default TimeSlotStep;
import { AccessTime as TimeIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { AvailableTimeSlot } from '@/types/booking';

interface TimeSlotStepProps {
    doctorId: string;
    date: Date;
    serviceDuration: number;
    selectedTime: string;
    onSelect: (time: string) => void;
    serviceId: string; // NEW PROP
}

const TimeSlotStep: React.FC<TimeSlotStepProps> = ({
    doctorId,
    date,
    serviceDuration,
    selectedTime,
    onSelect,
    serviceId // Receive it here
}) => {
    const [slots, setSlots] = useState<AvailableTimeSlot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadSlots = async () => {
            setLoading(true);
            try {
                // Pass serviceId to the generator
                const availableSlots = await bookingService.generateAvailableTimeSlots(
                    doctorId,
                    date,
                    serviceId,
                    serviceDuration
                );
                if (isMounted) {
                    setSlots(availableSlots);
                }
            } catch (error) {
                console.error('Failed to load slots', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadSlots();

        return () => { isMounted = false; };

    }, [doctorId, date.getTime(), serviceDuration, serviceId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (slots.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Alert severity="warning" sx={{ maxWidth: 400, mx: 'auto' }}>
                    No available slots for this date. Please try another day.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 1 }}>
                Available Time Slots
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                {format(date, 'EEEE, MMMM d, yyyy')}
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800, mx: 'auto' }}>
                {slots.map((slot) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot.startTime}>
                        <Button
                            variant={selectedTime === slot.startTime ? 'contained' : 'outlined'}
                            color="primary"
                            fullWidth
                            onClick={() => onSelect(slot.startTime)}
                            startIcon={<TimeIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                borderWidth: selectedTime === slot.startTime ? 0 : 1
                            }}
                        >
                            {slot.startTime}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TimeSlotStep;