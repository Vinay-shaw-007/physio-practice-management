import { BaseEntity, ServiceType } from './common';

export interface Service extends BaseEntity {
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  type: ServiceType;
  isActive: boolean;
  doctorId?: string; // if specific to a doctor
}