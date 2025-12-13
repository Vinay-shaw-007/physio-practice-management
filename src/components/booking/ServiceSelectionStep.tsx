// import {
//     CheckCircle as CheckCircleIcon,
//     LocalHospital as ClinicIcon,
//     Home as HomeIcon,
//     Videocam as VideoIcon,
// } from '@mui/icons-material';
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Chip,
//     CircularProgress,
//     Grid,
//     Typography
// } from '@mui/material';
// import React from 'react';
// import { Service, ServiceType } from '../../types';

// interface ServiceSelectionStepProps {
//     services: Service[];
//     selectedService: Service | null;
//     onSelectService: (service: Service) => void;
//     loading: boolean;
// }

// const getServiceIcon = (type: ServiceType) => {
//     switch (type) {
//         case ServiceType.CLINIC_VISIT:
//             return <ClinicIcon />;
//         case ServiceType.HOME_VISIT:
//             return <HomeIcon />;
//         case ServiceType.VIDEO_CONSULT:
//             return <VideoIcon />;
//         default:
//             return <ClinicIcon />;
//     }
// };

// const getServiceColor = (type: ServiceType) => {
//     switch (type) {
//         case ServiceType.CLINIC_VISIT:
//             return '#3b82f6';
//         case ServiceType.HOME_VISIT:
//             return '#8b5cf6';
//         case ServiceType.VIDEO_CONSULT:
//             return '#06b6d4';
//         default:
//             return '#64748b';
//     }
// };

// const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: 'INR',
//         minimumFractionDigits: 0,
//     }).format(amount);
// };

// const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
//     services,
//     selectedService,
//     onSelectService,
//     loading,
// }) => {
//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (services.length === 0) {
//         return (
//             <Box sx={{ textAlign: 'center', py: 8 }}>
//                 <Typography variant="h6" color="text.secondary">
//                     No services available at the moment
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     Please check back later or contact the clinic directly.
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//                 Choose the type of consultation that best fits your needs. All prices are inclusive of taxes.
//             </Typography>

//             <Grid container spacing={3}>
//                 {services.map((service) => (
//                     <Grid size={{ xs: 12, md: 6 }} key={service.id}>
//                         <Card
//                             onClick={() => onSelectService(service)}
//                             sx={{
//                                 cursor: 'pointer',
//                                 border: selectedService?.id === service.id ? '2px solid #3b82f6' : '1px solid rgba(0, 0, 0, 0.12)',
//                                 borderRadius: 2,
//                                 transition: 'all 0.2s',
//                                 '&:hover': {
//                                     transform: 'translateY(-4px)',
//                                     boxShadow: 4,
//                                 },
//                                 position: 'relative',
//                                 height: '100%',
//                             }}
//                         >
//                             {selectedService?.id === service.id && (
//                                 <Box
//                                     sx={{
//                                         position: 'absolute',
//                                         top: 12,
//                                         right: 12,
//                                         color: 'primary.main',
//                                     }}
//                                 >
//                                     <CheckCircleIcon />
//                                 </Box>
//                             )}

//                             <CardContent>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                     <Box
//                                         sx={{
//                                             width: 48,
//                                             height: 48,
//                                             borderRadius: '50%',
//                                             bgcolor: `${getServiceColor(service.type)}20`,
//                                             color: getServiceColor(service.type),
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             mr: 2,
//                                         }}
//                                     >
//                                         {getServiceIcon(service.type)}
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="h6" component="h3" gutterBottom>
//                                             {service.name}
//                                         </Typography>
//                                         <Chip
//                                             label={service.type.replace('_', ' ')}
//                                             size="small"
//                                             sx={{
//                                                 bgcolor: `${getServiceColor(service.type)}10`,
//                                                 color: getServiceColor(service.type),
//                                                 borderColor: getServiceColor(service.type),
//                                             }}
//                                             variant="outlined"
//                                         />
//                                     </Box>
//                                 </Box>

//                                 <Typography variant="body2" color="text.secondary" paragraph>
//                                     {service.description}
//                                 </Typography>

//                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Duration
//                                         </Typography>
//                                         <Typography variant="body1" fontWeight="medium">
//                                             {service.duration} minutes
//                                         </Typography>
//                                     </Box>

//                                     <Box>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Price
//                                         </Typography>
//                                         <Typography variant="h6" color="primary.main" fontWeight="bold">
//                                             {formatCurrency(service.price)}
//                                         </Typography>
//                                     </Box>
//                                 </Box>

//                                 <Button
//                                     fullWidth
//                                     variant={selectedService?.id === service.id ? 'contained' : 'outlined'}
//                                     sx={{ mt: 3 }}
//                                     onClick={() => onSelectService(service)}
//                                 >
//                                     {selectedService?.id === service.id ? 'Selected' : 'Select Service'}
//                                 </Button>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>

//             <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
//                 <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//                     Service Information
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                     • Clinic Visit: In-person consultation at our clinic facility
//                     <br />
//                     • Home Visit: Therapist visits your home (additional charges may apply for distance)
//                     <br />
//                     • Video Consultation: Remote consultation via secure video call
//                     <br />
//                     • All appointments include a detailed assessment and personalized treatment plan
//                 </Typography>
//             </Box>
//         </Box>
//     );
// };

// export default ServiceSelectionStep;

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
import React, { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceConfigurationService';
import { Service, ServiceType } from '../../types';

// Icons
import {
    Home as HomeIcon,
    LocalHospital as ClinicIcon,
    Videocam as VideoIcon
} from '@mui/icons-material';

interface ServiceSelectionStepProps {
    selectedService: Service | null;
    onSelect: (service: Service) => void;
}

const getServiceIcon = (type: ServiceType) => {
    switch (type) {
        case ServiceType.CLINIC_VISIT: return <ClinicIcon fontSize="large" />;
        case ServiceType.HOME_VISIT: return <HomeIcon fontSize="large" />;
        case ServiceType.VIDEO_CONSULT: return <VideoIcon fontSize="large" />;
        default: return <ClinicIcon fontSize="large" />;
    }
};

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ selectedService, onSelect }) => {
    const theme = useTheme();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                // Get only active services
                const data = await serviceService.getServices({ isActive: true });
                setServices(data);
            } catch (error) {
                console.error('Failed to load services', error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (services.length === 0) {
        return (
            <Typography align="center" color="text.secondary">
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
                    <Grid size={{ xs: 12, sm: 4}} key={service.id}>
                        <Card 
                            variant="outlined" 
                            sx={{ 
                                height: '100%',
                                borderColor: selectedService?.id === service.id ? 'primary.main' : 'divider',
                                bgcolor: selectedService?.id === service.id ? 'primary.50' : 'background.paper',
                                transition: 'all 0.2s'
                            }}
                        >
                            <CardActionArea 
                                onClick={() => onSelect(service)} 
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>
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