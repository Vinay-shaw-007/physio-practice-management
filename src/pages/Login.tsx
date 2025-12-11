import { LocalHospital, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice';
import { useAppDispatch } from '../store/store';
import { UserRole } from '../types';

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password should be at least 6 characters')
        .required('Password is required'),
});

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async values => {
            try {
                dispatch(loginStart());

                // Mock authentication - Replace with actual API call
                // For demo purposes, we'll simulate different roles based on email
                const isDoctor = values.email.includes('doctor');
                const role = isDoctor ? UserRole.DOCTOR : UserRole.PATIENT;

                // Uncomment below for real API call

                // const response = await authService.login({
                //     email: values.email,
                //     password: values.password,
                // });
                // dispatch(loginSuccess(response));


                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const user = {
                    id: '1',
                    email: values.email,
                    name: isDoctor ? 'Dr. Sarah Johnson' : 'John Doe',
                    role,
                    phone: '+1 234 567 8900',
                    avatar: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const token = 'mock-jwt-token';

                dispatch(loginSuccess({ user, token }));
                localStorage.setItem('auth_token', token);

                // Redirect based on role
                if (role === UserRole.DOCTOR) {
                    navigate('/dashboard');
                } else {
                    navigate('/dashboards');
                }
            } catch (error: any) {
                dispatch(loginFailure(error.message || 'Login failed'));
            }
        },
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <LocalHospital
                        sx={{
                            fontSize: 64,
                            color: 'primary.main',
                            mb: 2,
                        }}
                    />
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        PhysioPro
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Practice Management System
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h5" component="h2" gutterBottom align="center">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Sign in to your account
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            margin="normal"
                            autoComplete="email"
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            margin="normal"
                            autoComplete="current-password"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link component={RouterLink} to="/register" underline="hover">
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                For demo: Use 'doctor@example.com' or 'patient@example.com' with any password
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
