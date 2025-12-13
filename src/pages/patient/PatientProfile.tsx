import {
    AccountCircle as AccountCircleIcon,
    Add as AddIcon,
    Bloodtype as BloodtypeIcon,
    BugReport as BugReportIcon,
    CalendarMonth as CalendarIcon,
    CameraAlt as CameraAltIcon,
    Email as EmailIcon,
    ContactEmergency as EmergencyContactIcon,
    Favorite as FavoriteIcon,
    Height as HeightIcon,
    LocalHospital as LocalHospitalIcon,
    Medication as MedicationIcon,
    Phone as PhoneIcon,
    Save as SaveIcon,
    Scale as ScaleIcon,
    Warning as WarningIcon
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
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { MedicalRecord, patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';
import { Gender, Patient } from '../../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`patient-profile-tabpanel-${index}`}
            aria-labelledby={`patient-profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const validationSchema = yup.object({
    // Personal Information
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    dateOfBirth: yup.date().nullable(),
    gender: yup.string(),

    // Medical Information
    address: yup.string(),
    medicalHistory: yup.string(),
    bloodGroup: yup.string(),
    height: yup.number().min(50, 'Height must be at least 50 cm').max(250, 'Height cannot exceed 250 cm'),
    weight: yup.number().min(10, 'Weight must be at least 10 kg').max(300, 'Weight cannot exceed 300 kg'),

    // Emergency Contact
    emergencyContact: yup.object({
        name: yup.string().required('Emergency contact name is required'),
        relationship: yup.string().required('Relationship is required'),
        phone: yup.string().required('Emergency contact phone is required'),
    }),
});

const PatientProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [patientData, setPatientData] = useState<Patient | null>(null);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form with default values based on Patient interface
    const formik = useFormik({
        initialValues: {
            // Personal Information (from User interface)
            name: '',
            email: '',
            phone: '',
            avatar: '',

            // Patient-specific fields
            dateOfBirth: null as Date | null,
            gender: undefined as Gender | undefined,
            address: '',
            medicalHistory: '',
            bloodGroup: '',
            allergies: [] as string[],
            medications: [] as string[],
            height: 0,
            weight: 0,
            emergencyContact: {
                name: '',
                relationship: '',
                phone: '',
            },

            // New inputs for allergies and medications
            newAllergy: '',
            newMedication: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setSaving(true);

                // Prepare patient data for update
                const updatedPatient: Partial<Patient> = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    dateOfBirth: values.dateOfBirth || undefined,
                    gender: values.gender,
                    address: values.address || undefined,
                    medicalHistory: values.medicalHistory || undefined,
                    bloodGroup: values.bloodGroup || undefined,
                    allergies: values.allergies,
                    medications: values.medications,
                    height: values.height || undefined,
                    weight: values.weight || undefined,
                    emergencyContact: values.emergencyContact,
                };

                // Update patient profile
                await patientService.updatePatientProfile(user?.id || 'patient1', updatedPatient);

                // Show success message
                alert('Profile updated successfully!');

                // Refresh data
                loadPatientData();

            } catch (error) {
                console.error('Failed to update profile:', error);
                alert('Failed to update profile. Please try again.');
            } finally {
                setSaving(false);
            }
        },
    });

    useEffect(() => {
        loadPatientData();
    }, []);

    const loadPatientData = async () => {
        try {
            setLoading(true);
            const [profile, records] = await Promise.all([
                patientService.getPatientProfile(user?.id || 'patient1'),
                patientService.getMedicalRecords(user?.id || 'patient1')
            ]);

            setPatientData(profile);
            setMedicalRecords(records);

            // Populate form with existing data
            if (profile) {
                formik.setValues({
                    // Personal Information
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    avatar: profile.avatar || '',
                    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
                    gender: profile.gender,
                    address: profile.address || '',
                    medicalHistory: profile.medicalHistory || '',
                    bloodGroup: profile.bloodGroup || '',
                    allergies: profile.allergies || [],
                    medications: profile.medications || [],
                    height: profile.height || 0,
                    weight: profile.weight || 0,
                    emergencyContact: profile.emergencyContact || {
                        name: '',
                        relationship: '',
                        phone: '',
                    },

                    // New inputs
                    newAllergy: '',
                    newMedication: '',
                });

                // Set avatar preview if available
                if (profile.avatar) {
                    setAvatarPreview(profile.avatar);
                }
            }
        } catch (error) {
            console.error('Failed to load patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addAllergy = () => {
        if (formik.values.newAllergy.trim()) {
            formik.setFieldValue('allergies', [...formik.values.allergies, formik.values.newAllergy.trim()]);
            formik.setFieldValue('newAllergy', '');
        }
    };

    const removeAllergy = (index: number) => {
        const newAllergies = [...formik.values.allergies];
        newAllergies.splice(index, 1);
        formik.setFieldValue('allergies', newAllergies);
    };

    const addMedication = () => {
        if (formik.values.newMedication.trim()) {
            formik.setFieldValue('medications', [...formik.values.medications, formik.values.newMedication.trim()]);
            formik.setFieldValue('newMedication', '');
        }
    };

    const removeMedication = (index: number) => {
        const newMedications = [...formik.values.medications];
        newMedications.splice(index, 1);
        formik.setFieldValue('medications', newMedications);
    };

    const calculateAge = (dob: Date | null) => {
        if (!dob) return 0;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const calculateBMI = () => {
        const height = formik.values.height;
        const weight = formik.values.weight;
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return '--';
    };

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
        if (bmi < 25) return { label: 'Normal weight', color: 'success' };
        if (bmi < 30) return { label: 'Overweight', color: 'warning' };
        return { label: 'Obese', color: 'error' };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box>
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                            My Profile
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Manage your personal and medical information
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboards')}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={() => formik.handleSubmit()}
                            disabled={saving || !formik.dirty}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>

                {/* Tabs - Only essential tabs based on Patient interface */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                        <Tab label="Personal Information" icon={<AccountCircleIcon />} iconPosition="start" />
                        <Tab label="Medical Information" icon={<LocalHospitalIcon />} iconPosition="start" />
                        <Tab label="Emergency Contact" icon={<EmergencyContactIcon />} iconPosition="start" />
                        <Tab label="Medical Records" icon={<FavoriteIcon />} iconPosition="start" />
                    </Tabs>
                </Paper>

                {/* Progress indicator when saving */}
                {saving && <LinearProgress sx={{ mb: 2 }} />}

                <form onSubmit={formik.handleSubmit}>
                    {/* Tab 1: Personal Information */}
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={4}>
                            {/* Left Column - Avatar and Basic Info */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                            <Avatar
                                                sx={{ width: 120, height: 120, fontSize: 48 }}
                                                src={avatarPreview || undefined}
                                                alt={formik.values.name}
                                            >
                                                {formik.values.name ? formik.values.name.charAt(0) : 'P'}
                                            </Avatar>
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.dark' }
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <CameraAltIcon />
                                            </IconButton>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                            />
                                        </Box>
                                        <Typography variant="h6" gutterBottom>
                                            {formik.values.name || 'Patient Name'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Patient ID: {patientData?.id?.toUpperCase() || 'PAT001'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Member since {patientData?.createdAt ? format(new Date(patientData.createdAt), 'MMM yyyy') : 'Jan 2024'}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Health Summary
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Age
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {calculateAge(formik.values.dateOfBirth)} years
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Gender
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formik.values.gender || 'Not specified'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Blood Group
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formik.values.bloodGroup || 'Not specified'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    BMI
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {(() => {
                                                        const bmi = parseFloat(calculateBMI());
                                                        if (isNaN(bmi)) return '--';
                                                        const category = getBMICategory(bmi);
                                                        return `${bmi} (${category.label})`;
                                                    })()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Right Column - Personal Information Form */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Personal Details
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="name"
                                                    label="Full Name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                                    helperText={formik.touched.name && formik.errors.name}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AccountCircleIcon />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="email"
                                                    label="Email Address"
                                                    type="email"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                                    helperText={formik.touched.email && formik.errors.email}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <EmailIcon />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="phone"
                                                    label="Phone Number"
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                                    helperText={formik.touched.phone && formik.errors.phone}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <DatePicker
                                                    label="Date of Birth"
                                                    value={formik.values.dateOfBirth}
                                                    onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                                                            helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
                                                            slotProps: {
                                                                input: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <CalendarIcon />
                                                                        </InputAdornment>
                                                                    ),
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                                                    <InputLabel>Gender</InputLabel>
                                                    <Select
                                                        name="gender"
                                                        value={formik.values.gender || ''}
                                                        label="Gender"
                                                        onChange={(e) => formik.setFieldValue('gender', e.target.value)}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <MenuItem value="">Not specified</MenuItem>
                                                        <MenuItem value={Gender.MALE}>Male</MenuItem>
                                                        <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                                                        <MenuItem value={Gender.OTHER}>Other</MenuItem>
                                                    </Select>
                                                    {formik.touched.gender && formik.errors.gender && (
                                                        <FormHelperText>{formik.errors.gender}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Address Information
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    name="address"
                                                    label="Address"
                                                    multiline
                                                    rows={2}
                                                    value={formik.values.address}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                                    helperText={formik.touched.address && formik.errors.address}
                                                    placeholder="Enter your full address"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 2: Medical Information */}
                    <TabPanel value={tabValue} index={1}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BugReportIcon color="warning" />
                                            Allergies
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            List all known allergies including drug allergies, food allergies, and environmental allergies.
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 9 }}>
                                                    <TextField
                                                        fullWidth
                                                        name="newAllergy"
                                                        label="Add new allergy"
                                                        value={formik.values.newAllergy}
                                                        onChange={formik.handleChange}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addAllergy();
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 3 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={addAllergy}
                                                        startIcon={<AddIcon />}
                                                    >
                                                        Add
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {formik.values.allergies.map((allergy, index) => (
                                                <Chip
                                                    key={index}
                                                    label={allergy}
                                                    onDelete={() => removeAllergy(index)}
                                                    color="warning"
                                                    variant="outlined"
                                                    icon={<WarningIcon />}
                                                />
                                            ))}
                                            {formik.values.allergies.length === 0 && (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    No allergies recorded
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>

                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MedicationIcon color="primary" />
                                            Current Medications
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            List all medications you're currently taking including dosage and frequency.
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 9 }}>
                                                    <TextField
                                                        fullWidth
                                                        name="newMedication"
                                                        label="Add new medication"
                                                        value={formik.values.newMedication}
                                                        onChange={formik.handleChange}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addMedication();
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 3 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={addMedication}
                                                        startIcon={<AddIcon />}
                                                    >
                                                        Add
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {formik.values.medications.map((medication, index) => (
                                                <Chip
                                                    key={index}
                                                    label={medication}
                                                    onDelete={() => removeMedication(index)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                            {formik.values.medications.length === 0 && (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    No medications recorded
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BloodtypeIcon color="error" />
                                            Blood Information & Body Metrics
                                        </Typography>

                                        <Grid container spacing={3} sx={{ mb: 3 }}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Blood Group</InputLabel>
                                                    <Select
                                                        name="bloodGroup"
                                                        value={formik.values.bloodGroup}
                                                        label="Blood Group"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <MenuItem value="">Not specified</MenuItem>
                                                        <MenuItem value="A+">A+</MenuItem>
                                                        <MenuItem value="A-">A-</MenuItem>
                                                        <MenuItem value="B+">B+</MenuItem>
                                                        <MenuItem value="B-">B-</MenuItem>
                                                        <MenuItem value="O+">O+</MenuItem>
                                                        <MenuItem value="O-">O-</MenuItem>
                                                        <MenuItem value="AB+">AB+</MenuItem>
                                                        <MenuItem value="AB-">AB-</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="height"
                                                    label="Height (cm)"
                                                    type="number"
                                                    value={formik.values.height || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.height && Boolean(formik.errors.height)}
                                                    helperText={formik.touched.height && formik.errors.height}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <HeightIcon />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="weight"
                                                    label="Weight (kg)"
                                                    type="number"
                                                    value={formik.values.weight || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                                                    helperText={formik.touched.weight && formik.errors.weight}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <ScaleIcon />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Body Mass Index (BMI)
                                            </Typography>
                                            <Typography variant="h4" color="primary.main" fontWeight="bold">
                                                {calculateBMI()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(() => {
                                                    const bmi = parseFloat(calculateBMI());
                                                    if (isNaN(bmi)) return 'Enter height and weight to calculate BMI';
                                                    const category = getBMICategory(bmi);
                                                    return category.label;
                                                })()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Medical History Notes
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="medicalHistory"
                                            label="Medical History"
                                            multiline
                                            rows={6}
                                            value={formik.values.medicalHistory}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Include any previous medical conditions, surgeries, family medical history, or other relevant information..."
                                            helperText="This information helps your physiotherapist provide better care"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 3: Emergency Contact */}
                    <TabPanel value={tabValue} index={2}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmergencyContactIcon color="error" />
                                            Primary Emergency Contact
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            This person will be contacted in case of emergency during your treatment.
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    name="emergencyContact.name"
                                                    label="Full Name"
                                                    value={formik.values.emergencyContact.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.emergencyContact?.name && Boolean(formik.errors.emergencyContact?.name)}
                                                    helperText={formik.touched.emergencyContact?.name && formik.errors.emergencyContact?.name}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="emergencyContact.relationship"
                                                    label="Relationship"
                                                    value={formik.values.emergencyContact.relationship}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.emergencyContact?.relationship && Boolean(formik.errors.emergencyContact?.relationship)}
                                                    helperText={formik.touched.emergencyContact?.relationship && formik.errors.emergencyContact?.relationship}
                                                    placeholder="e.g., Spouse, Parent, Sibling"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    name="emergencyContact.phone"
                                                    label="Phone Number"
                                                    value={formik.values.emergencyContact.phone}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.emergencyContact?.phone && Boolean(formik.errors.emergencyContact?.phone)}
                                                    helperText={formik.touched.emergencyContact?.phone && formik.errors.emergencyContact?.phone}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Emergency Contact Information
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            <Typography variant="body2">
                                                Your emergency contact will only be used in case of medical emergencies during your treatment.
                                                Ensure the information is up-to-date and accurate.
                                            </Typography>
                                        </Alert>

                                        <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                <strong>Important:</strong>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • Ensure your emergency contact is aware they're listed
                                                <br />
                                                • Update this information if there are any changes
                                                <br />
                                                • Provide an alternate contact if possible
                                                <br />
                                                • International numbers should include country code
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 4: Medical Records */}
                    <TabPanel value={tabValue} index={3}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            Medical Records Timeline
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Your medical history and past consultations with your physiotherapist.
                                        </Typography>

                                        {medicalRecords.length === 0 ? (
                                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                                <LocalHospitalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary">
                                                    No medical records found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Your medical records will appear here after your first consultation.
                                                </Typography>
                                            </Paper>
                                        ) : (
                                            <Stack spacing={3}>
                                                {medicalRecords.map((record) => (
                                                    <Paper key={record.id} sx={{ p: 3, borderRadius: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                                    {record.title}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {format(record.date, 'MMMM d, yyyy')} • {record.doctorName}
                                                                </Typography>
                                                            </Box>
                                                            <Button size="small" variant="outlined">
                                                                View Details
                                                            </Button>
                                                        </Box>
                                                        <Typography variant="body2" paragraph>
                                                            {record.description}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {record.tags.map((tag) => (
                                                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                                                            ))}
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </form>

                {/* Action Buttons at Bottom */}
                <Paper sx={{ p: 3, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Last updated: {patientData?.updatedAt ? format(new Date(patientData.updatedAt), 'MMM d, yyyy h:mm a') : 'Never'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                formik.resetForm();
                                setAvatarFile(null);
                                setAvatarPreview(patientData?.avatar || null);
                            }}
                            disabled={!formik.dirty || saving}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={() => formik.handleSubmit()}
                            disabled={saving || !formik.dirty}
                        >
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default PatientProfile;