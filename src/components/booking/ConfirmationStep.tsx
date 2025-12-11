import {
    AccessTime as AccessTimeIcon,
    CalendarMonth as CalendarIcon,
    LocalHospital as ClinicIcon,
    Home as HomeIcon,
    MedicalServices as MedicalServicesIcon,
    Note as NoteIcon,
    Paid as PaidIcon,
    Person as PersonIcon,
    Verified as VerifiedIcon,
    Videocam as VideoIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { Service, ServiceType } from '../../types';

interface ConfirmationStepProps {
    selectedService: Service | null;
    selectedDate: Date | null;
    selectedTimeSlot: string | null;
    patientNotes: string;
    onNotesChange: (notes: string) => void;
    loading: boolean;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const getServiceIcon = (type: ServiceType) => {
    switch (type) {
        case ServiceType.CLINIC_VISIT:
            return <ClinicIcon />;
        case ServiceType.HOME_VISIT:
            return <HomeIcon />;
        case ServiceType.VIDEO_CONSULT:
            return <VideoIcon />;
        default:
            return <MedicalServicesIcon />;
    }
};

const getServiceColor = (type: ServiceType) => {
    switch (type) {
        case ServiceType.CLINIC_VISIT:
            return '#3b82f6';
        case ServiceType.HOME_VISIT:
            return '#8b5cf6';
        case ServiceType.VIDEO_CONSULT:
            return '#06b6d4';
        default:
            return '#64748b';
    }
};

const formatTimeRange = (startTime: string, duration: number) => {
    const formatSingleTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const [startHour, startMinute] = startTime.split(':').map(Number);
    let endHour = startHour;
    let endMinute = startMinute + duration;

    while (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
    }

    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
};

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    selectedService,
    selectedDate,
    selectedTimeSlot,
    patientNotes,
    onNotesChange,
    loading,
}) => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
        return (
            <Alert severity="warning">
                Please complete all the previous steps before confirming your booking.
            </Alert>
        );
    }

    const serviceColor = getServiceColor(selectedService.type);
    const timeRange = formatTimeRange(selectedTimeSlot, selectedService.duration);

    return (
        <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please review your appointment details and add any notes for the doctor. Then confirm your booking.
            </Typography>

            <Grid container spacing={4}>
                {/* Left Column - Details and Notes */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    {/* Appointment Details Card */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedIcon color="primary" />
                                Appointment Details
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Service Details */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: `${serviceColor}10`,
                                        border: `1px solid ${serviceColor}30`,
                                        height: '100%'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                bgcolor: `${serviceColor}20`,
                                                color: serviceColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {getServiceIcon(selectedService.type)}
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {selectedService.name}
                                                </Typography>
                                                <Chip
                                                    label={selectedService.type.replace('_', ' ')}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${serviceColor}20`,
                                                        color: serviceColor,
                                                        borderColor: serviceColor,
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {selectedService.description}
                                        </Typography>

                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Duration
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {selectedService.duration} minutes
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Consultation Type
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {selectedService.type.replace('_', ' ')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* Date & Time */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'grey.50',
                                        }}>
                                            <CalendarIcon sx={{ color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Appointment Date
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'grey.50',
                                        }}>
                                            <AccessTimeIcon sx={{ color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Appointment Time
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {timeRange}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({selectedService.duration}-minute session)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Patient Notes */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <NoteIcon color="primary" />
                                Additional Information for the Doctor
                            </Typography>

                            <Typography variant="body2" color="text.secondary" paragraph>
                                Please share any symptoms, medical history, or specific concerns you'd like the doctor to know about before your appointment.
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                placeholder="E.g., I've been experiencing lower back pain for 2 weeks, especially after sitting for long periods. I have a history of sciatica and recently started a new desk job. Please focus on my lumbar region."
                                value={patientNotes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="caption" color="text.secondary">
                                This information helps the doctor prepare for your consultation and provide more personalized care.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Important Information */}
                    <Alert severity="info" icon={false}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Important Information
                        </Typography>
                        <Typography variant="body2">
                            • Please bring any previous medical reports or imaging studies (if applicable)
                            <br />
                            • Wear comfortable clothing that allows easy movement
                            <br />
                            • Arrive 10-15 minutes before your scheduled time
                            <br />
                            • For video consultations, ensure good internet connection and a quiet space
                            <br />
                            • For home visits, please have a clear space ready for the therapy session
                        </Typography>
                    </Alert>
                </Grid>

                {/* Right Column - Summary & Payment */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        {/* Booking Summary */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Booking Summary
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                Patient Information
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Name, contact details, and medical history will be used for your appointment.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Price Breakdown */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Price Breakdown
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Consultation Fee
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatCurrency(selectedService.price)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Service Tax (18%)
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatCurrency(selectedService.price * 0.18)}
                                            </Typography>
                                        </Box>

                                        {selectedService.type === ServiceType.HOME_VISIT && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Home Visit Charge
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {formatCurrency(200)}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 1 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                Total Amount
                                            </Typography>
                                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                {formatCurrency(
                                                    selectedService.price * 1.18 +
                                                    (selectedService.type === ServiceType.HOME_VISIT ? 200 : 0)
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Payment Information */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PaidIcon fontSize="small" />
                                            Payment Information
                                        </Typography>

                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            <Typography variant="caption">
                                                Payment is required at the time of service. You can pay via cash, card, or UPI at the clinic.
                                            </Typography>
                                        </Alert>

                                        <Typography variant="caption" color="text.secondary">
                                            • For home visits, payment can be made in cash or via UPI
                                            <br />
                                            • For video consultations, a payment link will be sent before the session
                                            <br />
                                            • Receipt will be provided after payment
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Confirmation Note */}
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Confirmation
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            By clicking "Confirm & Book", you agree to our cancellation policy and consent to treatment. A confirmation email and SMS will be sent to you immediately.
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.50' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid size={{ xs: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onClick={() => window.print()}
                                    >
                                        Print Summary
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            const text = `Appointment Details:
Service: ${selectedService.name}
Date: ${format(selectedDate, 'EEEE, MMMM d, yyyy')}
Time: ${timeRange}
Amount: ${formatCurrency(selectedService.price)}`;
                                            navigator.clipboard.writeText(text);
                                        }}
                                    >
                                        Copy Details
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Processing your booking...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ConfirmationStep;