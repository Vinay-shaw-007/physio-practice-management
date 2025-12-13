import { Invoice } from '@/types/booking';
import { mockStorage } from '@/utils/mockStorage';
import { Appointment, AppointmentStatus, Gender, MedicalRecord, Patient, ServiceType, UserRole } from '../types';
import { appointmentService } from './appointmentService';

// Mock patient data
const mockPatient: Patient = {
    id: '1',
    email: 'patient@example.com',
    name: 'John Smith',
    role: UserRole.PATIENT,
    phone: '+91 98765 43210',
    avatar: '',
    dateOfBirth: new Date('1985-06-15'),
    gender: Gender.MALE,
    address: '123 Main Street, Bangalore, Karnataka 560001',
    medicalHistory: 'Hypertension (controlled), No known drug allergies',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
    bloodGroup: 'O+',
    height: 175, // cm
    weight: 72, // kg
    emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        phone: '+91 98765 43211',
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-11-20'),
};

const mockMedicalRecords: MedicalRecord[] = [
    {
        id: 'rec1',
        patientId: '1',
        date: new Date('2024-11-15'),
        type: 'CONSULTATION',
        title: 'Knee Pain Follow-up',
        description: 'Follow-up consultation for chronic knee pain. Recommended physiotherapy exercises.',
        doctorName: 'Dr. Sarah Johnson',
        tags: ['Orthopedic', 'Follow-up'],
    },
    {
        id: 'rec2',
        patientId: '1',
        date: new Date('2024-10-20'),
        type: 'LAB_TEST',
        title: 'Blood Test Results',
        description: 'Complete blood count, lipid profile, and glucose levels.',
        doctorName: 'Dr. Michael Chen',
        attachments: ['blood_test_results.pdf'],
        tags: ['Laboratory', 'Routine'],
    },
    {
        id: 'rec3',
        patientId: '1',
        date: new Date('2024-10-10'),
        type: 'PRESCRIPTION',
        title: 'Pain Management',
        description: 'Prescription for pain relief and anti-inflammatory medication.',
        doctorName: 'Dr. Sarah Johnson',
        tags: ['Medication', 'Pain'],
    },
];

class PatientService {

    // --- Profile Management ---

