import {
    CalendarMonth as CalendarIcon,
    Description as RecordsIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
    Alert
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { medicalRecordService } from '../../services/medicalRecordService';
import { MedicalRecord, Patient } from '../../types';

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
    const [patient, setPatient] = useState<Patient | null>(null);
    const [records, setRecords] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (patientId: string) => {
        setLoading(true);
        try {
            const [patientData, recordsData] = await Promise.all([
                patientService.getPatientProfile(patientId),
                medicalRecordService.getRecordsByPatientId(patientId)
            ]);
            setPatient(patientData);
            setRecords(recordsData);
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

            {/* Patient Profile Card */}
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
                    <Tab icon={<RecordsIcon />} label="Medical Records" iconPosition="start" />
                    <Tab icon={<CalendarIcon />} label="Appointments History" iconPosition="start" />
                </Tabs>

                {/* Medical Records Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Container>
                        {records.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No medical records uploaded for this patient yet.
                            </Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {records.map((record) => (
                                    <Grid size={{xs:12}} key={record.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="flex-start">
                                                    <Grid size={{xs:12, sm:2}}>
                                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                            {format(new Date(record.date), 'dd MMM')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {format(new Date(record.date), 'yyyy')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:8}}>
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
                                                    <Grid size={{xs:12, sm:2}} sx={{ textAlign: 'right' }}>
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

                {/* Appointments Tab (Placeholder logic) */}
                <TabPanel value={tabValue} index={1}>
                    <Container>
                        <Alert severity="info">Appointment history integration coming soon.</Alert>
                    </Container>
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default PatientDetails;