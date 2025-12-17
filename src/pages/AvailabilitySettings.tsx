// import {
//    AccessTime as AccessTimeIcon,
//    Add as AddIcon,
//    Delete as DeleteIcon,
//    Edit as EditIcon,
//    EventBusy as EventBusyIcon,
//    Schedule as ScheduleIcon,
// } from '@mui/icons-material';
// import {
//    Alert,
//    Box,
//    Button,
//    Card,
//    CardContent,
//    Chip,
//    Divider,
//    FormControlLabel,
//    Grid,
//    IconButton,
//    MenuItem,
//    Paper,
//    Stack,
//    Switch,
//    Tab,
//    Tabs,
//    TextField,
//    Typography,
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import React, { useEffect, useState } from 'react';
// import { availabilityService } from '../services/availabilityService';
// import { useAppSelector } from '../store/store';
// import { AvailabilitySlot, Unavailability } from '../types';

// const DAYS_OF_WEEK = [
//    { value: 0, label: 'Sunday', short: 'Sun' },
//    { value: 1, label: 'Monday', short: 'Mon' },
//    { value: 2, label: 'Tuesday', short: 'Tue' },
//    { value: 3, label: 'Wednesday', short: 'Wed' },
//    { value: 4, label: 'Thursday', short: 'Thu' },
//    { value: 5, label: 'Friday', short: 'Fri' },
//    { value: 6, label: 'Saturday', short: 'Sat' },
// ];

// interface TabPanelProps {
//    children?: React.ReactNode;
//    index: number;
//    value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
//    return (
//       <div hidden={value !== index}>
//          {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
//       </div>
//    );
// };

// const AvailabilitySettings: React.FC = () => {
//    const { user } = useAppSelector((state) => state.auth);
//    const [activeTab, setActiveTab] = useState(0);
//    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
//    const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
//    const [loading, setLoading] = useState(true);
//    const [isEditingSlot, setIsEditingSlot] = useState(false);
//    const [isEditingUnavailability, setIsEditingUnavailability] = useState(false);

//    // Form states with proper time handling
//    const [slotForm, setSlotForm] = useState({
//       id: '',
//       dayOfWeek: 1,
//       startTime: new Date(new Date().setHours(9, 0, 0, 0)),
//       endTime: new Date(new Date().setHours(17, 0, 0, 0)),
//       isRecurring: true,
//       slotDuration: 30,
//    });

//    const [unavailabilityForm, setUnavailabilityForm] = useState({
//       id: '',
//       title: '',
//       startDate: new Date(),
//       endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//       reason: '',
//       isAllDay: true,
//    });

//    useEffect(() => {
//       loadData();
//    }, []);

//    const loadData = async () => {
//       setLoading(true);
//       try {
//          const [slots, unavail] = await Promise.all([
//             availabilityService.getAvailabilitySlots(user?.id || '1'),
//             availabilityService.getUnavailability(user?.id || '1'),
//          ]);
//          setAvailabilitySlots(slots);
//          setUnavailability(unavail);
//       } catch (error) {
//          console.error('Failed to load availability data:', error);
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//       setActiveTab(newValue);
//    };

//    // Helper function to format Date to time string (HH:mm)
//    const formatTime = (date: Date): string => {
//       const hours = date.getHours().toString().padStart(2, '0');
//       const minutes = date.getMinutes().toString().padStart(2, '0');
//       return `${hours}:${minutes}`;
//    };

//    // Helper to parse time string to Date
//    const parseTimeString = (timeString: string): Date => {
//       const [hours, minutes] = timeString.split(':').map(Number);
//       const date = new Date();
//       date.setHours(hours, minutes, 0, 0);
//       return date;
//    };

//    // Helper to format time string for display
//    const formatTimeDisplay = (time: string): string => {
//       const [hours, minutes] = time.split(':').map(Number);
//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       const displayHours = hours % 12 || 12;
//       return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
//    };

//    const handleSaveSlot = async () => {
//       try {
//          // Convert Date objects to time strings
//          const slotData = {
//             doctorId: user?.id || '1',
//             dayOfWeek: slotForm.dayOfWeek,
//             startTime: formatTime(slotForm.startTime),
//             endTime: formatTime(slotForm.endTime),
//             isRecurring: slotForm.isRecurring,
//             slotDuration: slotForm.slotDuration,
//             maxAppointmentsPerSlot: 1,
//          };

//          if (isEditingSlot) {
//             // Update existing slot
//             await availabilityService.updateAvailabilitySlot(slotForm.id, slotData);
//          } else {
//             // Create new slot
//             await availabilityService.createAvailabilitySlot(slotData);
//          }

