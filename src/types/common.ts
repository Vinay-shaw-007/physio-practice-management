// Shared enums and base types
export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export enum AppointmentStatus {
  NEW = 'NEW',
  AWAITING = 'AWAITING',
  CONFIRMED = 'CONFIRMED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceType {
  CLINIC_VISIT = 'CLINIC_VISIT',
  HOME_VISIT = 'HOME_VISIT',
  VIDEO_CONSULT = 'VIDEO_CONSULT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}