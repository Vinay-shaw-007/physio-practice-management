import { Appointment } from "./appointments";

export interface AvailableDate {
    date: Date;
    availableSlots: number;
    isWeekend?: boolean;
    isToday?: boolean;
}

export interface AvailableTimeSlot {
    startTime: string;
    endTime: string;
    displayTime: string;
    isAvailable: boolean;
}

export interface BookingData {
    serviceId: string;
    date: Date;
    timeSlot: string;
    patientNotes?: string;
    patientId: string;
    doctorId: string;
}

export interface BookingResponse {
    success: boolean;
    appointmentId: string;
    message: string;
    appointment: Appointment;
}