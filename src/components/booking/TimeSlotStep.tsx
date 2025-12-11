import {
    AccessTime as AccessTimeIcon,
    WbSunny as AfternoonIcon,
    NightsStay as EveningIcon,
    Brightness5 as MorningIcon,
    Schedule as ScheduleIcon,
    Today as TodayIcon,
    WatchLater as WatchLaterIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { format, isToday } from 'date-fns';
import React, { useState } from 'react';
import { AvailableTimeSlot } from '../../services/bookingService';

interface TimeSlotStepProps {
    availableTimeSlots: AvailableTimeSlot[];
    selectedTimeSlot: string | null;
    onSelectTimeSlot: (timeSlot: string) => void;
    loading: boolean;
    selectedDate: Date | null;
}

type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';

const TimeSlotStep: React.FC<TimeSlotStepProps> = ({
    availableTimeSlots,
    selectedTimeSlot,
    onSelectTimeSlot,
    loading,
    selectedDate,
}) => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!selectedDate) {
        return (
            <Alert severity="warning">
                Please select a date first.
            </Alert>
        );
    }

    if (availableTimeSlots.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <AccessTimeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No available time slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    All slots for this date are currently booked. Please try a different date or check back later for cancellations.
                </Typography>
            </Box>
        );
    }

    // Categorize time slots
    const categorizeTimeSlot = (timeSlot: AvailableTimeSlot): TimeFilter => {
        const hour = parseInt(timeSlot.startTime.split(':')[0]);
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    };

    const getFilteredTimeSlots = () => {
        if (timeFilter === 'all') return availableTimeSlots;
        return availableTimeSlots.filter(slot => categorizeTimeSlot(slot) === timeFilter);
    };

    const getTimeFilterIcon = (filter: TimeFilter) => {
        switch (filter) {
            case 'morning':
                return <MorningIcon />;
            case 'afternoon':
                return <AfternoonIcon />;
            case 'evening':
                return <EveningIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const getTimeFilterLabel = (filter: TimeFilter) => {
        switch (filter) {
            case 'morning':
                return 'Morning (Before 12 PM)';
            case 'afternoon':
                return 'Afternoon (12 PM - 5 PM)';
            case 'evening':
                return 'Evening (After 5 PM)';
            default:
                return 'All Times';
        }
    };

    const filteredSlots = getFilteredTimeSlots();

    // Group slots by hour for better display
    const groupSlotsByHour = () => {
        const groups: { hour: number; slots: AvailableTimeSlot[] }[] = [];

        filteredSlots.forEach(slot => {
            const hour = parseInt(slot.startTime.split(':')[0]);
            const existingGroup = groups.find(g => g.hour === hour);

            if (existingGroup) {
                existingGroup.slots.push(slot);
            } else {
                groups.push({ hour, slots: [slot] });
            }
        });

        return groups.sort((a, b) => a.hour - b.hour);
    };

    const hourGroups = groupSlotsByHour();

    const formatHourLabel = (hour: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour} ${ampm}`;
    };

    const isTodayDate = isToday(selectedDate);

    return (
        <Box>
            {/* Date Header */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'primary.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <Typography variant="h5" fontWeight="bold">
                                {format(selectedDate, 'd')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                {isTodayDate && (
                                    <Chip
                                        size="small"
                                        label="Today"
                                        icon={<TodayIcon />}
                                        color="primary"
                                        variant="filled"
                                    />
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {availableTimeSlots.length} available slot{availableTimeSlots.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Chip
                        icon={<WatchLaterIcon />}
                        label="Slots fill quickly!"
                        color="warning"
                        variant="outlined"
                    />
                </Box>
            </Paper>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Select your preferred time slot. All slots are {isTodayDate ? 'for today' : 'for'} {format(selectedDate, 'MMMM d')}.
            </Typography>

            {/* Time Filter */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Filter by Time of Day
                </Typography>
                <ToggleButtonGroup
                    value={timeFilter}
                    exclusive
                    onChange={(_, newFilter) => newFilter && setTimeFilter(newFilter)}
                    aria-label="time filter"
                    sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                    {(['all', 'morning', 'afternoon', 'evening'] as TimeFilter[]).map((filter) => (
                        <ToggleButton
                            key={filter}
                            value={filter}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                border: 1,
                                borderColor: timeFilter === filter ? 'primary.main' : 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getTimeFilterIcon(filter)}
                                {getTimeFilterLabel(filter)}
                            </Box>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {/* Time Slots Grid */}
            {hourGroups.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No time slots available for the selected filter. Try selecting a different time of day.
                </Alert>
            ) : (
                <Box>
                    {hourGroups.map((group, index) => (
                        <Box key={group.hour} sx={{ mb: index < hourGroups.length - 1 ? 4 : 0 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                                {formatHourLabel(group.hour)}
                            </Typography>

                            <Grid container spacing={2}>
                                {group.slots.map((slot) => {
                                    const isSelected = selectedTimeSlot === slot.startTime;
                                    const isPopular = group.slots.indexOf(slot) < 2; // Mark first two slots as popular

                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={slot.startTime}>
                                            <Button
                                                fullWidth
                                                variant={isSelected ? 'contained' : 'outlined'}
                                                onClick={() => onSelectTimeSlot(slot.startTime)}
                                                sx={{
                                                    py: 2.5,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    borderWidth: isPopular && !isSelected ? 2 : 1,
                                                    borderColor: isPopular && !isSelected ? 'warning.main' : undefined,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 2,
                                                    },
                                                }}
                                            >
                                                {isPopular && !isSelected && (
                                                    <Chip
                                                        size="small"
                                                        label="Popular"
                                                        color="warning"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -10,
                                                            right: -5,
                                                            fontSize: '0.65rem',
                                                        }}
                                                    />
                                                )}

                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 1
                                                }}>
                                                    <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {slot.displayTime.split(' - ')[0].split(' ')[0]}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                        {slot.displayTime.split(' - ')[0].split(' ')[1]}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary">
                                                    to {slot.displayTime.split(' - ')[1]}
                                                </Typography>

                                                {isSelected && (
                                                    <Chip
                                                        size="small"
                                                        label="Selected"
                                                        color="success"
                                                        sx={{ mt: 1 }}
                                                    />
                                                )}
                                            </Button>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Additional Information */}
            <Box sx={{
                mt: 4,
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
            }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Time Slot Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'warning.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                            }}>
                                <WatchLaterIcon />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                    Arrival Time
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Please arrive 10-15 minutes before your scheduled time for check-in and preparation.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'error.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                            }}>
                                <AccessTimeIcon />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                    Cancellation Policy
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    You can cancel or reschedule up to 24 hours before your appointment without any charges.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                    • Morning slots (before 12 PM) are typically less crowded
                    <br />
                    • Afternoon slots (12 PM - 5 PM) are the most popular
                    <br />
                    • Evening slots (after 5 PM) are perfect for after-work appointments
                    <br />
                    • Popular slots are marked with a yellow border
                    <br />
                    • All times are in your local time zone
                </Typography>
            </Box>
        </Box>
    );
};

export default TimeSlotStep;