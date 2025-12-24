import {
    ArrowBack as ArrowBackIcon,
    CalendarMonth as CalendarIcon,
    Assignment as DiagnosisIcon,
    Download as DownloadIcon,
    Email as EmailIcon,
    Medication as MedicationIcon,
    Notes as NotesIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Description as RecordsIcon
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService'; // Import Appointment Service
import { medicalRecordService } from '../../services/medicalRecordService';
import { patientService } from '../../services/patientService';
import { Appointment, AppointmentStatus, MedicalRecord, Patient } from '../../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <div hidden={value !== index} role="tabpanel">
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
);

const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    // Data States
    const [patient, setPatient] = useState<Patient | null>(null);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [history, setHistory] = useState<Appointment[]>([]); // New: Appointment History

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (patientId: string) => {
        setLoading(true);
        try {
            // Fetch Profile, Records, AND Appointment History in parallel
            const [patientData, recordsData, appointmentHistory] = await Promise.all([
                patientService.getPatientProfile(patientId),
                medicalRecordService.getRecordsByPatientId(patientId),
                appointmentService.getAppointments({ patientId: patientId })
            ]);

            setPatient(patientData);
            setRecords(recordsData);
            setHistory(appointmentHistory);
        } catch (error) {
            console.error('Failed to load patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!patient) {
        return <Alert severity="error">Patient not found</Alert>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header & Navigation */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/patients')}
                sx={{ mb: 3 }}
            >
                Back to Patient List
            </Button>

            {/* Patient Profile Card (Unchanged) */}
            <Card sx={{ mb: 4, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid>
                            <Avatar
                                src={patient.avatar}
                                sx={{ width: 80, height: 80, fontSize: 32, bgcolor: 'primary.main' }}
                            >
                                {patient.name.charAt(0)}
                            </Avatar>
                        </Grid>
                        <Grid>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {patient.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon fontSize="small" />
                                    <Typography variant="body2">{patient.email}</Typography>
                                </Box>
                                {patient.phone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon fontSize="small" />
                                        <Typography variant="body2">{patient.phone}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon fontSize="small" />
                                    <Typography variant="body2">
                                        {patient.gender} • {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'dd MMM yyyy') : 'DOB N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                    <Tab icon={<CalendarIcon />} label="Clinical History" iconPosition="start" />
                    <Tab icon={<RecordsIcon />} label="Medical Files (Labs/X-Rays)" iconPosition="start" />
                </Tabs>

                {/* TAB 1: Clinical History (Appointments Timeline) */}
                <TabPanel value={tabValue} index={0}>
                    <Container>
                        {history.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>No appointment history found for this patient.</Alert>
                        ) : (
                            <Stack spacing={3}>
                                {history.map((appt) => (
                                    <Card key={appt.id} variant="outlined" sx={{
                                        borderLeft: appt.status === AppointmentStatus.COMPLETED ? '4px solid #10b981' : '4px solid #e0e0e0'
                                    }}>
                                        <CardContent>
                                            {/* Header Line */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {format(new Date(appt.date), 'EEEE, MMMM do, yyyy')} • {appt.startTime}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {appt.metadata?.serviceName || 'Consultation'}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={appt.status}
                                                    size="small"
                                                    color={appt.status === AppointmentStatus.COMPLETED ? 'success' : 'default'}
                                                    variant={appt.status === AppointmentStatus.COMPLETED ? 'filled' : 'outlined'}
                                                />
                                            </Box>

                                            <Divider sx={{ mb: 2 }} />

                                            {/* Clinical Details (Only if Completed) */}
                                            {appt.status === AppointmentStatus.COMPLETED && appt.metadata ? (
                                                <Grid container spacing={2}>
                                                    {/* Diagnosis */}
                                                    {appt.metadata.diagnosis && (
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                <DiagnosisIcon color="primary" fontSize="small" />
                                                                <Typography variant="subtitle2" fontWeight="bold">Diagnosis</Typography>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 1 }}>
                                                                {appt.metadata.diagnosis}
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {/* Prescription */}
                                                    {appt.metadata.prescription && (
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                                <MedicationIcon color="error" fontSize="small" />
                                                                <Typography variant="subtitle2" fontWeight="bold">Prescription</Typography>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 1, whiteSpace: 'pre-line' }}>
                                                                {appt.metadata.prescription}
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {/* Clinical Notes / Treatment */}
                                                    {(appt.metadata.clinicalNotes || appt.metadata.treatment) && (
                                                        <Grid size={{ xs: 12 }}>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 1 }}>
                                                                <NotesIcon color="action" fontSize="small" />
                                                                <Typography variant="subtitle2" fontWeight="bold">Clinical Notes & Treatment</Typography>
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {appt.metadata.treatment}
                                                                {appt.metadata.treatment && appt.metadata.clinicalNotes ? ' — ' : ''}
                                                                {appt.metadata.clinicalNotes}
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    {appt.status === AppointmentStatus.CANCELLED
                                                        ? "Appointment was cancelled."
                                                        : "No clinical notes available yet."}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Container>
                </TabPanel>

                {/* TAB 2: Medical Files (Existing Logic) */}
                <TabPanel value={tabValue} index={1}>
                    <Container>
                        {records.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No medical files (Lab results, X-Rays) uploaded for this patient yet.
                            </Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {records.map((record) => (
                                    <Grid size={{ xs: 12 }} key={record.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="flex-start">
                                                    <Grid size={{ xs: 12, sm: 2 }}>
                                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                            {format(new Date(record.date), 'dd MMM')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {format(new Date(record.date), 'yyyy')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                            <Chip
                                                                label={record.type.replace('_', ' ')}
                                                                size="small"
                                                                color={record.type === 'PRESCRIPTION' ? 'success' : 'default'}
                                                            />
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {record.title}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" paragraph>
                                                            {record.description}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Doctor/Lab: {record.doctorName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: 'right' }}>
                                                        {record.attachments && record.attachments.length > 0 && (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<DownloadIcon />}
                                                                onClick={() => alert(`Downloading ${record.attachments![0]}`)}
                                                            >
                                                                View File
                                                            </Button>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Container>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default PatientDetails;