    // Get patient profile
    async getPatientProfile(patientId: string): Promise<Patient> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // if (patientId !== '1') throw new Error('Patient not found');
        // return mockPatient;
        return mockStorage.getPatientProfile(mockPatient);
    }

    // Update patient profile
    async updatePatientProfile(patientId: string, updates: Partial<Patient>): Promise<Patient> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // In a real app, this would update the backend
        // console.log('Updating patient profile:', updates);
        // return { ...mockPatient, ...updates, updatedAt: new Date() };
        let current = mockStorage.getPatientProfile(mockPatient);
        const updated = {
            ...current,
            ...updates,
            updatedAt: new Date()
        };

        mockStorage.savePatientProfile(updated);
        return updated;
    }

    async uploadAvatar(patientId: string, file: File): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create local URL for preview
        const mockUrl = URL.createObjectURL(file);

        let current = mockStorage.getPatientProfile(mockPatient);
        current.avatar = mockUrl;
        current.updatedAt = new Date();
        mockStorage.savePatientProfile(current);

        return mockUrl;
    }

    // --- Doctor View: Patient Management ---
    async getAllPatients(): Promise<Patient[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return the main mock patient plus some dummies for the list
        const main = mockStorage.getPatientProfile(mockPatient);
        return [
            main,
            { ...main, id: '2', name: 'Sarah Connor', email: 'sarah@example.com', phone: '+91 98765 00000' },
            { ...main, id: '3', name: 'Kyle Reese', email: 'kyle@example.com', phone: '+91 98765 11111' },
            { ...main, id: '4', name: 'Ellen Ripley', email: 'ellen@example.com', phone: '+91 98765 22222' },
        ];
    }

    // --- Medical Records ---

    // Get patient medical records
    async getMedicalRecords(patientId: string, limit?: number): Promise<MedicalRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // const records = mockMedicalRecords.filter(record => record.patientId === patientId);
        // if (limit) return records.slice(0, limit);
        // return records;
        const records = mockStorage.getMedicalRecords(mockMedicalRecords);

        // Sort descending
        const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return limit ? sorted.slice(0, limit) : sorted;
    }

    async uploadMedicalRecord(patientId: string, file: File, type: MedicalRecord['type']): Promise<MedicalRecord> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newRecord: MedicalRecord = {
            id: mockMedicalRecords.length + 1 + '',
            patientId,
            date: new Date(),
            type,
            title: `Uploaded: ${file.name}`,
            description: 'Patient uploaded document',
            doctorName: 'Self Uploaded',
            attachments: [file.name],
            tags: ['Uploaded'],
        };

        const records = mockStorage.getMedicalRecords(mockMedicalRecords);
        records.unshift(newRecord);
        mockStorage.saveMedicalRecords(records);

        return newRecord;
    }

    // --- Dashboard Stats (Aggregating real data) ---

    // Get patient stats
    async getPatientStats(patientId: string) {
        await new Promise(resolve => setTimeout(resolve, 200));

        // Mock stats calculation
        // return {
        //     totalAppointments: 12,
        //     upcomingAppointments: 3,
        //     completedAppointments: 8,
        //     cancelledAppointments: 1,
        //     totalSpent: 12500,
        //     averageRating: 4.7,
        //     daysSinceLastVisit: 7,
        //     nextAppointment: new Date('2024-12-12T10:00:00'),
        //     favoriteDoctor: 'Dr. Sarah Johnson',
        // };
        // Calculate stats from real appointments in storage
        const appointments = await appointmentService.getAppointments({ patientId });

        const upcoming = appointments.filter(a =>
            [AppointmentStatus.NEW, AppointmentStatus.CONFIRMED, AppointmentStatus.RESCHEDULED].includes(a.status)
        ).length;

        const completed = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;

        // Find next appointment
        const nextAppt = appointments
            .filter(a => new Date(a.date) > new Date() && a.status !== AppointmentStatus.CANCELLED)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return {
            totalAppointments: appointments.length,
            upcomingAppointments: upcoming,
            completedAppointments: completed,
            cancelledAppointments: appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length,
            totalSpent: 12500, // Hardcoded for now
            averageRating: 4.7,
            daysSinceLastVisit: 7,
            nextAppointment: nextAppt ? new Date(nextAppt.date) : null,
            favoriteDoctor: 'Dr. Sarah Johnson',
        };
    }

    // Mock Health Metrics (Hardcoded for demo)
    // Get health metrics
    async getHealthMetrics(patientId: string) {
        await new Promise(resolve => setTimeout(resolve, 200));

        return {
            bloodPressure: { systolic: 120, diastolic: 80, status: 'Normal' },
            heartRate: { value: 72, status: 'Normal' },
            bmi: { value: 23.5, status: 'Healthy' },
            cholesterol: { value: 180, status: 'Borderline' },
            glucose: { value: 95, status: 'Normal' },
            lastUpdated: new Date('2024-11-25'),
        };
    }

    // --- Appointments Helper ---

    // Get upcoming appointments for patient
    async getUpcomingAppointments(patientId: string, limit?: number): Promise<Appointment[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock upcoming appointments
        // const upcomingAppointments: Appointment[] = [
        //     {
        //         id: 'up1',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '1',
        //         date: new Date('2024-12-12'),
        //         startTime: '10:00',
        //         endTime: '10:30',
        //         status: AppointmentStatus.CONFIRMED,
        //         notes: 'Follow-up for knee rehabilitation',
        //         symptoms: ['Knee stiffness', 'Mild pain'],
        //         paymentStatus: PaymentStatus.PAID,
        //         amount: 600,
        //         createdAt: new Date('2024-11-28'),
        //         updatedAt: new Date('2024-11-28'),
        //         metadata: {
        //             serviceName: 'Clinic Consultation',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.CLINIC_VISIT,
        //         },
        //     },
        //     {
        //         id: 'up2',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '3',
        //         date: new Date('2024-12-15'),
        //         startTime: '14:00',
        //         endTime: '14:30',
        //         status: AppointmentStatus.CONFIRMED,
        //         notes: 'Progress check via video',
        //         symptoms: ['Shoulder mobility'],
        //         paymentStatus: PaymentStatus.PENDING,
        //         amount: 800,
        //         createdAt: new Date('2024-11-30'),
        //         updatedAt: new Date('2024-11-30'),
        //         metadata: {
        //             serviceName: 'Video Consultation',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.VIDEO_CONSULT,
        //         },
        //     },
        //     {
        //         id: 'up3',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '2',
        //         date: new Date('2024-12-20'),
        //         startTime: '11:00',
        //         endTime: '12:00',
        //         status: AppointmentStatus.AWAITING,
        //         notes: 'Home visit for elderly patient',
        //         symptoms: ['Back pain', 'Limited mobility'],
        //         paymentStatus: PaymentStatus.PENDING,
        //         amount: 1200,
        //         createdAt: new Date('2024-12-01'),
        //         updatedAt: new Date('2024-12-01'),
        //         metadata: {
        //             serviceName: 'Home Visit',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.HOME_VISIT,
        //         },
        //     },
        // ];

        // if (limit) return upcomingAppointments.slice(0, limit);
        // return upcomingAppointments;
        const appointments = await appointmentService.getAppointments({ patientId });
        const upcoming = appointments
            .filter(a =>
                new Date(a.date) >= new Date() &&
                a.status !== AppointmentStatus.CANCELLED &&
                a.status !== AppointmentStatus.COMPLETED
            )
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return limit ? upcoming.slice(0, limit) : upcoming;
    }

    // Get past appointments for patient
    async getPastAppointments(patientId: string, limit?: number): Promise<Appointment[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock past appointments
        // const pastAppointments: Appointment[] = [
        //     {
        //         id: 'past1',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '1',
        //         date: new Date('2024-11-28'),
        //         startTime: '14:00',
        //         endTime: '14:30',
        //         status: AppointmentStatus.COMPLETED,
        //         notes: 'Initial consultation for knee pain',
        //         symptoms: ['Knee pain', 'Swelling'],
        //         paymentStatus: PaymentStatus.PAID,
        //         amount: 600,
        //         createdAt: new Date('2024-11-20'),
        //         updatedAt: new Date('2024-11-28'),
        //         metadata: {
        //             serviceName: 'Clinic Consultation',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.CLINIC_VISIT,
        //         },
        //     },
        //     {
        //         id: 'past2',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '1',
        //         date: new Date('2024-11-21'),
        //         startTime: '11:00',
        //         endTime: '11:30',
        //         status: AppointmentStatus.COMPLETED,
        //         notes: 'Follow-up session',
        //         symptoms: ['Improved mobility', 'Reduced pain'],
        //         paymentStatus: PaymentStatus.PAID,
        //         amount: 600,
        //         createdAt: new Date('2024-11-14'),
        //         updatedAt: new Date('2024-11-21'),
        //         metadata: {
        //             serviceName: 'Clinic Consultation',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.CLINIC_VISIT,
        //         },
        //     },
        //     {
        //         id: 'past3',
        //         patientId,
        //         doctorId: '1',
        //         serviceId: '2',
        //         date: new Date('2024-11-14'),
        //         startTime: '15:00',
        //         endTime: '16:00',
        //         status: AppointmentStatus.COMPLETED,
        //         notes: 'Home visit for assessment',
        //         symptoms: ['Severe back pain', 'Difficulty walking'],
        //         paymentStatus: PaymentStatus.PAID,
        //         amount: 1200,
        //         createdAt: new Date('2024-11-07'),
        //         updatedAt: new Date('2024-11-14'),
        //         metadata: {
        //             serviceName: 'Home Visit',
        //             doctorName: 'Dr. Sarah Johnson',
        //             serviceType: ServiceType.HOME_VISIT,
        //         },
        //     },
        // ];

        // if (limit) return pastAppointments.slice(0, limit);
        // return pastAppointments;
        const appointments = await appointmentService.getAppointments({ patientId });
        const past = appointments
            .filter(a =>
                new Date(a.date) < new Date() ||
                a.status === AppointmentStatus.COMPLETED
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return limit ? past.slice(0, limit) : past;
    }

    // --- Billing ---
    // Get invoices/payments
    async getInvoices(patientId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        return [
            {
                id: 'inv1',
                date: new Date('2024-11-28'),
                amount: 600,
                status: 'PAID',
                appointmentId: 'past1',
                service: ServiceType.CLINIC_VISIT,
                paymentMethod: 'Credit Card',
                invoiceNumber: 'INV-2024-00123',
            },
            {
                id: 'inv2',
                date: new Date('2024-11-21'),
                amount: 600,
                status: 'PAID',
                appointmentId: 'past2',
                service: ServiceType.CLINIC_VISIT,
                paymentMethod: 'UPI',
                invoiceNumber: 'INV-2024-00119',
            },
            {
                id: 'inv3',
                date: new Date('2024-11-14'),
                amount: 1200,
                status: 'PAID',
                appointmentId: 'past3',
                service: ServiceType.HOME_VISIT,
                paymentMethod: 'Cash',
                invoiceNumber: 'INV-2024-00115',
            },
        ] as Invoice[];
    }
}

export const patientService = new PatientService();