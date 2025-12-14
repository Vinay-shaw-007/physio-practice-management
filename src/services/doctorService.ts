import { Doctor, UserRole } from '../types';
import { mockStorage } from '../utils/mockStorage';

// Template for a new doctor profile if fields are missing
const DEFAULT_DOCTOR_PROFILE: Partial<Doctor> = {
    specialization: 'General Physiotherapy',
    yearsOfExperience: 0,
    qualifications: [],
    bio: '',
    consultationFee: 500,
};

class DoctorService {
    // Get doctor profile
    async getDoctorProfile(doctorId: string): Promise<Doctor> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const user = mockStorage.getUserById(doctorId);
        
        if (!user || user.role !== UserRole.DOCTOR) {
            throw new Error('Doctor not found');
        }

        // Merge existing user data with default doctor fields to ensure UI doesn't break
        return {
            ...DEFAULT_DOCTOR_PROFILE,
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