//          await loadData();
//          resetSlotForm();
//       } catch (error) {
//          console.error('Failed to save slot:', error);
//       }
//    };

//    const handleSaveUnavailability = async () => {
//       try {
//          const unavailabilityData = {
//             doctorId: user?.id || '1',
//             title: unavailabilityForm.title,
//             startDate: unavailabilityForm.startDate,
//             endDate: unavailabilityForm.endDate,
//             reason: unavailabilityForm.reason,
//             isAllDay: unavailabilityForm.isAllDay,
//          };

//          if (isEditingUnavailability) {
//             // Update existing - for mock, delete and recreate
//             await availabilityService.deleteUnavailability(unavailabilityForm.id);
//             await availabilityService.createUnavailability(unavailabilityData);
//          } else {
//             // Create new
//             await availabilityService.createUnavailability(unavailabilityData);
//          }

//          await loadData();
//          resetUnavailabilityForm();
//       } catch (error) {
//          console.error('Failed to save unavailability:', error);
//       }
//    };

//    const handleEditSlot = (slot: AvailabilitySlot) => {
//       // Convert time strings back to Date objects for the form
//       const startTime = parseTimeString(slot.startTime);
//       const endTime = parseTimeString(slot.endTime);

//       setSlotForm({
//          id: slot.id,
//          dayOfWeek: slot.dayOfWeek,
//          startTime,
//          endTime,
//          isRecurring: slot.isRecurring,
//          slotDuration: slot.slotDuration || 30,
//       });
//       setIsEditingSlot(true);
//    };

//    const handleEditUnavailability = (item: Unavailability) => {
//       setUnavailabilityForm({
//          id: item.id,
//          title: item.title,
//          startDate: new Date(item.startDate),
//          endDate: new Date(item.endDate),
//          reason: item.reason,
//          isAllDay: item.isAllDay,
//       });
//       setIsEditingUnavailability(true);
//    };

//    const handleDeleteSlot = async (id: string) => {
//       if (window.confirm('Are you sure you want to delete this availability slot?')) {
//          try {
//             await availabilityService.deleteAvailabilitySlot(id);
//             await loadData();
//          } catch (error) {
//             console.error('Failed to delete slot:', error);
//          }
//       }
//    };

//    const handleDeleteUnavailability = async (id: string) => {
//       if (window.confirm('Are you sure you want to delete this time off?')) {
//          try {
//             await availabilityService.deleteUnavailability(id);
//             await loadData();
//          } catch (error) {
//             console.error('Failed to delete unavailability:', error);
//          }
//       }
//    };

//    const resetSlotForm = () => {
//       setSlotForm({
//          id: '',
//          dayOfWeek: 1,
//          startTime: new Date(new Date().setHours(9, 0, 0, 0)),
//          endTime: new Date(new Date().setHours(17, 0, 0, 0)),
//          isRecurring: true,
//          slotDuration: 30,
//       });
//       setIsEditingSlot(false);
//    };

//    const resetUnavailabilityForm = () => {
//       setUnavailabilityForm({
//          id: '',
//          title: '',
//          startDate: new Date(),
//          endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//          reason: '',
//          isAllDay: true,
//       });
//       setIsEditingUnavailability(false);
//    };

//    const groupSlotsByDay = () => {
//       const grouped: Record<number, AvailabilitySlot[]> = {};

//       // Initialize empty arrays for each day
//       DAYS_OF_WEEK.forEach(day => {
//          grouped[day.value] = [];
//       });

//       // Group slots by day
//       availabilitySlots.forEach(slot => {
//          if (grouped[slot.dayOfWeek]) {
//             grouped[slot.dayOfWeek].push(slot);
//          }
//       });

//       return grouped;
//    };

//    if (loading) {
//       return (
//          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//             <Typography>Loading availability settings...</Typography>
//          </Box>
//       );
//    }

//    const groupedSlots = groupSlotsByDay();

//    return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//          <Box>
//             {/* Header */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//                <Box>
//                   <Typography variant="h4" component="h1" gutterBottom>
//                      Availability Settings
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary">
//                      Set your working hours and manage time off
//                   </Typography>
//                </Box>
//                <Chip
//                   icon={<AccessTimeIcon />}
//                   label={`${availabilitySlots.length} slots configured`}
//                   color="primary"
//                   variant="outlined"
//                />
//             </Box>

//             {/* Tabs */}
//             <Paper sx={{ mb: 3 }}>
//                <Tabs value={activeTab} onChange={handleTabChange} centered>
//                   <Tab icon={<ScheduleIcon />} label="Weekly Schedule" />
//                   <Tab icon={<EventBusyIcon />} label="Time Off" />
//                </Tabs>
//             </Paper>

