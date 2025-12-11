import { BaseEntity } from './common';

export interface AvailabilitySlot extends BaseEntity {
    doctorId: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    isRecurring: boolean;
    maxAppointmentsPerSlot?: number;
    slotDuration?: number; // in minutes
    date?: Date; // For one-time availability
}

export interface Unavailability extends BaseEntity {
    doctorId: string;
    title: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    isAllDay: boolean;
    isRecurring?: boolean;
    recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    recurrenceEndDate?: Date;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    appointmentId?: string;
}