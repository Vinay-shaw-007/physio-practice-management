import {
  Add as AddIcon,
  Business as ClinicIcon,
  Person as ProfileIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Upload as UploadIcon
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
  Container,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { doctorService } from '../services/doctorService';
import { ClinicSettings, settingsService } from '../services/settingsService';
import { useAppSelector } from '../store/store';
import { Doctor } from '../types';

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

const Settings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Clinic Settings State
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
    name: '', email: '', phone: '', address: '', website: '', taxId: '', currency: 'INR', consultationFee: 0
  });

  // Doctor Profile State
  const [doctorProfile, setDoctorProfile] = useState<Partial<Doctor>>({
    bio: '', specialization: '', qualifications: [], yearsOfExperience: 0
  });
  const [newQual, setNewQual] = useState('');

  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [settings, profile] = await Promise.all([
        settingsService.getSettings(),
        user?.id ? doctorService.getDoctorProfile(user.id) : Promise.resolve(null)
      ]);

      if (settings) setClinicSettings(settings);
      if (profile) setDoctorProfile(profile);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleSaveClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.saveSettings(clinicSettings);
      setSuccessMsg('Clinic settings saved successfully!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      await doctorService.updateDoctorProfile(user.id, doctorProfile);
      setSuccessMsg('Profile updated successfully!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClinicSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorProfile(prev => ({ ...prev, [name]: value }));
  };

  const addQualification = () => {
    if (newQual.trim()) {
      setDoctorProfile(prev => ({
        ...prev,
        qualifications: [...(prev.qualifications || []), newQual.trim()]
      }));
      setNewQual('');
    }
  };

  const removeQualification = (index: number) => {
    setDoctorProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications?.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth={"xl"} sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings & Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your clinic details, public profile, and account security.
      </Typography>

      <Grid container spacing={4}>
        {/* Left Sidebar - Tabs */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{ borderRight: 1, borderColor: 'divider', minHeight: 400 }}
            >
              <Tab icon={<ClinicIcon />} iconPosition="start" label="Clinic Info" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
              <Tab icon={<ProfileIcon />} iconPosition="start" label="My Profile" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" sx={{ justifyContent: 'flex-start', py: 2, minHeight: 60 }} />
            </Tabs>
          </Paper>
        </Grid>

        {/* Right Content - Panels */}
        <Grid size={{xs: 12, md: 9}}>

          {/* Panel 1: Clinic Info (For Invoices) */}
          <TabPanel value={activeTab} index={0}>
            <form onSubmit={handleSaveClinic}>
              <Card variant="outlined">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Clinic Details</Typography>
                    <Typography variant="body2" color="text.secondary">
                      This information appears on Invoices and patient emails.
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={{xs: 12}}>
                      <TextField
                        fullWidth label="Clinic / Practice Name" name="name"
                        value={clinicSettings.name} onChange={handleClinicChange} required
                      />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                      <TextField
                        fullWidth label="Phone Number" name="phone"
                        value={clinicSettings.phone} onChange={handleClinicChange} required
                      />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                      <TextField
                        fullWidth label="Email Address" name="email"
                        value={clinicSettings.email} onChange={handleClinicChange} required
                      />
                    </Grid>
                    <Grid size={{xs: 12}}>
                      <TextField
                        fullWidth multiline rows={3} label="Address" name="address"
                        value={clinicSettings.address} onChange={handleClinicChange} required
                      />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                      <TextField
                        fullWidth label="Website" name="website"
                        value={clinicSettings.website} onChange={handleClinicChange}
                      />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                      <TextField
                        fullWidth label="Tax ID / GSTIN" name="taxId"
                        value={clinicSettings.taxId} onChange={handleClinicChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit" variant="contained"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={saving}
                    >
                      Save Clinic Info
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </form>
          </TabPanel>

          {/* Panel 2: Doctor Profile (Merged here) */}
          <TabPanel value={activeTab} index={1}>
            <form onSubmit={handleSaveProfile}>
              <Card variant="outlined">
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={doctorProfile.avatar}
                      sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">Professional Profile</Typography>
                      <Button size="small" startIcon={<UploadIcon />}>Change Photo</Button>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label="Full Name" name="name"
                        value={doctorProfile.name || ''} onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label="Specialization" name="specialization"
                        placeholder="e.g. Sports Physiotherapy"
                        value={doctorProfile.specialization || ''} onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth type="number" label="Years of Experience" name="yearsOfExperience"
                        value={doctorProfile.yearsOfExperience || 0} onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth multiline rows={4} label="Bio / About Me" name="bio"
                        placeholder="Tell patients about your expertise..."
                        value={doctorProfile.bio || ''} onChange={handleProfileChange}
                      />
                    </Grid>

                    {/* Qualifications Section */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" gutterBottom>Qualifications & Certifications</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          size="small" fullWidth placeholder="Add qualification (e.g. BPT, MPT)"
                          value={newQual} onChange={(e) => setNewQual(e.target.value)}
                        />
                        <Button variant="outlined" onClick={addQualification} startIcon={<AddIcon />}>
                          Add
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {doctorProfile.qualifications?.map((q, i) => (
                          <Chip key={i} label={q} onDelete={() => removeQualification(i)} />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit" variant="contained"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={saving}
                    >
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </form>
          </TabPanel>

          {/* Panel 3: Security */}
          <TabPanel value={activeTab} index={2}>
            <Card variant="outlined">
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Security Settings</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Update your password to keep your account secure.
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth type="password" label="Current Password" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth type="password" label="New Password" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth type="password" label="Confirm Password" />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary">Change Password</Button>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

        </Grid>
      </Grid>

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
  );
};

export default Settings;