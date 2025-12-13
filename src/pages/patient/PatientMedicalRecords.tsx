import { MedicalRecord } from '@/types';
import {
    Description as DescriptionIcon,
    FilterList as FilterListIcon,
    LocalHospital as HospitalIcon,
    MedicalServices as MedicalServicesIcon,
    Medication as MedicationIcon,
    Science as ScienceIcon,
    Search as SearchIcon,
    Vaccines as VaccineIcon
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
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';

const getRecordIcon = (type: MedicalRecord['type']) => {
    switch (type) {
        case 'CONSULTATION': return <HospitalIcon />;
        case 'LAB_TEST': return <ScienceIcon />;
        case 'PRESCRIPTION': return <MedicationIcon />;
        case 'VACCINATION': return <VaccineIcon />;
        case 'SURGERY': return <MedicalServicesIcon />;
        default: return <DescriptionIcon />;
    }
};

const getRecordColor = (type: MedicalRecord['type']) => {
    switch (type) {
        case 'CONSULTATION': return 'primary';
        case 'LAB_TEST': return 'info';
        case 'PRESCRIPTION': return 'success';
        case 'VACCINATION': return 'warning';
        case 'SURGERY': return 'error';
        default: return 'default';
    }
};

const PatientMedicalRecords: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    useEffect(() => {
        loadRecords();
    }, []);

    useEffect(() => {
        filterRecords();
    }, [records, searchTerm, typeFilter, dateFilter]);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const data = await patientService.getMedicalRecords(user?.id || 'patient1');
            setRecords(data);
            setFilteredRecords(data);
        } catch (error) {
            console.error('Failed to load records:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRecords = () => {
        let filtered = [...records];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (record) =>
                    record.title.toLowerCase().includes(term) ||
                    record.description.toLowerCase().includes(term) ||
                    record.doctorName.toLowerCase().includes(term)
            );
        }

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter((record) => record.type === typeFilter);
        }

        if (dateFilter) {
            const filterDateStr = format(dateFilter, 'yyyy-MM-dd');
            filtered = filtered.filter(
                (record) => format(new Date(record.date), 'yyyy-MM-dd') === filterDateStr
            );
        }

        setFilteredRecords(filtered);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Medical Records
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        View and manage your complete medical history.
                    </Typography>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Record Type</InputLabel>
                                <Select
                                    value={typeFilter}
                                    label="Record Type"
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <MenuItem value="ALL">All Types</MenuItem>
                                    <MenuItem value="CONSULTATION">Consultation</MenuItem>
                                    <MenuItem value="LAB_TEST">Lab Test</MenuItem>
                                    <MenuItem value="PRESCRIPTION">Prescription</MenuItem>
                                    <MenuItem value="VACCINATION">Vaccination</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <DatePicker
                                label="Filter by Date"
                                value={dateFilter}
                                onChange={(date) => setDateFilter(date)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={() => {
                                    setSearchTerm('');
                                    setTypeFilter('ALL');
                                    setDateFilter(null);
                                }}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Records Timeline */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredRecords.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                        <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No records found
                        </Typography>
                    </Paper>
                ) : (
                    <Box>
                        {filteredRecords.map((record) => (
                            <Card key={record.id} sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { sm: 'center' }, borderRight: { sm: 1 }, borderColor: 'divider' }}>
                                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                                {format(new Date(record.date), 'dd')}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                                                {format(new Date(record.date), 'MMM yyyy')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 10 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: `${getRecordColor(record.type)}.main` }}>
                                                        {getRecordIcon(record.type)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {record.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Dr. {record.doctorName}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={record.type.replace('_', ' ')}
                                                    size="small"
                                                    color={getRecordColor(record.type) as any}
                                                    variant="outlined"
                                                />
                                            </Box>
                                            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                                                {record.description}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {record.tags.map((tag) => (
                                                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'grey.100' }} />
                                                ))}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </LocalizationProvider>
    );
};

export default PatientMedicalRecords;