//             {/* Weekly Schedule Tab */}
//             <TabPanel value={activeTab} index={0}>
//                <Grid container spacing={3}>
//                   {/* Left Column: Schedule Setup */}
//                   <Grid size={{ xs: 12, lg: 4}}>
//                      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
//                         <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                            <ScheduleIcon color="primary" />
//                            {isEditingSlot ? 'Edit Availability Slot' : 'Add Availability Slot'}
//                         </Typography>

//                         <Box sx={{ mt: 3 }}>
//                            <TextField
//                               select
//                               fullWidth
//                               label="Day of Week"
//                               value={slotForm.dayOfWeek}
//                               onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: parseInt(e.target.value) })}
//                               sx={{ mb: 3 }}
//                            >
//                               {DAYS_OF_WEEK.map((day) => (
//                                  <MenuItem key={day.value} value={day.value}>
//                                     {day.label}
//                                  </MenuItem>
//                               ))}
//                            </TextField>

//                            <Stack spacing={3} sx={{ mb: 3 }}>
//                               <TimePicker
//                                  label="Start Time"
//                                  value={slotForm.startTime}
//                                  onChange={(newValue) => newValue && setSlotForm({ ...slotForm, startTime: newValue })}
//                                  ampm={false}
//                                  slotProps={{
//                                     textField: {
//                                        fullWidth: true,
//                                        InputProps: {
//                                           startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />,
//                                        },
//                                     },
//                                  }}
//                               />

//                               <TimePicker
//                                  label="End Time"
//                                  value={slotForm.endTime}
//                                  onChange={(newValue) => newValue && setSlotForm({ ...slotForm, endTime: newValue })}
//                                  ampm={false}
//                                  slotProps={{
//                                     textField: {
//                                        fullWidth: true,
//                                        InputProps: {
//                                           startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />,
//                                        },
//                                     },
//                                  }}
//                               />
//                            </Stack>

//                            <TextField
//                               type="number"
//                               label="Slot Duration (minutes)"
//                               value={slotForm.slotDuration}
//                               onChange={(e) => setSlotForm({ ...slotForm, slotDuration: parseInt(e.target.value) })}
//                               fullWidth
//                               sx={{ mb: 3 }}
//                               InputProps={{
//                                  inputProps: { min: 15, step: 15 },
//                                  startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'action.active' }} />,
//                               }}
//                               helperText="Typically 30 or 60 minutes for consultations"
//                            />

//                            <FormControlLabel
//                               control={
//                                  <Switch
//                                     checked={slotForm.isRecurring}
//                                     onChange={(e) => setSlotForm({ ...slotForm, isRecurring: e.target.checked })}
//                                  />
//                               }
//                               label="Recurring Weekly"
//                               sx={{ mb: 3 }}
//                            />

//                            <Box sx={{ display: 'flex', gap: 2 }}>
//                               <Button
//                                  fullWidth
//                                  variant="contained"
//                                  onClick={handleSaveSlot}
//                                  startIcon={isEditingSlot ? <EditIcon /> : <AddIcon />}
//                                  size="large"
//                               >
//                                  {isEditingSlot ? 'Update Slot' : 'Add Slot'}
//                               </Button>

//                               {isEditingSlot && (
//                                  <Button
//                                     variant="outlined"
//                                     onClick={resetSlotForm}
//                                     size="large"
//                                  >
//                                     Cancel
//                                  </Button>
//                               )}
//                            </Box>
//                         </Box>
//                      </Paper>
//                   </Grid>

//                   {/* Right Column: Schedule Preview */}
//                   <Grid size={{ xs: 12, lg: 8}}>
//                      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                            <Typography variant="h6">
//                               Weekly Schedule Preview
//                            </Typography>
//                            <Chip
//                               label={`${availabilitySlots.length} slots`}
//                               size="small"
//                               color="primary"
//                               variant="outlined"
//                            />
//                         </Box>

//                         <Divider sx={{ mb: 3 }} />

//                         <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
//                            <Grid container spacing={2}>
//                               {DAYS_OF_WEEK.map((day) => (
//                                  <Grid size={{ xs: 12 }} key={day.value}>
//                                     <Card variant="outlined">
//                                        <CardContent>
//                                           <Typography
//                                              variant="subtitle1"
//                                              fontWeight="bold"
//                                              sx={{
//                                                 mb: 2,
//                                                 color: groupedSlots[day.value]?.length > 0 ? 'primary.main' : 'text.secondary',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: 1
//                                              }}
//                                           >
//                                              <Box
//                                                 sx={{
//                                                    width: 8,
//                                                    height: 8,
//                                                    borderRadius: '50%',
//                                                    bgcolor: groupedSlots[day.value]?.length > 0 ? 'primary.main' : 'grey.400'
//                                                 }}
//                                              />
//                                              {day.label}
//                                              <Chip
//                                                 label={`${groupedSlots[day.value]?.length || 0} slots`}
//                                                 size="small"
//                                                 variant="outlined"
//                                                 sx={{ ml: 'auto' }}
//                                              />
//                                           </Typography>

