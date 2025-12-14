import { Doctor, Gender, Patient, UserRole } from "@/types";

export const mockPatient: Patient = {
    id: '',
    email: '',
    name: '',
    role: UserRole.PATIENT,
    phone: '',
    avatar: '',
    dateOfBirth: undefined, // undefined so it forces user to select
    gender: undefined,
    address: '',
    medicalHistory: '',
    allergies: [],
    medications: [],
    bloodGroup: '',
    height: 0, 
    weight: 0, 
    emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};;

export const mockDoctor: Doctor = {
    id: '1',
    email: 'doctor@example.com',
    name: 'Dr. Lakhi Shaw',
    role: UserRole.DOCTOR,
    phone: '+91 91234 56789',
    avatar: '',
    specialization: 'Physiotherapy',
    qualifications: ['MPT - Orthopedics, BPT'],
    yearsOfExperience: 10,
    bio: 'Experienced physiotherapist specializing in orthopedic rehabilitation and sports injuries.',
    createdAt: new Date('2022-05-10'),
    updatedAt: new Date('2024-10-05'),
};