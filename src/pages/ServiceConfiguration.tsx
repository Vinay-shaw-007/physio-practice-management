// import { filterServices } from '@/store/slices/serviceSlice';
// import { useAppDispatch } from '@/store/store';
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    LocalHospital as ClinicIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Home as HomeIcon,
    MedicalServices as MedicalServicesIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Videocam as VideoIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { serviceService } from '../services/serviceConfigurationService';
import { Service, ServiceType } from '../types';


const serviceTypeOptions = [
    { value: ServiceType.CLINIC_VISIT, label: 'Clinic Visit', icon: <ClinicIcon fontSize="small" />, color: '#3b82f6' },
    { value: ServiceType.HOME_VISIT, label: 'Home Visit', icon: <HomeIcon fontSize="small" />, color: '#8b5cf6' },
    { value: ServiceType.VIDEO_CONSULT, label: 'Video Consultation', icon: <VideoIcon fontSize="small" />, color: '#06b6d4' },
];

const getServiceTypeIcon = (type: ServiceType) => {
    return serviceTypeOptions.find(option => option.value === type)?.icon;
};

const getServiceTypeColor = (type: ServiceType) => {
    return serviceTypeOptions.find(option => option.value === type)?.color || '#64748b';
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const validationSchema = yup.object({
    name: yup.string().required('Service name is required').min(3, 'Name must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    type: yup.string().required('Service type is required'),
    duration: yup.number().required('Duration is required').min(15, 'Minimum duration is 15 minutes').max(240, 'Maximum duration is 240 minutes'),
    price: yup.number().required('Price is required').min(0, 'Price cannot be negative'),
});

interface ServiceStats {
    total: number;
    active: number;
    inactive: number;
    byType: Record<ServiceType, number>;
    averagePrice: number;
    averageDuration: number;
}    

const ServiceConfiguration: React.FC = () => {
    // const { filteredServices, selectedServices, loading, services, stats } = useAppSelector(state => state.services);
    // const dispatch = useAppDispatch();
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<ServiceType | 'ALL'>('ALL');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [stats, setStats] = useState<ServiceStats>({
        total: 0,
        active: 0,
        inactive: 0,
        byType: {
            [ServiceType.CLINIC_VISIT]: 0,
            [ServiceType.HOME_VISIT]: 0,
            [ServiceType.VIDEO_CONSULT]: 0,
        },
        averagePrice: 0,
        averageDuration: 0,
    });

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    // Menu states
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedServiceMenu, setSelectedServiceMenu] = useState<Service | null>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            type: ServiceType.CLINIC_VISIT,
            duration: 30,
            price: 600,
            isActive: true,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (editingService) {
                    await serviceService.updateService(editingService.id, values);
                } else {
                    await serviceService.createService(values);
                }
                await loadData();
                handleCloseDialog();
            } catch (error) {
                console.error('Failed to save service:', error);
            }
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterdServices();
    }, [services, activeTab, searchTerm, selectedType]);

    const loadData = async () => {
        setLoading(true);
        try {
            const servicesData = await serviceService.getServices();
            const statsData = await serviceService.getServiceStats();
            setServices(servicesData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterdServices = () => {
        let filtered = services;

        // Filter by tab
        if (activeTab === 'active') {
            filtered = filtered.filter(service => service.isActive);
        } else if (activeTab === 'inactive') {
            filtered = filtered.filter(service => !service.isActive);
        }

        // Filter by type
        if (selectedType !== 'ALL') {
            filtered = filtered.filter(service => service.type === selectedType);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term)
            );
        }
        // dispatch(filterServices(filtered));
        setFilteredServices(filtered);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: 'all' | 'active' | 'inactive') => {
        setActiveTab(newValue);
        // dispatch(setSelectedServices([]))
        setSelectedServices([]); // Clear selections when changing tabs
    };

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            formik.setValues({
                name: service.name,
                description: service.description,
                type: service.type,
                duration: service.duration,
                price: service.price,
                isActive: service.isActive,
            });
        } else {
            setEditingService(null);
            formik.resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        formik.resetForm();
    };

    const handleDeleteClick = (service: Service) => {
        setServiceToDelete(service);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (serviceToDelete) {
            try {
                await serviceService.deleteService(serviceToDelete.id);
                // await loadData();
                setDeleteDialogOpen(false);
                setServiceToDelete(null);
            } catch (error) {
                console.error('Failed to delete service:', error);
            }
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await serviceService.toggleServiceStatus(id, services);
            await loadData();
        } catch (error) {
            console.error('Failed to toggle service status:', error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: Service) => {
        setAnchorEl(event.currentTarget);
        setSelectedServiceMenu(service);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedServiceMenu(null);
    };

    const handleSelectService = (id: string) => {
        const newSelectedServices = selectedServices.includes(id) ? selectedServices.filter(sid => sid !== id) : [...selectedServices, id];
        setSelectedServices(newSelectedServices);
        // dispatch(setSelectedServices(newSelectedServices));
    };

    const handleBulkAction = (_action: 'activate' | 'deactivate' | 'delete') => {
        setBulkActionDialogOpen(true);
        // In a real app, you would dispatch the bulk action here
    };

    const handleBulkActionConfirm = async () => {
        try {
            // Implement bulk actions here
            setBulkActionDialogOpen(false);
            // dispatch(setSelectedServices([]));
            setSelectedServices([]);
            await loadData();
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography>Loading services...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Service Configuration
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your consultation services, prices, and availability
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add New Service
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" gutterBottom>
                                Total Services
                            </Typography>
                            <Typography variant="h4">
                                {stats.total}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                                <Typography variant="caption" color="text.secondary">
                                    {stats.active} active
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" gutterBottom>
                                Avg. Price
                            </Typography>
                            <Typography variant="h4">
                                {formatCurrency(stats.averagePrice)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                per consultation
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" gutterBottom>
                                Avg. Duration
                            </Typography>
                            <Typography variant="h4">
                                {Math.round(stats.averageDuration)} min
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                per session
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" gutterBottom>
                                Service Types
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {serviceTypeOptions.map(type => (
                                    <Chip
                                        key={type.value}
                                        label={type.label}
                                        size="small"
                                        icon={type.icon}
                                        sx={{ bgcolor: `${type.color}10`, color: type.color, borderColor: type.color }}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Actions Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Service Type</InputLabel>
                            <Select
                                value={selectedType}
                                label="Service Type"
                                onChange={(e) => setSelectedType(e.target.value as ServiceType | 'ALL')}
                            >
                                <MenuItem value="ALL">All Types</MenuItem>
                                {serviceTypeOptions.map(type => (
                                    <MenuItem key={type.value} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {type.icon}
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {selectedServices.length > 0 && (
                                <>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleBulkAction('activate')}
                                    >
                                        Activate ({selectedServices.length})
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleBulkAction('deactivate')}
                                    >
                                        Deactivate ({selectedServices.length})
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleBulkAction('delete')}
                                    >
                                        Delete ({selectedServices.length})
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                            {filteredServices.length} of {services.length} services
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label={`All Services (${services.length})`} value="all" />
                    <Tab label={`Active (${stats.active})`} value="active" />
                    <Tab label={`Inactive (${stats.inactive})`} value="inactive" />
                </Tabs>
            </Paper>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <MedicalServicesIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No services found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {searchTerm || selectedType !== 'ALL'
                            ? 'Try adjusting your filters'
                            : 'Get started by adding your first service'}
                    </Typography>
                    {!searchTerm && selectedType === 'ALL' && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2 }}
                        >
                            Add Service
                        </Button>
                    )}
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredServices.map((service) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={service.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: selectedServices.includes(service.id) ? '2px solid #3b82f6' : '1px solid rgba(0, 0, 0, 0.12)',
                                    position: 'relative',
                                    transition: 'border-color 0.2s',
                                }}
                            >
                                <CardContent>
                                    {/* Selection Checkbox */}
                                    {/* <Box sx={{ position: 'absolute', top: 8, right: 44 }}>
                                        <Checkbox
                                            size="small"
                                            checked={selectedServices.includes(service.id)}
                                            onChange={() => handleSelectService(service.id)}
                                        />
                                    </Box> */}

                                    {/* Service Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ flex: 1, pr: 2 }}>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {service.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Chip
                                                    size="small"
                                                    label={serviceTypeOptions.find(t => t.value === service.type)?.label}
                                                    icon={getServiceTypeIcon(service.type)}
                                                    sx={{
                                                        bgcolor: `${getServiceTypeColor(service.type)}10`,
                                                        color: getServiceTypeColor(service.type),
                                                        borderColor: getServiceTypeColor(service.type),
                                                    }}
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    size="small"
                                                    label={service.isActive ? 'Active' : 'Inactive'}
                                                    color={service.isActive ? 'success' : 'default'}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Checkbox
                                                size="small"
                                                checked={selectedServices.includes(service.id)}
                                                onChange={() => handleSelectService(service.id)}
                                                slotProps={{
                                                    input: {
                                                        'aria-label': `Select ${service.name}`
                                                    }
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, service)}
                                                aria-label={`Open menu for ${service.name}`}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                        {/* <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, service)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton> */}
                                    </Box>

                                    {/* Service Description */}
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {service.description}
                                    </Typography>

                                    {/* Service Details */}
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Duration
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {service.duration} min
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Price
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formatCurrency(service.price)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleOpenDialog(service)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            color={service.isActive ? 'warning' : 'success'}
                                            startIcon={service.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            onClick={() => handleToggleStatus(service.id)}
                                        >
                                            {service.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Service Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Service Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                placeholder="e.g., Clinic Consultation, Home Visit"
                            />

                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                rows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                placeholder="Describe what this service includes"
                            />

                            <FormControl fullWidth>
                                <InputLabel id="type-label">Service Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type"
                                    name="type"
                                    value={formik.values.type}
                                    label="Service Type"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    {serviceTypeOptions.map(type => (
                                        <MenuItem key={type.value} value={type.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {type.icon}
                                                {type.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="duration"
                                        name="duration"
                                        label="Duration (minutes)"
                                        type="number"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.duration && Boolean(formik.errors.duration)}
                                        helperText={formik.touched.duration && formik.errors.duration}
                                        InputProps={{
                                            inputProps: { min: 15, step: 15 },
                                            endAdornment: <InputAdornment position="end">min</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="price"
                                        name="price"
                                        label="Price (₹)"
                                        type="number"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                        helperText={formik.touched.price && formik.errors.price}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            inputProps: { min: 0, step: 100 },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <FormControlLabel
                                control={
                                    <Switch
                                        id="isActive"
                                        name="isActive"
                                        checked={formik.values.isActive}
                                        onChange={formik.handleChange}
                                        color="primary"
                                    />
                                }
                                label="Active (Patients can book this service)"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingService ? 'Update Service' : 'Add Service'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
                    </Typography>
                    {serviceToDelete?.isActive && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This service is currently active. Patients will no longer be able to book it.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete Service
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Action Dialog */}
            <Dialog open={bulkActionDialogOpen} onClose={() => setBulkActionDialogOpen(false)}>
                <DialogTitle>Confirm Bulk Action</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to perform this action on {selectedServices.length} selected services?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkActionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleBulkActionConfirm} variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Service Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    if (selectedServiceMenu) {
                        handleOpenDialog(selectedServiceMenu);
                        handleMenuClose();
                    }
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedServiceMenu) {
                        handleToggleStatus(selectedServiceMenu.id);
                        handleMenuClose();
                    }
                }}>
                    {selectedServiceMenu?.isActive ? (
                        <>
                            <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
                            Deactivate
                        </>
                    ) : (
                        <>
                            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                            Activate
                        </>
                    )}
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        if (selectedServiceMenu) {
                            handleDeleteClick(selectedServiceMenu);
                            handleMenuClose();
                        }
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mt: 4 }}>
                <Typography variant="body2">
                    <strong>Best Practices:</strong>
                    <ul style={{ marginTop: 4, marginBottom: 4, paddingLeft: 20 }}>
                        <li>Keep service descriptions clear and concise for patients</li>
                        <li>Set realistic durations based on your typical consultation time</li>
                        <li>Deactivate services temporarily if you're not available for that type</li>
                        <li>Review and update prices periodically based on market rates</li>
                        <li>Use consistent naming conventions for similar services</li>
                    </ul>
                </Typography>
            </Alert>
        </Box>
    );
};

export default ServiceConfiguration;