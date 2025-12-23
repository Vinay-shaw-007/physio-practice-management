import { Doctor, UserRole } from '../types';
import { mockStorage } from '../utils/mockStorage';

// // Template for a new doctor profile if fields are missing
// const DEFAULT_DOCTOR_PROFILE: Partial<Doctor> = {
//     specialization: 'General Physiotherapy',
//     yearsOfExperience: 0,
//     qualifications: [],
//     bio: '',
//     consultationFee: 500,
// };

class DoctorService {

    // FETCH REAL DOCTORS FROM DB
    async getAllDoctors(): Promise<Doctor[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // 1. Get ALL users from storage
        const allUsers = mockStorage.getUsers();

        // 2. Filter only those who are DOCTORS
        // This ensures we only show valid medical professionals
        const doctors = allUsers.filter(user => user.role === UserRole.DOCTOR);

        return doctors as Doctor[];
    }

    async getDoctorsByService(serviceId: string): Promise<Doctor[]> {
        const allDoctors = await this.getAllDoctors();

        // LOGIC: Filter doctors who can perform this service.
        // If a doctor has a 'services' list, we check it. 
        // If not (legacy/new profiles), we assume they can do all services for now.
        return allDoctors.filter(doc =>
            !doc.services || // If services are undefined, show doctor (fallback)
            doc.services.length === 0 ||
            doc.services.includes(serviceId)
        );
    }

    async getDoctorById(id: string): Promise<Doctor | undefined> {
        const allDoctors = await this.getAllDoctors();
        return allDoctors.find(d => d.id === id);
    }

    // Get doctor profile
    async getDoctorProfile(doctorId: string): Promise<Doctor> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = mockStorage.getUserById(doctorId);

        if (!user || user.role !== UserRole.DOCTOR) {
            throw new Error('Doctor not found');
        }

        // Merge existing user data with default doctor fields to ensure UI doesn't break
        return {
            ...user,
        } as Doctor;
    }

    // Update doctor profile
    async updateDoctorProfile(doctorId: string, updates: Partial<Doctor>): Promise<Doctor> {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

        // 1. Get current data to ensure we don't lose existing fields
        const currentProfile = await this.getDoctorProfile(doctorId);

        // 2. Merge updates
        const updatedProfile: Doctor = {
            ...currentProfile,
            ...updates,
            updatedAt: new Date()
        };

        // 3. Save to storage
        mockStorage.saveUser(updatedProfile);

        return updatedProfile;
    }
}

export const doctorService = new DoctorService();