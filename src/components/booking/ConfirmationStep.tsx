import {
    Box,
    CardContent,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { Service } from '../../types';

// Icons
import {
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    MedicalServices as ServiceIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';

// Updated Interface to match BookAppointment.tsx
interface ConfirmationStepProps {
    selectedService: Service | null;
    selectedDate: Date | null;
    selectedTimeSlot: string | null;
    patientNotes: string;
    onNotesChange: (notes: string) => void;
    loading: boolean;
}

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" display="block">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
                {value}
            </Typography>
        </Box>
    </Box>
);

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    selectedService,
    selectedDate,
    selectedTimeSlot,
    patientNotes,
    onNotesChange,
    loading
}) => {

    if (!selectedService || !selectedDate || !selectedTimeSlot) {
        return <Alert severity="error">Missing appointment details.</Alert>;
    }

    // Calculate end time for display
    const getEndTime = () => {
        const [h, m] = selectedTimeSlot.split(':').map(Number);
        const endD = new Date();
        endD.setHours(h, m + selectedService.duration);
        return format(endD, 'HH:mm');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                Review & Confirm
            </Typography>

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">Appointment Summary</Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailRow
                                icon={<ServiceIcon />}
                                label="Service"
                                value={selectedService.name}
                            />
                            <DetailRow
                                icon={<MoneyIcon />}
                                label="Price"
                                value={`$${selectedService.price}`}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DetailRow
                                icon={<CalendarIcon />}
                                label="Date"
                                value={format(selectedDate, 'EEEE, MMM d, yyyy')}
                            />
                            <DetailRow
                                icon={<TimeIcon />}
                                label="Time"
                                value={`${selectedTimeSlot} - ${getEndTime()}`}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Additional Notes (Optional)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Describe your symptoms or add any special requests..."
                        value={patientNotes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        variant="outlined"
                        disabled={loading}
                    />
                </CardContent>
            </Paper>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    By clicking "Confirm Booking", you agree to our cancellation policy.
                </Typography>
            </Box>
        </Box>
    );
};

export default ConfirmationStep;