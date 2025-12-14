import { Invoice } from '@/types/booking';
import { mockStorage } from '@/utils/mockStorage';
import { mockPatient } from '@/utils/utility';
import { Appointment, AppointmentStatus, MedicalRecord, Patient, UserRole } from '../types';
import { appointmentService } from './appointmentService';

const mockMedicalRecords: MedicalRecord[] = [
    // {
    //     id: 'rec1',
    //     patientId: '1',
    //     date: new Date('2024-11-15'),
    //     type: 'CONSULTATION',
    //     title: 'Knee Pain Follow-up',
    //     description: 'Follow-up consultation for chronic knee pain. Recommended physiotherapy exercises.',
    //     doctorName: 'Dr. Sarah Johnson',
    //     tags: ['Orthopedic', 'Follow-up'],
    // },
    // {
    //     id: 'rec2',
    //     patientId: '1',
    //     date: new Date('2024-10-20'),
    //     type: 'LAB_TEST',
    //     title: 'Blood Test Results',
    //     description: 'Complete blood count, lipid profile, and glucose levels.',
    //     doctorName: 'Dr. Michael Chen',
    //     attachments: ['blood_test_results.pdf'],
    //     tags: ['Laboratory', 'Routine'],
    // },
    // {
    //     id: 'rec3',
    //     patientId: '1',
    //     date: new Date('2024-10-10'),
    //     type: 'PRESCRIPTION',
    //     title: 'Pain Management',
    //     description: 'Prescription for pain relief and anti-inflammatory medication.',
    //     doctorName: 'Dr. Sarah Johnson',
    //     tags: ['Medication', 'Pain'],
    // },
];

// Helper to get today at 00:00:00
const getStartOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
class PatientService {

    // --- Profile Management ---

    // Get patient profile
    async getPatientProfile(patientId: string): Promise<Patient> {
        await new Promise(resolve => setTimeout(resolve, 300));

        // 1. Try to find the REAL user from the database
        const realUser = mockStorage.getUserById(patientId);
        if (realUser) {
            // 2. Merge the real user data (name, email, id) with the BLANK template.
            // This ensures fields like 'allergies' exist (as empty arrays) so the UI doesn't crash,
            // but they won't have the fake data anymore.
            return {
                ...realUser, // realUser properties (if they exist) will overwrite defaults
                // Ensure role is preserved
                role: realUser.role === UserRole.DOCTOR ? UserRole.PATIENT : realUser.role
            } as Patient;
        }

        // Fallback (only if something goes wrong and ID is invalid)
        return mockPatient;
    }

    // Update patient profile
    async updatePatientProfile(patientId: string, updates: Partial<Patient>): Promise<Patient> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // In a real app, this would update the backend
        
        const realUser = mockStorage.getUserById(patientId);
        const updated = {
            ...realUser,
            ...updates,
            updatedAt: new Date()
        } as Patient;

        mockStorage.saveUser(updated);
        return updated;
    }

    async uploadAvatar(patientId: string, file: File): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create local URL for preview
        const mockUrl = URL.createObjectURL(file);

        const realUser = await this.getPatientProfile(patientId);
        const data = {
            ...realUser,
            avatar: mockUrl,
            updatedAt: new Date(),
        } as Patient;
        
        mockStorage.saveUser(data);

        return mockUrl;
    }

    // --- Doctor View: Patient Management ---
    async getAllPatients(): Promise<Patient[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return all users who are PATIENTS
        const allUsers = mockStorage.getUsers();
        const patients = allUsers.filter(u => u.role === UserRole.PATIENT);
        
        // Cast them to Patient type (merging with blank to be safe)
        return patients.map(p => ({ ...mockPatient, ...p } as Patient));
    }

    // --- Medical Records ---

    // Get patient medical records
    async getMedicalRecords(patientId: string, limit?: number): Promise<MedicalRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Filter records for this SPECIFIC patient
        const allRecords = mockStorage.getMedicalRecords(mockMedicalRecords);
        const patientRecords = allRecords.filter(r => r.patientId === patientId);
        
        const sorted = patientRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
            favoriteDoctor: '-',
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

        const appointments = await appointmentService.getAppointments({ patientId });
        const startOfToday = getStartOfToday();
        const upcoming = appointments
            .filter(a => {
                const apptDate = new Date(a.date);
                // Reset appointment date time to 00:00:00 for accurate date-only comparison
                apptDate.setHours(0, 0, 0, 0);

                return apptDate >= startOfToday &&
                    a.status !== AppointmentStatus.CANCELLED &&
                    a.status !== AppointmentStatus.COMPLETED;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return limit ? upcoming.slice(0, limit) : upcoming;
    }

    // Get past appointments for patient
    async getPastAppointments(patientId: string, limit?: number): Promise<Appointment[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const appointments = await appointmentService.getAppointments({ patientId });
        const startOfToday = getStartOfToday();
        const past = appointments
            .filter(a => {
                const apptDate = new Date(a.date);
                apptDate.setHours(0, 0, 0, 0);

                return apptDate < startOfToday ||
                    a.status === AppointmentStatus.COMPLETED ||
                    a.status === AppointmentStatus.CANCELLED;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first for past
        return limit ? past.slice(0, limit) : past;
    }

    // --- Billing ---
    // Get invoices/payments
    async getInvoices(patientId: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        return [
            // {
            //     id: 'inv1',
            //     date: new Date('2024-11-28'),
            //     amount: 600,
            //     status: 'PAID',
            //     appointmentId: 'past1',
            //     service: ServiceType.CLINIC_VISIT,
            //     paymentMethod: 'Credit Card',
            //     invoiceNumber: 'INV-2024-00123',
            // },
            // {
            //     id: 'inv2',
            //     date: new Date('2024-11-21'),
            //     amount: 600,
            //     status: 'PAID',
            //     appointmentId: 'past2',
            //     service: ServiceType.CLINIC_VISIT,
            //     paymentMethod: 'UPI',
            //     invoiceNumber: 'INV-2024-00119',
            // },
            // {
            //     id: 'inv3',
            //     date: new Date('2024-11-14'),
            //     amount: 1200,
            //     status: 'PAID',
            //     appointmentId: 'past3',
            //     service: ServiceType.HOME_VISIT,
            //     paymentMethod: 'Cash',
            //     invoiceNumber: 'INV-2024-00115',
            // },
        ] as Invoice[];
    }
}

export const patientService = new PatientService();