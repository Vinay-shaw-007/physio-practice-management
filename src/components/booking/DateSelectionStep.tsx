import {
    EventAvailable as EventAvailableIcon,
    EventBusy as EventBusyIcon,
    Today as TodayIcon,
    Weekend as WeekendIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';
import { format, isSameDay, isToday, isWeekend } from 'date-fns';
import React from 'react';
import { AvailableDate } from '../../services/bookingService';

interface DateSelectionStepProps {
    availableDates: AvailableDate[];
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    loading: boolean;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
    availableDates,
    selectedDate,
    onSelectDate,
    loading,
}) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (availableDates.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <EventBusyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No available dates in the next 30 days
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    The doctor might be on vacation or fully booked. Please try a different service or contact the clinic directly.
                </Typography>
            </Box>
        );
    }

    // Group dates by week for better organization
    const groupDatesByWeek = () => {
        const groups: { title: string; dates: AvailableDate[] }[] = [];
        let currentWeek: AvailableDate[] = [];
        let weekStartDate: Date | null = null;

        availableDates.forEach((dateObj, index) => {
            const date = dateObj.date;

            if (index === 0 || Math.floor((date.getTime() - availableDates[index - 1].date.getTime()) / (1000 * 60 * 60 * 24)) > 1) {
                if (currentWeek.length > 0) {
                    groups.push({
                        title: weekStartDate ? format(weekStartDate, 'MMM d') + ' - ' + format(currentWeek[currentWeek.length - 1].date, 'MMM d') : 'This Week',
                        dates: [...currentWeek],
                    });
                }
                currentWeek = [];
                weekStartDate = date;
            }

            currentWeek.push(dateObj);
        });

        if (currentWeek.length > 0) {
            groups.push({
                title: weekStartDate ? format(weekStartDate, 'MMM d') + ' - ' + format(currentWeek[currentWeek.length - 1].date, 'MMM d') : 'This Week',
                dates: [...currentWeek],
            });
        }

        return groups;
    };

    const dateGroups = groupDatesByWeek();

    const getDateStatus = (dateObj: AvailableDate) => {
        if (dateObj.availableSlots === 0) return 'none';
        if (dateObj.availableSlots <= 2) return 'low';
        if (dateObj.availableSlots <= 5) return 'medium';
        return 'high';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'high':
                return { bg: '#10b98120', color: '#10b981', label: 'Many slots' };
            case 'medium':
                return { bg: '#f59e0b20', color: '#f59e0b', label: 'Limited slots' };
            case 'low':
                return { bg: '#ef444420', color: '#ef4444', label: 'Few slots' };
            default:
                return { bg: '#64748b20', color: '#64748b', label: 'No slots' };
        }
    };

    const isDateSelected = (date: Date) => {
        return selectedDate && isSameDay(date, selectedDate);
    };

    return (
        <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Select a date when the doctor is available. Dates with more slots are recommended for better availability.
            </Typography>

            {dateGroups.map((group, groupIndex) => (
                <Box key={groupIndex} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ mb: 2, color: 'primary.main' }}>
                        {group.title}
                    </Typography>

                    <Grid container spacing={2}>
                        {group.dates.map((dateObj) => {
                            const status = getDateStatus(dateObj);
                            const statusColor = getStatusColor(status);
                            const date = dateObj.date;
                            const isCurrentDay = isToday(date);

                            return (
                                <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={date.toString()}>
                                    <Tooltip
                                        title={
                                            <Box>
                                                <Typography variant="caption" fontWeight="bold">{format(date, 'EEEE, MMMM d, yyyy')}</Typography>
                                                <Typography variant="caption" display="block">
                                                    {dateObj.availableSlots} available slot{dateObj.availableSlots !== 1 ? 's' : ''}
                                                </Typography>
                                                {isCurrentDay && <Typography variant="caption" display="block">Today</Typography>}
                                            </Box>
                                        }
                                        arrow
                                    >
                                        <Card
                                            onClick={() => onSelectDate(date)}
                                            sx={{
                                                cursor: status === 'none' ? 'not-allowed' : 'pointer',
                                                opacity: status === 'none' ? 0.5 : 1,
                                                border: isDateSelected(date) ? '2px solid #3b82f6' : `1px solid ${statusColor.color}`,
                                                borderRadius: 2,
                                                transition: 'all 0.2s',
                                                '&:hover': status !== 'none' ? {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4,
                                                    borderColor: '#3b82f6',
                                                } : {},
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, flexGrow: 1, textAlign: 'center' }}>
                                                {/* Day of Week */}
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {format(date, 'EEE')}
                                                </Typography>

                                                {/* Date Number */}
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: isCurrentDay ? 'primary.main' : 'text.primary',
                                                    }}
                                                >
                                                    {format(date, 'd')}
                                                </Typography>

                                                {/* Month */}
                                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                    {format(date, 'MMM')}
                                                </Typography>

                                                {/* Status Indicator */}
                                                <Box sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    {status !== 'none' ? (
                                                        <>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5
                                                            }}>
                                                                <EventAvailableIcon sx={{ fontSize: 14, color: statusColor.color }} />
                                                                <Typography variant="caption" fontWeight="medium" color={statusColor.color}>
                                                                    {dateObj.availableSlots} slot{dateObj.availableSlots !== 1 ? 's' : ''}
                                                                </Typography>
                                                            </Box>

                                                            {/* Availability dots */}
                                                            <Box sx={{ display: 'flex', gap: 0.25 }}>
                                                                {[...Array(3)].map((_, i) => (
                                                                    <Box
                                                                        key={i}
                                                                        sx={{
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: '50%',
                                                                            bgcolor: i < (status === 'high' ? 3 : status === 'medium' ? 2 : 1)
                                                                                ? statusColor.color
                                                                                : 'grey.200',
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        </>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                                            Fully booked
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </CardContent>

                                            {/* Bottom Indicators */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 1,
                                                p: 1,
                                                borderTop: 1,
                                                borderColor: 'divider',
                                                bgcolor: 'grey.50'
                                            }}>
                                                {isCurrentDay && (
                                                    <Chip
                                                        size="small"
                                                        label="Today"
                                                        icon={<TodayIcon />}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                )}
                                                {isWeekend(date) && !isCurrentDay && (
                                                    <Chip
                                                        size="small"
                                                        label="Weekend"
                                                        icon={<WeekendIcon />}
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </Card>
                                    </Tooltip>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}

            {/* Legend */}
            <Box sx={{
                mt: 4,
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Availability Legend
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#10b981',
                                border: '2px solid #10b981'
                            }} />
                            <Typography variant="body2">Many slots (5+)</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#f59e0b',
                                border: '2px solid #f59e0b'
                            }} />
                            <Typography variant="body2">Limited (3-5 slots)</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#ef4444',
                                border: '2px solid #ef4444'
                            }} />
                            <Typography variant="body2">Few slots (1-2)</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: 'grey.300',
                                border: '2px solid grey.300'
                            }} />
                            <Typography variant="body2">Fully booked</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary">
                    • Dates are shown for the next 30 days only
                    <br />
                    • Weekends may have limited availability
                    <br />
                    • Slots are updated in real-time as others book
                    <br />
                    • Select a date with more slots for better flexibility
                </Typography>
            </Box>
        </Box>
    );
};

export default DateSelectionStep;