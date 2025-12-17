import { AppointmentStatus, BaseEntity, PaymentStatus, ServiceType } from './common';

export interface Appointment extends BaseEntity {
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  symptoms?: string[];
  paymentStatus: PaymentStatus;
  amount: number;
  metadata?: AppointmentMetadata;
}

export interface AppointmentMetadata {
  serviceName?: string;
  patientName?: string;
  doctorName?: string;
  serviceType?: ServiceType;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  clinicalNotes?: string;
  completedAt?: Date;
}