//                                           {groupedSlots[day.value]?.length === 0 ? (
//                                              <Typography
//                                                 variant="body2"
//                                                 color="text.secondary"
//                                                 sx={{
//                                                    fontStyle: 'italic',
//                                                    textAlign: 'center',
//                                                    py: 2
//                                                 }}
//                                              >
//                                                 No availability set for this day
//                                              </Typography>
//                                           ) : (
//                                              <Grid container spacing={1}>
//                                                 {groupedSlots[day.value]?.map((slot) => (
//                                                    <Grid size={{ xs: 12, sm: 6, md: 4}} key={slot.id}>
//                                                       <Card
//                                                          variant="outlined"
//                                                          sx={{
//                                                             bgcolor: 'grey.50',
//                                                             borderColor: 'grey.200',
//                                                             position: 'relative',
//                                                             '&:hover': {
//                                                                bgcolor: 'grey.100',
//                                                             }
//                                                          }}
//                                                       >
//                                                          <CardContent sx={{ py: 1.5, px: 2 }}>
//                                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                                <Box>
//                                                                   <Typography variant="body2" fontWeight="medium">
//                                                                      {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
//                                                                   </Typography>
//                                                                   <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
//                                                                      {slot.slotDuration} min slots
//                                                                   </Typography>
//                                                                </Box>
//                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
//                                                                   <IconButton
//                                                                      size="small"
//                                                                      onClick={() => handleEditSlot(slot)}
//                                                                      color="primary"
//                                                                   >
//                                                                      <EditIcon fontSize="small" />
//                                                                   </IconButton>
//                                                                   <IconButton
//                                                                      size="small"
//                                                                      onClick={() => handleDeleteSlot(slot.id)}
//                                                                      color="error"
//                                                                   >
//                                                                      <DeleteIcon fontSize="small" />
//                                                                   </IconButton>
//                                                                </Box>
//                                                             </Box>
//                                                          </CardContent>
//                                                       </Card>
//                                                    </Grid>
//                                                 ))}
//                                              </Grid>
//                                           )}
//                                        </CardContent>
//                                     </Card>
//                                  </Grid>
//                               ))}
//                            </Grid>
//                         </Box>
//                      </Paper>
//                   </Grid>
//                </Grid>
//             </TabPanel>

//             {/* Time Off Tab */}
//             <TabPanel value={activeTab} index={1}>
//                <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, lg: 4}}>
//                      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
//                         <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                            <EventBusyIcon color="primary" />
//                            {isEditingUnavailability ? 'Edit Time Off' : 'Add Time Off'}
//                         </Typography>

//                         <Box sx={{ mt: 3 }}>
//                            <TextField
//                               fullWidth
//                               label="Title/Reason"
//                               value={unavailabilityForm.title}
//                               onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, title: e.target.value })}
//                               sx={{ mb: 3 }}
//                               placeholder="e.g., Vacation, Conference, Sick Leave"
//                            />

//                            <Stack spacing={3} sx={{ mb: 3 }}>
//                               <DatePicker
//                                  label="Start Date"
//                                  value={unavailabilityForm.startDate}
//                                  onChange={(date) => setUnavailabilityForm({ ...unavailabilityForm, startDate: date || new Date() })}
//                                  slotProps={{ textField: { fullWidth: true } }}
//                               />

//                               <DatePicker
//                                  label="End Date"
//                                  value={unavailabilityForm.endDate}
//                                  onChange={(date) => setUnavailabilityForm({ ...unavailabilityForm, endDate: date || new Date() })}
//                                  slotProps={{ textField: { fullWidth: true } }}
//                               />
//                            </Stack>

//                            <TextField
//                               fullWidth
//                               multiline
//                               rows={2}
//                               label="Additional Notes"
//                               value={unavailabilityForm.reason}
//                               onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, reason: e.target.value })}
//                               sx={{ mb: 3 }}
//                            />

//                            <FormControlLabel
//                               control={
//                                  <Switch
//                                     checked={unavailabilityForm.isAllDay}
//                                     onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, isAllDay: e.target.checked })}
//                                  />
//                               }
//                               label="All Day Event"
//                               sx={{ mb: 3 }}
//                            />

