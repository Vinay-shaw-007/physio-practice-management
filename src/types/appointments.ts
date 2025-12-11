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
  metadata?: {
    serviceName?: string;
    patientName?: string;
    doctorName?: string;
    serviceType?: ServiceType;
  };
}