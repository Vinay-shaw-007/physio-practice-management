// import {
//     AccountCircle,
//     ContactEmergency,
//     LocalHospital,
//     Save as SaveIcon,
//     Lock as SecurityIcon,
//     Upload as UploadIcon
// } from '@mui/icons-material';
// import {
//     Alert,
//     Avatar,
//     Box,
//     Button,
//     Card,
//     CardContent,
//     CircularProgress,
//     Container,
//     FormControl,
//     Grid,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     Snackbar,
//     Tab,
//     Tabs,
//     TextField,
//     Typography
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import React, { useEffect, useState } from 'react';
// import { patientService } from '../../services/patientService';
// import { useAppSelector } from '../../store/store';
// import { Patient } from '../../types';

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
//     <div hidden={value !== index} role="tabpanel">
//         {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
// );

// const PatientSettings: React.FC = () => {
//     const { user } = useAppSelector((state) => state.auth);
//     const [activeTab, setActiveTab] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [successMsg, setSuccessMsg] = useState('');

//     // Patient Data State
//     const [patientData, setPatientData] = useState<Partial<Patient>>({
//         name: '', email: '', phone: '', address: '',
//         gender: undefined, bloodGroup: '',
//         emergencyContact: { name: '', relationship: '', phone: '' }
//     });

//     // Password State
//     const [passwords, setPasswords] = useState({
//         current: '', new: '', confirm: ''
//     });

//     useEffect(() => {
//         if (user?.id) loadData(user.id);
//     }, [user]);