//                            <Box sx={{ display: 'flex', gap: 2 }}>
//                               <Button
//                                  fullWidth
//                                  variant="contained"
//                                  onClick={handleSaveUnavailability}
//                                  startIcon={isEditingUnavailability ? <EditIcon /> : <AddIcon />}
//                                  size="large"
//                               >
//                                  {isEditingUnavailability ? 'Update Time Off' : 'Add Time Off'}
//                               </Button>

//                               {isEditingUnavailability && (
//                                  <Button
//                                     variant="outlined"
//                                     onClick={resetUnavailabilityForm}
//                                     size="large"
//                                  >
//                                     Cancel
//                                  </Button>
//                               )}
//                            </Box>
//                         </Box>
//                      </Paper>
//                   </Grid>

//                   <Grid size={{ xs: 12, lg: 8}}>
//                      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                            <Typography variant="h6">
//                               Scheduled Time Off
//                            </Typography>
//                            <Chip
//                               label={`${unavailability.length} entries`}
//                               size="small"
//                               color="primary"
//                               variant="outlined"
//                            />
//                         </Box>

//                         <Divider sx={{ mb: 3 }} />

//                         {unavailability.length === 0 ? (
//                            <Alert severity="info" sx={{ mt: 2 }}>
//                               No time off scheduled. Add your vacations, conferences, or personal days here.
//                            </Alert>
//                         ) : (
//                            <Grid container spacing={2}>
//                               {unavailability.map((item) => (
//                                  <Grid size={{ xs: 12 }} key={item.id}>
//                                     <Card variant="outlined">
//                                        <CardContent>
//                                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                              <Box>
//                                                 <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
//                                                    {item.title}
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                    <strong>When:</strong> {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
//                                                    {item.isAllDay ? ' (All Day)' : ''}
//                                                 </Typography>
//                                                 {item.reason && (
//                                                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
//                                                       <strong>Notes:</strong> {item.reason}
//                                                    </Typography>
//                                                 )}
//                                              </Box>
//                                              <Box sx={{ display: 'flex', gap: 0.5 }}>
//                                                 <IconButton
//                                                    size="small"
//                                                    onClick={() => handleEditUnavailability(item)}
//                                                    color="primary"
//                                                 >
//                                                    <EditIcon fontSize="small" />
//                                                 </IconButton>
//                                                 <IconButton
//                                                    size="small"
//                                                    onClick={() => handleDeleteUnavailability(item.id)}
//                                                    color="error"
//                                                 >
//                                                    <DeleteIcon fontSize="small" />
//                                                 </IconButton>
//                                              </Box>
//                                           </Box>
//                                        </CardContent>
//                                     </Card>
//                                  </Grid>
//                               ))}
//                            </Grid>
//                         )}
//                      </Paper>
//                   </Grid>
//                </Grid>
//             </TabPanel>

//             {/* Info Alert */}
//             <Alert severity="info" sx={{ mt: 4 }}>
//                {/* Fixed: Added component="div" to prevent <ul> inside <p> */}
//                <Typography variant="body2" component="div">
//                   <strong>How it works:</strong>
//                   <ul style={{ marginTop: 4, marginBottom: 4, paddingLeft: 20 }}>
//                      <li>Set recurring weekly availability for each day</li>
//                      <li>Add time off for vacations, conferences, or personal days</li>
//                      <li>Patients will only see available slots when booking</li>
//                      <li>Click edit icons to modify existing entries</li>
//                   </ul>
//                </Typography>
//             </Alert>
//          </Box>
//       </LocalizationProvider>
//    );
// };

// export default AvailabilitySettings;

import {
    AccessTime as AccessTimeIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EventBusy as EventBusyIcon,
    Schedule as ScheduleIcon,
    Work as ServiceIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React, { useEffect, useState } from 'react';
import { availabilityService } from '../services/availabilityService';
import { serviceService } from '../services/serviceConfigurationService';
import { useAppSelector } from '../store/store';
import { AvailabilitySlot, Unavailability, Service } from '../types';

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const AvailabilitySettings: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState(0);
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [unavailability, setUnavailability] = useState<Unavailability[]>([]);
    const [services, setServices] = useState<Service[]>([]); // New: Store services
    const [loading, setLoading] = useState(true);
    const [isEditingSlot, setIsEditingSlot] = useState(false);
    const [isEditingUnavailability, setIsEditingUnavailability] = useState(false);

    // Form states
    const [slotForm, setSlotForm] = useState({
        id: '',
        dayOfWeek: 1,
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(17, 0, 0, 0)),
        isRecurring: true,
        slotDuration: 30,
        serviceIds: [] as string[], // New: Selected services
    });

    const [unavailabilityForm, setUnavailabilityForm] = useState({
        id: '',
        title: '',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        reason: '',
        isAllDay: true,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [slots, unavail, allServices] = await Promise.all([
                availabilityService.getAvailabilitySlots(user?.id || '1'),
                availabilityService.getUnavailability(user?.id || '1'),
                serviceService.getServices({ doctorId: user?.id || '1', isActive: true })
            ]);
            setAvailabilitySlots(slots);
            setUnavailability(unavail);
            setServices(allServices);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Helper function to format Date to time string (HH:mm)
    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Helper to parse time string to Date
    const parseTimeString = (timeString: string): Date => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    // Helper to format time string for display
    const formatTimeDisplay = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const handleSaveSlot = async () => {
        try {
            const slotData = {
                doctorId: user?.id || '1',
                dayOfWeek: slotForm.dayOfWeek,
                startTime: formatTime(slotForm.startTime),
                endTime: formatTime(slotForm.endTime),
                isRecurring: slotForm.isRecurring,
                slotDuration: slotForm.slotDuration,
                maxAppointmentsPerSlot: 1,
                serviceIds: slotForm.serviceIds, // Save selected services
            };

            if (isEditingSlot) {
                await availabilityService.updateAvailabilitySlot(slotForm.id, slotData);
            } else {
                await availabilityService.createAvailabilitySlot(slotData);
            }

            await loadData();
            resetSlotForm();
        } catch (error) {
            console.error('Failed to save slot:', error);
        }
    };

    const handleSaveUnavailability = async () => {
        try {
            const unavailabilityData = {
                doctorId: user?.id || '1',
                title: unavailabilityForm.title,
                startDate: unavailabilityForm.startDate,
                endDate: unavailabilityForm.endDate,
                reason: unavailabilityForm.reason,
                isAllDay: unavailabilityForm.isAllDay,
            };

            if (isEditingUnavailability) {
                await availabilityService.deleteUnavailability(unavailabilityForm.id);
                await availabilityService.createUnavailability(unavailabilityData);
            } else {
                await availabilityService.createUnavailability(unavailabilityData);
            }

            await loadData();
            resetUnavailabilityForm();
        } catch (error) {
            console.error('Failed to save unavailability:', error);
        }
    };

    const handleEditSlot = (slot: AvailabilitySlot) => {
        const startTime = parseTimeString(slot.startTime);
        const endTime = parseTimeString(slot.endTime);

        setSlotForm({
            id: slot.id,
            dayOfWeek: slot.dayOfWeek,
            startTime,
            endTime,
            isRecurring: slot.isRecurring,
            slotDuration: slot.slotDuration || 30,
            serviceIds: slot.serviceIds || [],
        });
        setIsEditingSlot(true);
    };

    const handleEditUnavailability = (item: Unavailability) => {
        setUnavailabilityForm({
            id: item.id,
            title: item.title,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            reason: item.reason,
            isAllDay: item.isAllDay,
        });
        setIsEditingUnavailability(true);
    };

    const handleDeleteSlot = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this availability slot?')) {
            try {
                await availabilityService.deleteAvailabilitySlot(id);
                await loadData();
            } catch (error) {
                console.error('Failed to delete slot:', error);
            }
        }
    };

    const handleDeleteUnavailability = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this time off?')) {
            try {
                await availabilityService.deleteUnavailability(id);
                await loadData();
            } catch (error) {
                console.error('Failed to delete unavailability:', error);
            }
        }
    };

    const resetSlotForm = () => {
        setSlotForm({
            id: '',
            dayOfWeek: 1,
            startTime: new Date(new Date().setHours(9, 0, 0, 0)),
            endTime: new Date(new Date().setHours(17, 0, 0, 0)),
            isRecurring: true,
            slotDuration: 30,
            serviceIds: [],
        });
        setIsEditingSlot(false);
    };

    const resetUnavailabilityForm = () => {
        setUnavailabilityForm({
            id: '',
            title: '',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            reason: '',
            isAllDay: true,
        });
        setIsEditingUnavailability(false);
    };

    const groupSlotsByDay = () => {
        const grouped: Record<number, AvailabilitySlot[]> = {};
        DAYS_OF_WEEK.forEach(day => { grouped[day.value] = []; });
        availabilitySlots.forEach(slot => {
            if (grouped[slot.dayOfWeek]) {
                grouped[slot.dayOfWeek].push(slot);
            }
        });
        return grouped;
    };

    // Render logic to show service names in Chips
    const renderSelectedServices = (selected: string[]) => {
        if (selected.length === 0) return <Typography color="text.secondary">All Services</Typography>;
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                    <Chip 
                        key={value} 
                        label={services.find(s => s.id === value)?.name} 
                        size="small"
                    />
                ))}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography>Loading availability settings...</Typography>
            </Box>
        );
    }

    const groupedSlots = groupSlotsByDay();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Availability Settings
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Set your working hours and manage time off
                        </Typography>
                    </Box>
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`${availabilitySlots.length} slots configured`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} centered>
                        <Tab icon={<ScheduleIcon />} label="Weekly Schedule" />
                        <Tab icon={<EventBusyIcon />} label="Time Off" />
                    </Tabs>
                </Paper>

                {/* Weekly Schedule Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        {/* Left Column: Schedule Setup */}
                        <Grid size={{ xs: 12, lg: 4 }} >
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScheduleIcon color="primary" />
                                    {isEditingSlot ? 'Edit Availability Slot' : 'Add Availability Slot'}
                                </Typography>

                                <Box sx={{ mt: 3 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Day of Week"
                                        value={slotForm.dayOfWeek}
                                        onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: parseInt(e.target.value) })}
                                        sx={{ mb: 3 }}
                                    >
                                        {DAYS_OF_WEEK.map((day) => (
                                            <MenuItem key={day.value} value={day.value}>
                                                {day.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    {/* NEW: Service Selection */}
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel>Applicable Services</InputLabel>
                                        <Select
                                            multiple
                                            value={slotForm.serviceIds}
                                            onChange={(e) => setSlotForm({ ...slotForm, serviceIds: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                                            label="Applicable Services"
                                            renderValue={renderSelectedServices}
                                        >
                                            {services.map((service) => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            Leave empty to apply to ALL services
                                        </Typography>
                                    </FormControl>

                                    <Stack spacing={3} sx={{ mb: 3 }}>
                                        <TimePicker
                                            label="Start Time"
                                            value={slotForm.startTime}
                                            onChange={(newValue) => newValue && setSlotForm({ ...slotForm, startTime: newValue })}
                                            ampm={false}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />

                                        <TimePicker
                                            label="End Time"
                                            value={slotForm.endTime}
                                            onChange={(newValue) => newValue && setSlotForm({ ...slotForm, endTime: newValue })}
                                            ampm={false}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </Stack>

                                    <TextField
                                        type="number"
                                        label="Slot Duration (minutes)"
                                        value={slotForm.slotDuration}
                                        onChange={(e) => setSlotForm({ ...slotForm, slotDuration: parseInt(e.target.value) })}
                                        fullWidth
                                        sx={{ mb: 3 }}
                                        InputProps={{ inputProps: { min: 15, step: 15 } }}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={slotForm.isRecurring}
                                                onChange={(e) => setSlotForm({ ...slotForm, isRecurring: e.target.checked })}
                                            />
                                        }
                                        label="Recurring Weekly"
                                        sx={{ mb: 3 }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleSaveSlot}
                                            startIcon={isEditingSlot ? <EditIcon /> : <AddIcon />}
                                            size="large"
                                        >
                                            {isEditingSlot ? 'Update Slot' : 'Add Slot'}
                                        </Button>

                                        {isEditingSlot && (
                                            <Button
                                                variant="outlined"
                                                onClick={resetSlotForm}
                                                size="large"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Right Column: Schedule Preview */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">Weekly Schedule Preview</Typography>
                                    <Chip label={`${availabilitySlots.length} slots`} size="small" color="primary" variant="outlined" />
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                                    <Grid container spacing={2}>
                                        {DAYS_OF_WEEK.map((day) => (
                                            <Grid size={{ xs: 12 }} key={day.value}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="bold"
                                                            sx={{
                                                                mb: 2,
                                                                color: groupedSlots[day.value]?.length > 0 ? 'primary.main' : 'text.secondary',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1
                                                            }}
                                                        >
                                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: groupedSlots[day.value]?.length > 0 ? 'primary.main' : 'grey.400' }} />
                                                            {day.label}
                                                        </Typography>

                                                        {groupedSlots[day.value]?.length === 0 ? (
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                                                                No availability set for this day
                                                            </Typography>
                                                        ) : (
                                                            <Grid container spacing={1}>
                                                                {groupedSlots[day.value]?.map((slot) => (
                                                                    <Grid size={{ xs: 12, sm: 6, md: 4}} key={slot.id}>
                                                                        <Card variant="outlined" sx={{ bgcolor: 'grey.50', borderColor: 'grey.200', position: 'relative' }}>
                                                                            <CardContent sx={{ py: 1.5, px: 2 }}>
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                    <Box>
                                                                                        <Typography variant="body2" fontWeight="medium">
                                                                                            {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                                                                                        </Typography>
                                                                                        
                                                                                        {/* Show selected services in card */}
                                                                                        <Box sx={{ mt: 0.5 }}>
                                                                                            {(!slot.serviceIds || slot.serviceIds.length === 0) ? (
                                                                                                <Chip label="All Services" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                                                            ) : (
                                                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                                                    {slot.serviceIds.slice(0, 2).map(id => (
                                                                                                        <Chip 
                                                                                                            key={id}
                                                                                                            label={services.find(s => s.id === id)?.name} 
                                                                                                            size="small" 
                                                                                                            sx={{ height: 20, fontSize: '0.65rem' }} 
                                                                                                        />
                                                                                                    ))}
                                                                                                    {slot.serviceIds.length > 2 && (
                                                                                                        <Chip label={`+${slot.serviceIds.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                                                                    )}
                                                                                                </Box>
                                                                                            )}
                                                                                        </Box>
                                                                                    </Box>
                                                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                                        <IconButton size="small" onClick={() => handleEditSlot(slot)} color="primary">
                                                                                            <EditIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                        <IconButton size="small" onClick={() => handleDeleteSlot(slot.id)} color="error">
                                                                                            <DeleteIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Box>
                                                                                </Box>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    {/* Time Off Content (Unchanged) */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 4 }} >
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventBusyIcon color="primary" />
                                    {isEditingUnavailability ? 'Edit Time Off' : 'Add Time Off'}
                                </Typography>

                                <Box sx={{ mt: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Title/Reason"
                                        value={unavailabilityForm.title}
                                        onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, title: e.target.value })}
                                        sx={{ mb: 3 }}
                                        placeholder="e.g., Vacation, Conference, Sick Leave"
                                    />

                                    <Stack spacing={3} sx={{ mb: 3 }}>
                                        <DatePicker
                                            label="Start Date"
                                            value={unavailabilityForm.startDate}
                                            onChange={(date) => setUnavailabilityForm({ ...unavailabilityForm, startDate: date || new Date() })}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />

                                        <DatePicker
                                            label="End Date"
                                            value={unavailabilityForm.endDate}
                                            onChange={(date) => setUnavailabilityForm({ ...unavailabilityForm, endDate: date || new Date() })}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </Stack>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label="Additional Notes"
                                        value={unavailabilityForm.reason}
                                        onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, reason: e.target.value })}
                                        sx={{ mb: 3 }}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={unavailabilityForm.isAllDay}
                                                onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, isAllDay: e.target.checked })}
                                            />
                                        }
                                        label="All Day Event"
                                        sx={{ mb: 3 }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleSaveUnavailability}
                                            startIcon={isEditingUnavailability ? <EditIcon /> : <AddIcon />}
                                            size="large"
                                        >
                                            {isEditingUnavailability ? 'Update Time Off' : 'Add Time Off'}
                                        </Button>

                                        {isEditingUnavailability && (
                                            <Button
                                                variant="outlined"
                                                onClick={resetUnavailabilityForm}
                                                size="large"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">Scheduled Time Off</Typography>
                                    <Chip label={`${unavailability.length} entries`} size="small" color="primary" variant="outlined" />
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {unavailability.length === 0 ? (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        No time off scheduled. Add your vacations, conferences, or personal days here.
                                    </Alert>
                                ) : (
                                    <Grid container spacing={2}>
                                        {unavailability.map((item) => (
                                            <Grid size={{ xs: 12 }} key={item.id}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                    <strong>When:</strong> {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                                    {item.isAllDay ? ' (All Day)' : ''}
                                                                </Typography>
                                                                {item.reason && (
                                                                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                                                        <strong>Notes:</strong> {item.reason}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <IconButton size="small" onClick={() => handleEditUnavailability(item)} color="primary">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton size="small" onClick={() => handleDeleteUnavailability(item.id)} color="error">
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>

                <Alert severity="info" sx={{ mt: 4 }}>
                    <Typography variant="body2" component="div">
                        <strong>How it works:</strong>
                        <ul style={{ marginTop: 4, marginBottom: 4, paddingLeft: 20 }}>
                            <li>Set recurring weekly availability for each day</li>
                            <li><strong>Services:</strong> Restrict slots to specific services (e.g., "Clinic Only" on Mondays). Leave empty for all services.</li>
                            <li>Add time off for vacations, conferences, or personal days</li>
                        </ul>
                    </Typography>
                </Alert>
            </Box>
        </LocalizationProvider>
    );
};

export default AvailabilitySettings;