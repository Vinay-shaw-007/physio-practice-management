import {
    AccountCircle,
    Badge,
    Description,
    Euro,
    Save,
    School,
    WorkHistory
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { doctorService } from '../services/doctorService';
import { useAppSelector } from '../store/store';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    specialization: yup.string().required('Specialization is required'),
    yearsOfExperience: yup.number().min(0, 'Experience cannot be negative').required('Experience is required'),
    consultationFee: yup.number().min(0, 'Fee cannot be negative').required('Consultation fee is required'),
    qualifications: yup.string().required('Qualifications are required'),
    bio: yup.string().max(500, 'Bio must be at most 500 characters'),
});

const DoctorProfile: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            specialization: '',
            yearsOfExperience: 0,
            qualifications: '', // We'll manage this as a comma-separated string in the form
            consultationFee: 0,
            bio: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (!user?.id) return;
            try {
                // Convert comma-separated string back to array for storage
                const qualificationsArray = values.qualifications
                    .split(',')
                    .map(q => q.trim())
                    .filter(q => q.length > 0);

                await doctorService.updateDoctorProfile(user.id, {
                    name: values.name,
                    phone: values.phone,
                    specialization: values.specialization,
                    yearsOfExperience: values.yearsOfExperience,
                    consultationFee: values.consultationFee,
                    bio: values.bio,
                    qualifications: qualificationsArray,
                });

                setSuccessMessage('Profile updated successfully');
            } catch (err) {
                console.error(err);
                setError('Failed to update profile');
            }
        },
    });

    useEffect(() => {
        loadProfile();
    }, [user?.id]);

    const loadProfile = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const profile = await doctorService.getDoctorProfile(user.id);

            // Populate form
            formik.setValues({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                specialization: profile.specialization || '',
                yearsOfExperience: profile.yearsOfExperience || 0,
                qualifications: profile.qualifications?.join(', ') || '',
                consultationFee: profile.consultationFee || 0,
                bio: profile.bio || '',
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Doctor Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Manage your professional details and clinic settings.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={4}>
                    {/* Left Column: Avatar & Basic Info */}
                    <Grid size={{ xs: 12, md: 4 }} >
                        <Card sx={{ mb: 3, textAlign: 'center', p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Avatar
                                    sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}
                                >
                                    {formik.values.name.charAt(0)}
                                </Avatar>
                            </Box>
                            <Typography variant="h6" fontWeight="bold">{formik.values.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{formik.values.specialization || 'Doctor'}</Typography>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formik.values.email}
                                        disabled // Email usually shouldn't be changed easily
                                        helperText="Contact admin to change email"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column: Professional Details */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Professional Details</Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Specialization"
                                            name="specialization"
                                            value={formik.values.specialization}
                                            onChange={formik.handleChange}
                                            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                                            helperText={formik.touched.specialization && formik.errors.specialization}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><Badge /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Years of Experience"
                                            name="yearsOfExperience"
                                            type="number"
                                            value={formik.values.yearsOfExperience}
                                            onChange={formik.handleChange}
                                            error={formik.touched.yearsOfExperience && Boolean(formik.errors.yearsOfExperience)}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <InputAdornment position="start"><WorkHistory /></InputAdornment>,
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Qualifications (Comma separated)"
                                            name="qualifications"
                                            value={formik.values.qualifications}
                                            onChange={formik.handleChange}
                                            error={formik.touched.qualifications && Boolean(formik.errors.qualifications)}
                                            helperText={formik.touched.qualifications ? formik.errors.qualifications : "E.g. MBBS, MD, Physiotherapy Certification"}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <InputAdornment position="start"><School /></InputAdornment>,
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Consultation Fee"
                                            name="consultationFee"
                                            type="number"
                                            value={formik.values.consultationFee}
                                            onChange={formik.handleChange}
                                            error={formik.touched.consultationFee && Boolean(formik.errors.consultationFee)}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <InputAdornment position="start"><Euro /></InputAdornment>, // Or Rupee/Dollar symbol
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Biography / About Me"
                                            name="bio"
                                            value={formik.values.bio}
                                            onChange={formik.handleChange}
                                            error={formik.touched.bio && Boolean(formik.errors.bio)}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <InputAdornment position="start" sx={{ mt: 1 }}><Description /></InputAdornment>,
                                                }
                                            }}
                                       />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Save />}
                                        type="submit"
                                        disabled={formik.isSubmitting || !formik.dirty}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success" variant="filled">{successMessage}</Alert>
            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="error" variant="filled">{error}</Alert>
            </Snackbar>
        </Container>
    );
};

export default DoctorProfile;