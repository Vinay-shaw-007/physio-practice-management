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

//    // Helper function to format Date to time string
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
//                   <Grid size={{ xs: 12, lg: 4 }}>
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
//                               slotProps={{
//                                  input: {
//                                     inputProps: { min: 15, step: 15 },
//                                     startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'action.active' }} />,

//                                  }
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
//                   <Grid size={{ xs: 12, lg: 8 }}>
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
//                                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slot.id}>
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
//                   <Grid size={{ xs: 12, lg: 4 }}>
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

//                   <Grid size={{ xs: 12, lg: 8 }}>
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
//                <Typography variant="body2">
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
   Add as AddIcon,
   Delete as DeleteIcon
} from '@mui/icons-material';
import {
   Alert,
   Box,
   Button,
   Card,
   CardContent,
   Container,
   Divider,
   Grid,
   IconButton,
   MenuItem,
   Paper,
   Select,
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
import { availabilityService } from '../services/availabilityService';
import { useAppSelector } from '../store/store';
import { AvailabilitySlot, Unavailability } from '../types';

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
   return (
      <div role="tabpanel" hidden={value !== index} {...other}>
         {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
   );
}

const DAYS = [
   { value: 1, label: 'Monday' },
   { value: 2, label: 'Tuesday' },
   { value: 3, label: 'Wednesday' },
   { value: 4, label: 'Thursday' },
   { value: 5, label: 'Friday' },
   { value: 6, label: 'Saturday' },
   { value: 0, label: 'Sunday' },
];

const AvailabilitySettings: React.FC = () => {
   const theme = useTheme();
   const { user } = useAppSelector((state) => state.auth);
   const [tabValue, setTabValue] = useState(0);
   const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
   const [timeOffs, setTimeOffs] = useState<Unavailability[]>([]);

   // Form States
   const [selectedDay, setSelectedDay] = useState(1);
   const [startTime, setStartTime] = useState('09:00');
   const [endTime, setEndTime] = useState('17:00');

   // Time Off Form
   const [offStartDate, setOffStartDate] = useState<Date | null>(new Date());
   const [offEndDate, setOffEndDate] = useState<Date | null>(new Date());
   const [offReason, setOffReason] = useState('');

   useEffect(() => {
      loadData();
   }, [user]);

   const loadData = async () => {
      if (!user?.id) return;
      const [loadedSlots, loadedUnavail] = await Promise.all([
         availabilityService.getAvailabilitySlots(user.id),
         availabilityService.getUnavailability(user.id)
      ]);
      setSlots(loadedSlots);
      setTimeOffs(loadedUnavail);
   };

   const handleAddSlot = async () => {
      if (!user?.id) return;
      try {
         await availabilityService.createAvailabilitySlot({
            doctorId: user.id,
            dayOfWeek: selectedDay,
            startTime,
            endTime,
            isRecurring: true,
            slotDuration: 30,
            maxAppointmentsPerSlot: 1
         });
         loadData();
      } catch (error) {
         console.error(error);
      }
   };

   const handleDeleteSlot = async (id: string) => {
      try {
         await availabilityService.deleteAvailabilitySlot(id);
         loadData();
      } catch (error) {
         console.error(error);
      }
   };

   const handleAddTimeOff = async () => {
      if (!user?.id || !offStartDate || !offEndDate) return;
      try {
         await availabilityService.createUnavailability({
            doctorId: user.id,
            title: 'Time Off',
            startDate: offStartDate,
            endDate: offEndDate,
            reason: offReason,
            isAllDay: true,
         });
         loadData();
         setOffReason('');
      } catch (error) {
         console.error(error);
      }
   };

   const handleDeleteTimeOff = async (id: string) => {
      await availabilityService.deleteUnavailability(id);
      loadData();
   };

   return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Typography variant="h4" fontWeight="bold" gutterBottom>
            Availability Settings
         </Typography>
         <Paper sx={{ width: '100%', mb: 4 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tab label="Weekly Schedule" />
               <Tab label="Time Off / Vacation" />
            </Tabs>

            {/* Weekly Schedule Tab */}
            <TabPanel value={tabValue} index={0}>
               <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 4 }}>
                     <Card variant="outlined">
                        <CardContent>
                           <Typography variant="h6" gutterBottom>Add New Slot</Typography>
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                              <Select
                                 value={selectedDay}
                                 onChange={(e) => setSelectedDay(Number(e.target.value))}
                                 fullWidth
                              >
                                 {DAYS.map(day => (
                                    <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>
                                 ))}
                              </Select>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                 <TextField
                                    label="Start Time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    fullWidth
                                 />
                                 <TextField
                                    label="End Time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    fullWidth
                                 />
                              </Box>
                              <Button
                                 variant="contained"
                                 startIcon={<AddIcon />}
                                 onClick={handleAddSlot}
                              >
                                 Add Slot
                              </Button>
                           </Box>
                        </CardContent>
                     </Card>

                     {/* FIX: Use component="div" to prevent HTML nesting error */}
                     <Alert severity="info" sx={{ mt: 4 }}>
                        <Typography variant="body2" component="div">
                           <strong>Rules:</strong>
                           <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                              <li>Slots are recurring weekly.</li>
                              <li>Overlapping slots are merged automatically.</li>
                              <li>Patient booking duration depends on service type.</li>
                           </ul>
                        </Typography>
                     </Alert>
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                     <Typography variant="h6" gutterBottom>Current Schedule</Typography>
                     {DAYS.map((day) => {
                        const daySlots = slots.filter(s => s.dayOfWeek === day.value).sort((a, b) => a.startTime.localeCompare(b.startTime));
                        if (daySlots.length === 0) return null;

                        return (
                           <Box key={day.value} sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                 {day.label}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                 {daySlots.map(slot => (
                                    <Paper
                                       key={slot.id}
                                       variant="outlined"
                                       sx={{
                                          p: 1,
                                          px: 2,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2,
                                          bgcolor: 'primary.50',
                                          borderColor: 'primary.main'
                                       }}
                                    >
                                       <Typography fontWeight="medium">
                                          {slot.startTime} - {slot.endTime}
                                       </Typography>
                                       <IconButton size="small" onClick={() => handleDeleteSlot(slot.id)} color="error">
                                          <DeleteIcon fontSize="small" />
                                       </IconButton>
                                    </Paper>
                                 ))}
                              </Box>
                              <Divider sx={{ mt: 2 }} />
                           </Box>
                        );
                     })}
                  </Grid>
               </Grid>
            </TabPanel>

            {/* Time Off Tab */}
            <TabPanel value={tabValue} index={1}>
               <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={4}>
                     <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined">
                           <CardContent>
                              <Typography variant="h6" gutterBottom>Add Time Off</Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                                 <DatePicker
                                    label="Start Date"
                                    value={offStartDate}
                                    onChange={setOffStartDate}
                                 />
                                 <DatePicker
                                    label="End Date"
                                    value={offEndDate}
                                    onChange={setOffEndDate}
                                 />
                                 <TextField
                                    label="Reason"
                                    value={offReason}
                                    onChange={(e) => setOffReason(e.target.value)}
                                 />
                                 <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={handleAddTimeOff}
                                 >
                                    Block Dates
                                 </Button>
                              </Box>
                           </CardContent>
                        </Card>
                     </Grid>
                     <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6" gutterBottom>Upcoming Time Off</Typography>
                        {timeOffs.map(off => (
                           <Card key={off.id} sx={{ mb: 2 }}>
                              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                       {off.reason}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                       {new Date(off.startDate).toLocaleDateString()} — {new Date(off.endDate).toLocaleDateString()}
                                    </Typography>
                                 </Box>
                                 <IconButton onClick={() => handleDeleteTimeOff(off.id)}>
                                    <DeleteIcon />
                                 </IconButton>
                              </CardContent>
                           </Card>
                        ))}
                     </Grid>
                  </Grid>
               </LocalizationProvider>
            </TabPanel>
         </Paper>
      </Container>
   );
};

export default AvailabilitySettings;