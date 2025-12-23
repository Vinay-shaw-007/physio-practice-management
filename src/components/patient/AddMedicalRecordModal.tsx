// import {
//     Description as FileIcon,
//     CloudUpload as UploadIcon
// } from '@mui/icons-material';
// import {
//     Alert,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     Grid,
//     InputLabel,
//     MenuItem,
//     Select,
//     TextField,
//     Typography
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { useFormik } from 'formik';
// import React, { useState } from 'react';
// import * as yup from 'yup';
// import { MedicalRecord } from '../../types';

// interface AddMedicalRecordModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSubmit: (data: Omit<MedicalRecord, 'id' | 'patientId'>) => Promise<void>;
// }

// const validationSchema = yup.object({
//     title: yup.string().required('Title is required'),
//     type: yup.string().required('Type is required'),
//     doctorName: yup.string().required('Doctor name is required'),
//     description: yup.string().required('Description is required'),
//     date: yup.date().required('Date is required'),
// });

// const AddMedicalRecordModal: React.FC<AddMedicalRecordModalProps> = ({
//     open,
//     onClose,
//     onSubmit
// }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [loading, setLoading] = useState(false);

//     const formik = useFormik({
//         initialValues: {
//             title: '',
//             type: 'LAB_TEST' as MedicalRecord['type'],
//             doctorName: '',
//             description: '',
//             date: new Date(),
//             tags: '',
//         },
//         validationSchema: validationSchema,
//         onSubmit: async (values) => {
//             setLoading(true);
//             try {
//                 await onSubmit({
//                     title: values.title,
//                     type: values.type,
//                     doctorName: values.doctorName,
//                     description: values.description,
//                     date: values.date,
//                     tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
//                     attachments: selectedFile ? [selectedFile.name] : []
//                 });
//                 handleClose();
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     const handleClose = () => {
//         formik.resetForm();
//         setSelectedFile(null);
//         onClose();
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files[0]) {
//             setSelectedFile(event.target.files[0]);
//         }
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//             <DialogTitle>Add Medical Record</DialogTitle>
//             <form onSubmit={formik.handleSubmit}>
//                 <DialogContent>
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <Grid container spacing={3}>
//                             <Grid size={{xs:12}}>
//                                 <TextField
//                                     fullWidth
//                                     label="Record Title"
//                                     name="title"
//                                     value={formik.values.title}
//                                     onChange={formik.handleChange}
//                                     error={formik.touched.title && Boolean(formik.errors.title)}
//                                     helperText={formik.touched.title && formik.errors.title}
//                                 />
//                             </Grid>

//                             <Grid size={{xs:12, sm: 6}}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>Record Type</InputLabel>
//                                     <Select
//                                         name="type"
//                                         value={formik.values.type}
//                                         label="Record Type"
//                                         onChange={formik.handleChange}
//                                     >
//                                         <MenuItem value="CONSULTATION">Consultation</MenuItem>
//                                         <MenuItem value="LAB_TEST">Lab Test</MenuItem>
//                                         <MenuItem value="PRESCRIPTION">Prescription</MenuItem>
//                                         <MenuItem value="VACCINATION">Vaccination</MenuItem>
//                                         <MenuItem value="SURGERY">Surgery</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             </Grid>

//                             <Grid size={{xs:12, sm: 6}}>
//                                 <DatePicker
//                                     label="Date"
//                                     value={formik.values.date}
//                                     onChange={(value) => formik.setFieldValue('date', value)}
//                                     slotProps={{ textField: { fullWidth: true } }}
//                                 />
//                             </Grid>

//                             <Grid size={{xs:12}}>
//                                 <TextField
//                                     fullWidth
//                                     label="Doctor / Lab Name"
//                                     name="doctorName"
//                                     value={formik.values.doctorName}
//                                     onChange={formik.handleChange}
//                                     error={formik.touched.doctorName && Boolean(formik.errors.doctorName)}
//                                     helperText={formik.touched.doctorName && formik.errors.doctorName}
//                                 />
//                             </Grid>

//                             <Grid size={{xs:12}}>
//                                 <TextField
//                                     fullWidth
//                                     multiline
//                                     rows={3}
//                                     label="Description / Notes"
//                                     name="description"
//                                     value={formik.values.description}
//                                     onChange={formik.handleChange}
//                                     error={formik.touched.description && Boolean(formik.errors.description)}
//                                     helperText={formik.touched.description && formik.errors.description}
//                                 />
//                             </Grid>

//                             <Grid size={{xs:12}}>
//                                 <TextField
//                                     fullWidth
//                                     label="Tags (comma separated)"
//                                     name="tags"
//                                     placeholder="e.g. Blood Work, Routine, Annual"
//                                     value={formik.values.tags}
//                                     onChange={formik.handleChange}
//                                 />
//                             </Grid>

//                             <Grid size={{xs:12}}>
//                                 <Typography variant="subtitle2" gutterBottom>
//                                     Attachment (Optional)
//                                 </Typography>
//                                 <Button
//                                     component="label"
//                                     variant="outlined"
//                                     startIcon={<UploadIcon />}
//                                     fullWidth
//                                     sx={{ height: 56, borderStyle: 'dashed' }}
//                                 >
//                                     {selectedFile ? selectedFile.name : 'Upload File (PDF, JPG, PNG)'}
//                                     <input
//                                         type="file"
//                                         hidden
//                                         onChange={handleFileChange}
//                                         accept=".pdf,.jpg,.jpeg,.png"
//                                     />
//                                 </Button>
//                                 {selectedFile && (
//                                     <Alert severity="success" icon={<FileIcon />} sx={{ mt: 1 }}>
//                                         Ready to upload: {selectedFile.name}
//                                     </Alert>
//                                 )}
//                             </Grid>
//                         </Grid>
//                     </LocalizationProvider>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3 }}>
//                     <Button onClick={handleClose} disabled={loading}>Cancel</Button>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         disabled={loading}
//                     >
//                         {loading ? 'Saving...' : 'Add Record'}
//                     </Button>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// };

// export default AddMedicalRecordModal;

import {
    CloudUpload as UploadIcon
} from '@mui/icons-material';
import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { appointmentService } from '../../services/appointmentService'; // To fetch history
import { useAppSelector } from '../../store/store';
import { MedicalRecord } from '../../types';

interface AddMedicalRecordModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<MedicalRecord, 'id' | 'patientId'>) => Promise<void>;
}

