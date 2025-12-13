// import {
//     Box,
//     CircularProgress,
//     Grid,
//     Paper,
//     Typography
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { format, isSameDay } from 'date-fns';
// import React, { useEffect, useState } from 'react';
// import { AvailableDate, bookingService } from '../../services/bookingService';

// interface DateSelectionStepProps {
//     doctorId: string;
//     serviceId: string;
//     selectedDate: Date | null;
//     onSelect: (date: Date) => void;
// }

// const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
//     doctorId,
//     serviceId,
//     selectedDate,
//     onSelect
// }) => {
//     const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let isMounted = true;
//         const loadDates = async () => {
//             try {
//                 const dates = await bookingService.getAvailableDates(doctorId, serviceId);
//                 if (isMounted) setAvailableDates(dates);
//             } catch (error) {
//                 console.error('Failed to load dates', error);
//             } finally {
//                 if (isMounted) setLoading(false);
//             }
//         };
//         loadDates();
//         return () => { isMounted = false; };
//     }, [doctorId, serviceId]); // Strings are safe dependencies

//     // Check if a specific date is in our available list
//     const isDateAvailable = (date: Date) => {
//         return availableDates.some(d => isSameDay(d.date, date));
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//                 Choose a Date
//             </Typography>

//             <Grid container spacing={4} justifyContent="center">
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Paper variant="outlined" sx={{ p: 2 }}>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                             <DateCalendar
//                                 value={selectedDate}
//                                 onChange={(newValue) => newValue && onSelect(newValue)}
//                                 shouldDisableDate={(date) => !isDateAvailable(date)}
//                                 disablePast
//                             />
//                         </LocalizationProvider>
//                     </Paper>
//                 </Grid>

//                 <Grid size={{ xs: 12, md: 4 }}>
//                     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                         {selectedDate ? (
//                             <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
//                                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                                     Selected Date
//                                 </Typography>
//                                 <Typography variant="h4" color="primary.main" fontWeight="bold">
//                                     {format(selectedDate, 'd')}
//                                 </Typography>
//                                 <Typography variant="h6" gutterBottom>
//                                     {format(selectedDate, 'MMMM yyyy')}
//                                 </Typography>
//                                 <Typography variant="body1" color="text.secondary">
//                                     {format(selectedDate, 'EEEE')}
//                                 </Typography>
//                             </Box>
//                         ) : (
//                             <Typography color="text.secondary" align="center">
//                                 Please select a date from the calendar to proceed.
//                             </Typography>
//                         )}
//                     </Box>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default DateSelectionStep;

import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import {
    alpha,
    Box,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isSameDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { AvailableDate, bookingService } from '../../services/bookingService';

interface DateSelectionStepProps {
    doctorId: string;
    serviceId: string;
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
    doctorId,
    serviceId,
    selectedDate,
    onSelect
}) => {
    const theme = useTheme();
    const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadDates = async () => {
            try {
                const dates = await bookingService.getAvailableDates(doctorId, serviceId);
                if (isMounted) {
                    setAvailableDates(dates);
                }
            } catch (error) {
                console.error('Failed to load dates', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadDates();

        return () => { isMounted = false; };
    }, [doctorId, serviceId]);

    // Check if a specific date is in our available list
    const isDateAvailable = (date: Date) => {
        return availableDates.some(d => isSameDay(d.date, date));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
                Select a Date
            </Typography>

            <Grid container spacing={4} alignItems="center" justifyContent="center">
                {/* Left Side: Calendar */}
                <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            maxWidth: 360,
                            width: '100%'
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={(newValue) => newValue && onSelect(newValue)}
                                shouldDisableDate={(date) => !isDateAvailable(date)}
                                disablePast
                                sx={{
                                    width: '100%',
                                    '& .MuiPickersDay-root.Mui-selected': {
                                        backgroundColor: theme.palette.primary.main,
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>

                {/* Right Side: Selected Date Details */}
                <Grid size={{xs: 12, md: 4}}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {selectedDate ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    textAlign: 'center',
                                    p: 4,
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={1}>
                                    SELECTED DATE
                                </Typography>
                                <Typography variant="h2" color="primary.main" fontWeight="bold" sx={{ my: 1 }}>
                                    {format(selectedDate, 'd')}
                                </Typography>
                                <Typography variant="h5" fontWeight="medium" gutterBottom>
                                    {format(selectedDate, 'MMMM yyyy')}
                                </Typography>
                                <Chip
                                    label={format(selectedDate, 'EEEE')}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mt: 1, fontWeight: 'bold' }}
                                />
                            </Paper>
                        ) : (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    borderStyle: 'dashed',
                                    borderRadius: 3,
                                    bgcolor: 'transparent'
                                }}
                            >
                                <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="body1" color="text.secondary">
                                    Please select an available date from the calendar to proceed.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DateSelectionStep;