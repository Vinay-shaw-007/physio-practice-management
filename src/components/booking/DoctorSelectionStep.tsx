import { Person as PersonIcon } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    Rating,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { Doctor } from '../../types';

interface DoctorSelectionStepProps {
    serviceId: string;
    selectedDoctor: Doctor | null;
    onSelectDoctor: (doctor: Doctor | null) => void;
}

const DoctorSelectionStep: React.FC<DoctorSelectionStepProps> = ({
    serviceId,
    selectedDoctor,
    onSelectDoctor
}) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctors = async () => {
            setLoading(true);
            try {
                const data = await doctorService.getDoctorsByService(serviceId);
                setDoctors(data);
            } catch (error) {
                console.error("Failed to load doctors", error);
            } finally {
                setLoading(false);
            }
        };
        loadDoctors();
    }, [serviceId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (doctors.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No doctors available
                </Typography>
                <Typography variant="body2">
                    We couldn't find any specialists for this service right now.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Choose a Specialist
            </Typography>
            <Grid container spacing={3}>
                {/* Option: Any Available Doctor */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Card
                        variant="outlined"
                        onClick={() => onSelectDoctor(null)} // null = Any
                        sx={{
                            cursor: 'pointer', height: '100%',
                            display: 'flex', alignItems: 'center', p: 2,
                            border: '2px dashed',
                            borderColor: selectedDoctor === null ? 'primary.main' : 'divider',
                            bgcolor: selectedDoctor === null ? 'primary.50' : 'transparent',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.50' }
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'grey.300', mr: 2 }}><PersonIcon /></Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">Any Available Doctor</Typography>
                            <Typography variant="caption" color="text.secondary">Fastest availability</Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Real Doctors Grid */}
                {doctors.map((doc) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
                        <Card
                            variant="outlined"
                            onClick={() => onSelectDoctor(doc)}
                            sx={{
                                cursor: 'pointer', height: '100%',
                                borderColor: selectedDoctor?.id === doc.id ? 'primary.main' : 'divider',
                                bgcolor: selectedDoctor?.id === doc.id ? 'primary.50' : 'background.paper',
                                '&:hover': { borderColor: 'primary.main', boxShadow: 2, transform: 'translateY(-2px)' },
                                transition: 'all 0.2s'
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                                <Avatar
                                    src={doc.avatar}
                                    sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                                >
                                    {doc.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {doc.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {doc.specialization || 'Physiotherapist'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating value={4.5} readOnly size="small" />
                                        <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                                            ({doc.yearsOfExperience || 1}+ yrs exp)
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DoctorSelectionStep;