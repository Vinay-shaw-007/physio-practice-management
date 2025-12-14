import { BaseEntity, Gender, UserRole } from './common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  password?: string; // Optional for security
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Patient extends User {
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  medicalHistory?: string;
  bloodGroup?: string;
  allergies?: string[];
  medications?: string[];
  height: number, // cm
  weight: number, // kg
  emergencyContact: {
    name: string,
    relationship: string,
    phone: string,
  },
}

export interface Doctor extends User {
  specialization?: string;
  qualifications?: string[];
  yearsOfExperience?: number;
  bio?: string;
  consultationFee?: number;
}