const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    type: yup.string().required('Type is required'),
    doctorName: yup.string().required('Doctor name is required'),
    description: yup.string().required('Description is required'),
    date: yup.date().required('Date is required'),
});

const AddMedicalRecordModal: React.FC<AddMedicalRecordModalProps> = ({
    open,
    onClose,
    onSubmit
}) => {
    const { user } = useAppSelector((state) => state.auth);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // State for Smart Doctor Logic
    const [recentDoctors, setRecentDoctors] = useState<string[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);

    // Fetch Consulted Doctors on Load
    useEffect(() => {
        if (open && user?.id) {
            fetchConsultedDoctors();
        }
    }, [open, user]);

    const fetchConsultedDoctors = async () => {
        if (!user?.id) return;
        setLoadingDoctors(true);
        try {
            // 1. Get all appointments for this patient
            const appointments = await appointmentService.getAppointments({
                patientId: user.id,
                status: 'ALL' // Get past history too
            });

            // 2. Extract Doctor Names (Assuming metadata has doctorName, or join with Doctor entity)
            // Note: In a real DB join, you would get the Doctor Object. 
            // For now, we extract names from metadata or IDs.
            const doctorNames = appointments
                .map(appt => appt.metadata?.doctorName || `Dr. ${appt.doctorId}`)
                .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

            setRecentDoctors(doctorNames);

            // 3. AUTO-FILL LOGIC: If form is empty, set the most recent doctor
            if (doctorNames.length > 0 && !formik.values.doctorName) {
                // The API usually returns sorted by date, so first one is most recent
                formik.setFieldValue('doctorName', doctorNames[0]);
            }
        } catch (error) {
            console.error("Error fetching doctors", error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            type: 'LAB_TEST' as MedicalRecord['type'],
            doctorName: '', // Will be auto-filled
            description: '',
            date: new Date(),
            tags: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await onSubmit({
                    title: values.title,
                    type: values.type,
                    doctorName: values.doctorName,
                    description: values.description,
                    date: values.date,
                    tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
                    attachments: selectedFile ? [selectedFile.name] : [] // In real app, upload file here
                });
                handleClose();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setSelectedFile(null);
        onClose();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Medical Record</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Record Title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Record Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={formik.values.type}
                                        label="Record Type"
                                        onChange={formik.handleChange}
                                    >
                                        <MenuItem value="CONSULTATION">Consultation</MenuItem>
                                        <MenuItem value="LAB_TEST">Lab Test</MenuItem>
                                        <MenuItem value="PRESCRIPTION">Prescription</MenuItem>
                                        <MenuItem value="VACCINATION">Vaccination</MenuItem>
                                        <MenuItem value="SURGERY">Surgery</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <DatePicker
                                    label="Date"
                                    value={formik.values.date}
                                    onChange={(value) => formik.setFieldValue('date', value)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>

                            {/* SMART DOCTOR SELECTOR */}
                            <Grid size={{ xs: 12 }}>
                                <Autocomplete
                                    freeSolo // Allows typing a name if it's not in the list (e.g. external lab)
                                    options={recentDoctors}
                                    loading={loadingDoctors}
                                    value={formik.values.doctorName}
                                    onInputChange={(_, newValue) => {
                                        formik.setFieldValue('doctorName', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Consulting Doctor / Lab"
                                            name="doctorName"
                                            error={formik.touched.doctorName && Boolean(formik.errors.doctorName)}
                                            helperText={
                                                (formik.touched.doctorName && formik.errors.doctorName) ||
                                                "Select from past doctors or type a new one"
                                            }
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description / Notes"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>

                            {/* ... File Upload (same as before) ... */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Attachment (Optional)
                                </Typography>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<UploadIcon />}
                                    fullWidth
                                    sx={{ height: 56, borderStyle: 'dashed' }}
                                >
                                    {selectedFile ? selectedFile.name : 'Upload File (PDF, JPG, PNG)'}
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Add Record'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddMedicalRecordModal;