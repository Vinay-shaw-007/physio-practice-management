import {
    Cancel as CancelIcon,
    MedicalServices as DiagnosisIcon,
    Medication as MedicineIcon,
    Notes as NotesIcon,
    CheckCircle as SaveIcon
} from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

interface ConsultationModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ConsultationData) => void;
    patientName: string;
}

export interface ConsultationData {
    diagnosis: string;
    treatment: string;
    clinicalNotes: string;
    prescription: string;
}

const validationSchema = yup.object({
    diagnosis: yup.string().required('Diagnosis is required'),
    treatment: yup.string().required('Treatment details are required'),
    clinicalNotes: yup.string(),
    prescription: yup.string(),
});

const ConsultationModal: React.FC<ConsultationModalProps> = ({
    open,
    onClose,
    onSubmit,
    patientName,
}) => {
    const formik = useFormik({
        initialValues: {
            diagnosis: '',
            treatment: '',
            clinicalNotes: '',
            prescription: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            formik.resetForm();
        },
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 2 }
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Complete Consultation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Patient: {patientName}
                </Typography>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        {/* Diagnosis Section */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Diagnosis / Chief Complaint"
                                name="diagnosis"
                                value={formik.values.diagnosis}
                                onChange={formik.handleChange}
                                error={formik.touched.diagnosis && Boolean(formik.errors.diagnosis)}
                                helperText={formik.touched.diagnosis && formik.errors.diagnosis}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start"><DiagnosisIcon color="primary" /></InputAdornment>,
                                    }
                                }}
                            />
                        </Grid>

                        {/* Treatment Section */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Treatment Provided"
                                name="treatment"
                                placeholder="Details of physiotherapy performed today..."
                                value={formik.values.treatment}
                                onChange={formik.handleChange}
                                error={formik.touched.treatment && Boolean(formik.errors.treatment)}
                                helperText={formik.touched.treatment && formik.errors.treatment}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider />
                        </Grid>

                        {/* Prescription Section */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Prescription / Exercises"
                                name="prescription"
                                placeholder="List medicines or home exercises..."
                                value={formik.values.prescription}
                                onChange={formik.handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start" sx={{ mt: 1 }}><MedicineIcon /></InputAdornment>,
                                    }
                                }}
                            />
                        </Grid>

                        {/* Clinical Notes (SOAP) */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Clinical Notes (Internal)"
                                name="clinicalNotes"
                                placeholder="Subjective, Objective, Assessment, Plan..."
                                value={formik.values.clinicalNotes}
                                onChange={formik.handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start" sx={{ mt: 1 }}><NotesIcon /></InputAdornment>,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        onClick={onClose}
                        color="inherit"
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={!formik.isValid || !formik.dirty}
                    >
                        Complete & Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ConsultationModal;