//     const loadData = async (id: string) => {
//         setLoading(true);
//         try {
//             const data = await patientService.getPatientProfile(id);
//             if (data) setPatientData(data);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSaveProfile = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setSaving(true);
//         try {
//             if (user?.id) {
//                 await patientService.updatePatientProfile(user.id, patientData);
//                 setSuccessMsg('Profile updated successfully!');
//             }
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handlePasswordChange = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (passwords.new !== passwords.confirm) {
//             alert("New passwords don't match!");
//             return;
//         }
//         setSaving(true);
//         // Simulate API call
//         setTimeout(() => {
//             setSaving(false);
//             setSuccessMsg('Password changed successfully!');
//             setPasswords({ current: '', new: '', confirm: '' });
//         }, 1000);
//     };

//     const handleChange = (field: keyof Patient | string, value: any) => {
//         if (field.startsWith('emergencyContact.')) {
//             const contactField = field.split('.')[1];
//             setPatientData(prev => ({
//                 ...prev,
//                 emergencyContact: {
//                     ...prev.emergencyContact!,
//                     [contactField]: value
//                 }
//             }));
//         } else {
//             setPatientData(prev => ({ ...prev, [field]: value }));
//         }
//     };

//     if (loading) {
//         return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
//     }

//     return (
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Container maxWidth="xl" sx={{ py: 4 }}>
//                 <Typography variant="h4" fontWeight="bold" gutterBottom>
//                     Account Settings
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//                     Manage your personal profile, medical info, and security.
//                 </Typography>

//                 <Grid container spacing={4}>
//                     {/* Left Sidebar */}
//                     <Grid size={{ xs: 12, md: 3 }}>
//                         <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
//                             <Tabs
//                                 orientation="vertical"
//                                 variant="scrollable"
//                                 value={activeTab}
//                                 onChange={(_, v) => setActiveTab(v)}
//                                 sx={{ borderRight: 1, borderColor: 'divider', minHeight: 400 }}
//                             >
//                                 <Tab icon={<AccountCircle />} iconPosition="start" label="General Info" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
//                                 <Tab icon={<LocalHospital />} iconPosition="start" label="Medical Info" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
//                                 <Tab icon={<ContactEmergency />} iconPosition="start" label="Emergency Contact" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
//                                 <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
//                             </Tabs>
//                         </Paper>
//                     </Grid>

//                     {/* Right Content */}
//                     <Grid size={{ xs: 12, md: 9 }}>

//                         {/* Tab 0: General Info */}
//                         <TabPanel value={activeTab} index={0}>
//                             <form onSubmit={handleSaveProfile}>
//                                 <Card variant="outlined">
//                                     <CardContent sx={{ p: 4 }}>
//                                         <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
//                                             <Avatar
//                                                 src={patientData.avatar}
//                                                 sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}
//                                             >
//                                                 {patientData.name?.charAt(0)}
//                                             </Avatar>
//                                             <Box>
//                                                 <Typography variant="h6">Profile Photo</Typography>
//                                                 <Button size="small" startIcon={<UploadIcon />}>Upload New</Button>
//                                             </Box>
//                                         </Box>
//                                         <Grid container spacing={3}>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Full Name" value={patientData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Email" value={patientData.email || ''} disabled />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Phone" value={patientData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <FormControl fullWidth>
//                                                     <InputLabel>Gender</InputLabel>
//                                                     <Select
//                                                         value={patientData.gender || ''}
//                                                         label="Gender"
//                                                         onChange={(e) => handleChange('gender', e.target.value)}
//                                                     >
//                                                         <MenuItem value="MALE">Male</MenuItem>
//                                                         <MenuItem value="FEMALE">Female</MenuItem>
//                                                         <MenuItem value="OTHER">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid size={{ xs: 12 }}>
//                                                 <TextField fullWidth multiline rows={2} label="Address" value={patientData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
//                                             </Grid>
//                                         </Grid>
//                                         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                                             <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Changes</Button>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </form>
//                         </TabPanel>

//                         {/* Tab 1: Medical Info */}
//                         <TabPanel value={activeTab} index={1}>
//                             <form onSubmit={handleSaveProfile}>
//                                 <Card variant="outlined">
//                                     <CardContent sx={{ p: 4 }}>
//                                         <Typography variant="h6" gutterBottom>Medical Details</Typography>
//                                         <Grid container spacing={3}>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Blood Group" value={patientData.bloodGroup || ''} onChange={(e) => handleChange('bloodGroup', e.target.value)} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <DatePicker
//                                                     label="Date of Birth"
//                                                     value={patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null}
//                                                     onChange={(d) => handleChange('dateOfBirth', d)}
//                                                     slotProps={{ textField: { fullWidth: true } }}
//                                                 />
//                                             </Grid>
//                                             <Grid size={{ xs: 6 }}>
//                                                 <TextField fullWidth type="number" label="Height (cm)" value={patientData.height || ''} onChange={(e) => handleChange('height', parseInt(e.target.value))} />
//                                             </Grid>
//                                             <Grid size={{ xs: 6 }}>
//                                                 <TextField fullWidth type="number" label="Weight (kg)" value={patientData.weight || ''} onChange={(e) => handleChange('weight', parseInt(e.target.value))} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12 }}>
//                                                 <TextField fullWidth multiline rows={3} label="Medical History / Allergies" value={patientData.medicalHistory || ''} onChange={(e) => handleChange('medicalHistory', e.target.value)} />
//                                             </Grid>
//                                         </Grid>
//                                         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                                             <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Medical Info</Button>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </form>
//                         </TabPanel>

//                         {/* Tab 2: Emergency Contact */}
//                         <TabPanel value={activeTab} index={2}>
//                             <form onSubmit={handleSaveProfile}>
//                                 <Card variant="outlined">
//                                     <CardContent sx={{ p: 4 }}>
//                                         <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
//                                         <Grid container spacing={3}>
//                                             <Grid size={{ xs: 12 }}>
//                                                 <TextField fullWidth label="Contact Name" value={patientData.emergencyContact?.name || ''} onChange={(e) => handleChange('emergencyContact.name', e.target.value)} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Relationship" value={patientData.emergencyContact?.relationship || ''} onChange={(e) => handleChange('emergencyContact.relationship', e.target.value)} />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField fullWidth label="Phone Number" value={patientData.emergencyContact?.phone || ''} onChange={(e) => handleChange('emergencyContact.phone', e.target.value)} />
//                                             </Grid>
//                                         </Grid>
//                                         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                                             <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Contact</Button>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </form>
//                         </TabPanel>

//                         {/* Tab 3: Security */}
//                         <TabPanel value={activeTab} index={3}>
//                             <form onSubmit={handlePasswordChange}>
//                                 <Card variant="outlined">
//                                     <CardContent sx={{ p: 4 }}>
//                                         <Typography variant="h6" gutterBottom>Change Password</Typography>
//                                         <Grid container spacing={3}>
//                                             <Grid size={{ xs: 12 }}>
//                                                 <TextField
//                                                     fullWidth type="password" label="Current Password"
//                                                     value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                                                 />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField
//                                                     fullWidth type="password" label="New Password"
//                                                     value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                                                 />
//                                             </Grid>
//                                             <Grid size={{ xs: 12, sm: 6 }}>
//                                                 <TextField
//                                                     fullWidth type="password" label="Confirm Password"
//                                                     value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//                                             <Button type="submit" variant="contained" color="warning" disabled={saving}>
//                                                 Update Password
//                                             </Button>
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </form>
//                         </TabPanel>

//                     </Grid>
//                 </Grid>

//                 <Snackbar
//                     open={!!successMsg}
//                     autoHideDuration={6000}
//                     onClose={() => setSuccessMsg('')}
//                 >
//                     <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
//                         {successMsg}
//                     </Alert>
//                 </Snackbar>
//             </Container>
//         </LocalizationProvider>
//     );
// };

// export default PatientSettings;

import {
    AccountCircle,
    ContactEmergency,
    LocalHospital,
    Lock as SecurityIcon,
    Save as SaveIcon,
    Upload as UploadIcon
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
    FormControl,
    Grid, 
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';
import { Patient } from '../../types';

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

const PatientSettings: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    
    const [patientData, setPatientData] = useState<Partial<Patient>>({
        name: '', email: '', phone: '', address: '', 
        gender: undefined, bloodGroup: '', 
        emergencyContact: { name: '', relationship: '', phone: '' }
    });

    const [passwords, setPasswords] = useState({
        current: '', new: '', confirm: ''
    });

    useEffect(() => {
        if (user?.id) loadData(user.id);
    }, [user]);

    const loadData = async (id: string) => {
        setLoading(true);
        try {
            const data = await patientService.getPatientProfile(id);
            if (data) setPatientData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (user?.id) {
                await patientService.updatePatientProfile(user.id, patientData);
                setSuccessMsg('Profile updated successfully!');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("New passwords don't match!");
            return;
        }
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSuccessMsg('Password changed successfully!');
            setPasswords({ current: '', new: '', confirm: '' });
        }, 1000);
    };

    const handleChange = (field: keyof Patient | string, value: any) => {
        if (field.startsWith('emergencyContact.')) {
            const contactField = field.split('.')[1];
            setPatientData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact!, [contactField]: value }
            }));
        } else {
            setPatientData(prev => ({ ...prev, [field]: value }));
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Account Settings
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your personal profile, medical info, and security.
                </Typography>

                {/* HORIZONTAL TABS LAYOUT */}
                <Paper sx={{ mb: 3, borderRadius: 1 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 54,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                            }
                        }}
                    >
                        <Tab icon={<AccountCircle />} iconPosition="start" label="General Info" />
                        <Tab icon={<LocalHospital />} iconPosition="start" label="Medical Info" />
                        <Tab icon={<ContactEmergency />} iconPosition="start" label="Emergency Contact" />
                        <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
                    </Tabs>
                </Paper>

                {/* CONTENT AREA */}
                
                {/* Tab 0: General Info */}
                <TabPanel value={activeTab} index={0}>
                    <form onSubmit={handleSaveProfile}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar 
                                        src={patientData.avatar} 
                                        sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}
                                    >
                                        {patientData.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">Profile Photo</Typography>
                                        <Button size="small" startIcon={<UploadIcon />}>Upload New</Button>
                                    </Box>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Full Name" value={patientData.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Email" value={patientData.email || ''} disabled />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Phone" value={patientData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Gender</InputLabel>
                                            <Select 
                                                value={patientData.gender || ''} 
                                                label="Gender"
                                                onChange={(e) => handleChange('gender', e.target.value)}
                                            >
                                                <MenuItem value="MALE">Male</MenuItem>
                                                <MenuItem value="FEMALE">Female</MenuItem>
                                                <MenuItem value="OTHER">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth multiline rows={2} label="Address" value={patientData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Changes</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                </TabPanel>

                {/* Tab 1: Medical Info */}
                <TabPanel value={activeTab} index={1}>
                    <form onSubmit={handleSaveProfile}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                <Typography variant="h6" gutterBottom>Medical Details</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Blood Group" value={patientData.bloodGroup || ''} onChange={(e) => handleChange('bloodGroup', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <DatePicker 
                                            label="Date of Birth"
                                            value={patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null}
                                            onChange={(d) => handleChange('dateOfBirth', d)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField fullWidth type="number" label="Height (cm)" value={patientData.height || ''} onChange={(e) => handleChange('height', parseInt(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField fullWidth type="number" label="Weight (kg)" value={patientData.weight || ''} onChange={(e) => handleChange('weight', parseInt(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth multiline rows={3} label="Medical History / Allergies" value={patientData.medicalHistory || ''} onChange={(e) => handleChange('medicalHistory', e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Medical Info</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                </TabPanel>

                {/* Tab 2: Emergency Contact */}
                <TabPanel value={activeTab} index={2}>
                    <form onSubmit={handleSaveProfile}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth label="Contact Name" value={patientData.emergencyContact?.name || ''} onChange={(e) => handleChange('emergencyContact.name', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Relationship" value={patientData.emergencyContact?.relationship || ''} onChange={(e) => handleChange('emergencyContact.relationship', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Phone Number" value={patientData.emergencyContact?.phone || ''} onChange={(e) => handleChange('emergencyContact.phone', e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>Save Contact</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                </TabPanel>

                {/* Tab 3: Security */}
                <TabPanel value={activeTab} index={3}>
                    <form onSubmit={handlePasswordChange}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Change Password</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField 
                                            fullWidth type="password" label="Current Password" 
                                            value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth type="password" label="New Password" 
                                            value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth type="password" label="Confirm Password" 
                                            value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" color="warning" disabled={saving}>
                                        Update Password
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                </TabPanel>

                <Snackbar
                    open={!!successMsg}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMsg('')}
                >
                    <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%' }}>
                        {successMsg}
                    </Alert>
                </Snackbar>
            </Container>
        </LocalizationProvider>
    );
};

export default PatientSettings;