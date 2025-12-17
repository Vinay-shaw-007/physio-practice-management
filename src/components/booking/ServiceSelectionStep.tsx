import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
    useTheme
} from '@mui/material';
import React from 'react';
import { Service, ServiceType } from '../../types';

// Icons
import {
    Home as HomeIcon,
    LocalHospital as ClinicIcon,
    Videocam as VideoIcon
} from '@mui/icons-material';

// Updated Interface to match BookAppointment.tsx
interface ServiceSelectionStepProps {
    services: Service[];
    selectedService: Service | null;
    onSelectService: (service: Service) => void;
    loading: boolean;
}

const getServiceIcon = (type: ServiceType) => {
    switch (type) {
        case ServiceType.CLINIC_VISIT: return <ClinicIcon fontSize="large" />;
        case ServiceType.HOME_VISIT: return <HomeIcon fontSize="large" />;
        case ServiceType.VIDEO_CONSULT: return <VideoIcon fontSize="large" />;
        default: return <ClinicIcon fontSize="large" />;
    }
};

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ 
    services, 
    selectedService, 
    onSelectService, 
    loading 
}) => {
    const theme = useTheme();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!services || services.length === 0) {
        return (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No services are currently available.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                What type of appointment do you need?
            </Typography>
            <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={service.id}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                height: '100%',
                                borderColor: selectedService?.id === service.id ? 'primary.main' : 'divider',
                                bgcolor: selectedService?.id === service.id ? 'primary.50' : 'background.paper',
                                transition: 'all 0.2s',
                                transform: selectedService?.id === service.id ? 'scale(1.02)' : 'none',
                                boxShadow: selectedService?.id === service.id ? 2 : 0
                            }}
                        >
                            <CardActionArea 
                                onClick={() => onSelectService(service)} 
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: selectedService?.id === service.id ? 'primary.main' : 'text.secondary', mb: 2 }}>
                                        {getServiceIcon(service.type)}
                                    </Box>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {service.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                                        {service.description}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                        ${service.price} • {service.duration} mins
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ServiceSelectionStep;