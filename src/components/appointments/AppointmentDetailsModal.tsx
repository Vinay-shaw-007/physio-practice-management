import {
    Close as CloseIcon,
    MedicalServices as DiagnosisIcon,
    Medication as MedicineIcon,
    Description as NotesIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';
import { Appointment } from '../../types';

interface AppointmentDetailsModalProps {
    open: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
    open,
    onClose,
    appointment,
}) => {
    if (!appointment) return null;

    const { metadata } = appointment;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Consultation Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Dr. {metadata?.doctorName} • {new Date(appointment.date).toLocaleDateString()}
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 3 }}>
                {/* Status Banner */}
                <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
                    <Chip label="Completed" color="success" />
                    <Chip label={metadata?.serviceName} variant="outlined" />
                </Box>

                <Grid container spacing={3}>
                    {/* Diagnosis */}
                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.100' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <DiagnosisIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                    DIAGNOSIS
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                                {metadata?.diagnosis || 'No diagnosis recorded.'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Treatment Provided */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" gutterBottom>
                                TREATMENT PROVIDED
                            </Typography>
                            <Typography variant="body1">
                                {metadata?.treatment || 'No details available.'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}><Divider /></Grid>

                    {/* Prescription */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <MedicineIcon color="action" fontSize="small" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                PRESCRIPTION & EXERCISES
                            </Typography>
                        </Box>
                        <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
                            <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                {metadata?.prescription || 'None'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Clinical Notes (Usually hidden from patient, but shown here for transparency if desired) */}
                    {/* Ideally, "Clinical Notes" are internal. You might want to hide this section for patients. 
                        I will show "Patient Instructions" instead if you have that field, or just hide it. 
                        For now, let's display what we have. */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <NotesIcon color="action" fontSize="small" />
                            <Typography variant="subtitle2" fontWeight="bold">
                                NOTES
                            </Typography>
                        </Box>
                        <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
                            <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                {metadata?.clinicalNotes || 'None'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose}>Close</Button>
                <Button variant="contained" onClick={() => window.print()}>
                    Print Summary
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppointmentDetailsModal;