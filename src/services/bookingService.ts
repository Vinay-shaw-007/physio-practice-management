// import { addDays, eachDayOfInterval, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
// import { Appointment, AppointmentStatus, PaymentStatus } from '../types';
// import { appointmentService } from './appointmentService';
// import { availabilityService } from './availabilityService';
// import { serviceService } from './serviceConfigurationService';

// interface AvailableDate {
//     date: Date;
//     availableSlots: number;
//     isWeekend: boolean;
//     isToday: boolean;
// }

// interface AvailableTimeSlot {
//     startTime: string;
//     endTime: string;
//     displayTime: string;
//     isAvailable: boolean;
// }

// interface BookingData {
//     serviceId: string;
//     date: Date;
//     timeSlot: string;
//     patientNotes?: string;
//     patientId: string;
//     doctorId: string;
// }

// class BookingService {
//     // Get available dates for booking (next 30 days)
//     async getAvailableDates(
//         doctorId: string,
//         serviceId: string
//     ): Promise<AvailableDate[]> {
//         const [service, availabilitySlots, unavailability, existingAppointments] = await Promise.all([
//             serviceService.getServiceById(serviceId),
//             availabilityService.getAvailabilitySlots(doctorId),
//             availabilityService.getUnavailability(doctorId),
//             appointmentService.getAppointments({ doctorId }),
//         ]);

//         if (!service || !service.isActive) {
//             throw new Error('Service is not available');
//         }

//         const availableDates: AvailableDate[] = [];
//         const today = startOfDay(new Date());
//         const endDate = addDays(today, 30); // Show next 30 days

//         const days = eachDayOfInterval({ start: today, end: endDate });

//         for (const day of days) {
//             // Skip if day is in unavailability (time off)
//             const isUnavailable = unavailability.some(unav => {
//                 const start = startOfDay(new Date(unav.startDate));
//                 const end = endOfDay(new Date(unav.endDate));
//                 return isWithinInterval(day, { start, end });
//             });

//             if (isUnavailable) continue;

//             const dayOfWeek = day.getDay();
//             const dayAvailabilitySlots = availabilitySlots.filter(slot =>
//                 slot.dayOfWeek === dayOfWeek && slot.isRecurring
//             );

//             if (dayAvailabilitySlots.length === 0) continue;

//             // Get available time slots for this day
//             const timeSlots = await this.generateAvailableTimeSlots(
//                 doctorId,
//                 day,
//                 service.duration,
//                 existingAppointments
//             );

//             if (timeSlots.length > 0) {
//                 availableDates.push({
//                     date: day,
//                     availableSlots: timeSlots.length,
//                     isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
//                     isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
//                 });
//             }
//         }

//         return availableDates;
//     }

//     // Generate available time slots for a specific date
//     async generateAvailableTimeSlots(
//         doctorId: string,
//         date: Date,
//         serviceDuration: number,
//         existingAppointments: Appointment[] = []
//     ): Promise<AvailableTimeSlot[]> {
//         const dayOfWeek = date.getDay();
//         const availabilitySlots = await availabilityService.getAvailabilitySlots(doctorId);

//         const daySlots = availabilitySlots.filter(slot =>
//             slot.dayOfWeek === dayOfWeek && slot.isRecurring
//         );

//         const availableSlots: AvailableTimeSlot[] = [];

//         for (const daySlot of daySlots) {
//             const slots = this.generateSlotsFromRange(
//                 daySlot.startTime,
//                 daySlot.endTime,
//                 serviceDuration,
//                 daySlot.slotDuration || 30
//             );

//             // Filter out slots that are already booked
//             const filteredSlots = slots.filter(slot => {
//                 return !this.isSlotBooked(date, slot.startTime, existingAppointments);
//             });

//             // Convert to display format
//             filteredSlots.forEach(slot => {
//                 availableSlots.push({
//                     startTime: slot.startTime,
//                     endTime: slot.endTime,
//                     displayTime: this.formatTimeDisplay(slot.startTime, slot.endTime),
//                     isAvailable: true,
//                 });
//             });
//         }

//         // Filter out past time slots for today
//         const now = new Date();
//         const today = format(now, 'yyyy-MM-dd');
//         const selectedDate = format(date, 'yyyy-MM-dd');

//         if (today === selectedDate) {
//             return availableSlots.filter(slot => {
//                 const [hours, minutes] = slot.startTime.split(':').map(Number);
//                 const slotTime = new Date();
//                 slotTime.setHours(hours, minutes, 0, 0);
//                 return slotTime > now;
//             });
//         }

//         return availableSlots;
//     }

//     // Generate time slots from a time range
//     private generateSlotsFromRange(
//         startTime: string,
//         endTime: string,
//         slotDuration: number,
//         interval: number = 30
//     ): Array<{ startTime: string; endTime: string }> {
//         const slots: Array<{ startTime: string; endTime: string }> = [];

//         const [startHour, startMinute] = startTime.split(':').map(Number);
//         const [endHour, endMinute] = endTime.split(':').map(Number);

//         let currentHour = startHour;
//         let currentMinute = startMinute;

//         while (
//             currentHour < endHour ||
//             (currentHour === endHour && currentMinute < endMinute)
//         ) {
//             const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

//             // Calculate end time based on slot duration
//             const endTimeCalculated = this.addMinutes(slotStart, slotDuration);

//             // Check if slot fits within availability range
//             if (this.isTimeLessOrEqual(endTimeCalculated, endTime)) {
//                 slots.push({
//                     startTime: slotStart,
//                     endTime: endTimeCalculated,
//                 });
//             }

//             // Move to next possible start time
//             currentMinute += interval;
//             if (currentMinute >= 60) {
//                 currentHour += 1;
//                 currentMinute -= 60;
//             }
//         }

//         return slots;
//     }

//     // Check if a time slot is already booked
//     private isSlotBooked(
//         date: Date,
//         startTime: string,
//         existingAppointments: Appointment[]
//     ): boolean {
//         const appointmentDate = format(date, 'yyyy-MM-dd');

//         return existingAppointments.some(appointment => {
//             const appointmentDateStr = format(new Date(appointment.date), 'yyyy-MM-dd');
//             return appointmentDateStr === appointmentDate && appointment.startTime === startTime;
//         });
//     }

//     // Add minutes to a time string
//     private addMinutes(time: string, minutes: number): string {
//         const [hours, mins] = time.split(':').map(Number);
//         const totalMinutes = hours * 60 + mins + minutes;
//         const newHours = Math.floor(totalMinutes / 60);
//         const newMinutes = totalMinutes % 60;
//         return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
//     }

//     // Compare time strings
//     private isTimeLessOrEqual(time1: string, time2: string): boolean {
//         const [h1, m1] = time1.split(':').map(Number);
//         const [h2, m2] = time2.split(':').map(Number);

//         if (h1 < h2) return true;
//         if (h1 === h2) return m1 <= m2;
//         return false;
//     }

//     // Format time for display (e.g., "9:00 AM - 9:30 AM")
//     private formatTimeDisplay(startTime: string, endTime: string): string {
//         const formatSingleTime = (time: string): string => {
//             const [hours, minutes] = time.split(':').map(Number);
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             const displayHours = hours % 12 || 12;
//             return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
//         };

//         return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
//     }

//     // Create a booking
//     async createBooking(bookingData: BookingData): Promise<Appointment> {
//         const service = await serviceService.getServiceById(bookingData.serviceId);

//         if (!service || !service.isActive) {
//             throw new Error('Service is not available');
//         }

//         // Validate the slot is still available
//         const availableSlots = await this.generateAvailableTimeSlots(
//             bookingData.doctorId,
//             bookingData.date,
//             service.duration
//         );

//         const isSlotAvailable = availableSlots.some(slot =>
//             slot.startTime === bookingData.timeSlot
//         );

//         if (!isSlotAvailable) {
//             throw new Error('Selected time slot is no longer available');
//         }

//         // Calculate end time
//         const endTime = this.addMinutes(bookingData.timeSlot, service.duration);

//         // Create appointment
//         const appointmentData: Partial<Appointment> = {
//             patientId: bookingData.patientId,
//             doctorId: bookingData.doctorId,
//             serviceId: bookingData.serviceId,
//             date: bookingData.date,
//             startTime: bookingData.timeSlot,
//             endTime,
//             status: AppointmentStatus.NEW,
//             notes: bookingData.patientNotes,
//             amount: service.price,
//             paymentStatus: PaymentStatus.PENDING,
//             metadata: {
//                 serviceName: service.name,
//                 serviceType: service.type,
//             },
//         };

//         const appointment = await appointmentService.createAppointment(appointmentData);

//         return appointment;
//     }

//     // Get booking summary for confirmation
//     async getBookingSummary(serviceId: string, date: Date, timeSlot: string) {
//         const service = await serviceService.getServiceById(serviceId);

//         if (!service) {
//             throw new Error('Service not found');
//         }

//         const endTime = this.addMinutes(timeSlot, service.duration);

//         return {
//             serviceName: service.name,
//             serviceDescription: service.description,
//             serviceType: service.type,
//             duration: service.duration,
//             price: service.price,
//             date: format(date, 'EEEE, MMMM d, yyyy'),
//             time: this.formatTimeDisplay(timeSlot, endTime),
//             startTime: timeSlot,
//             endTime,
//         };
//     }

//     // Cancel a booking
//     async cancelBooking(appointmentId: string, reason?: string): Promise<Appointment> {
//         return appointmentService.cancelAppointment(appointmentId, reason);
//     }
// }

// export const bookingService = new BookingService();
// export type { AvailableDate, AvailableTimeSlot, BookingData };


import { addDays, eachDayOfInterval, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { Appointment, AppointmentStatus, PaymentStatus, ServiceType } from '../types';
import { availabilityService } from './availabilityService';
import { serviceService } from './serviceConfigurationService';

// Mock appointments data
const mockAppointments: Appointment[] = [
    {
        id: '1',
        patientId: 'patient1',
        doctorId: '1',
        serviceId: '1',
        date: new Date('2024-12-10'),
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Follow-up for knee pain',
        symptoms: ['Knee pain', 'Swelling'],
        paymentStatus: PaymentStatus.PAID,
        amount: 600,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
        metadata: {
            serviceName: 'Clinic Consultation',
            patientName: 'John Doe',
            doctorName: 'Dr. Sarah Johnson',
            serviceType: ServiceType.CLINIC_VISIT,
        },
    },
    {
        id: '2',
        patientId: 'patient2',
        doctorId: '1',
        serviceId: '2',
        date: new Date('2024-12-10'),
        startTime: '14:00',
        endTime: '15:00',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Initial assessment',
        symptoms: ['Back pain'],
        paymentStatus: PaymentStatus.PENDING,
        amount: 1200,
        createdAt: new Date('2024-12-02'),
        updatedAt: new Date('2024-12-02'),
        metadata: {
            serviceName: 'Home Visit',
            patientName: 'Jane Smith',
            doctorName: 'Dr. Sarah Johnson',
            serviceType: ServiceType.HOME_VISIT,
        },
    },
    {
        id: '3',
        patientId: 'patient3',
        doctorId: '1',
        serviceId: '3',
        date: new Date('2024-12-11'),
        startTime: '11:00',
        endTime: '11:30',
        status: AppointmentStatus.CONFIRMED,
        notes: 'Follow-up consultation',
        symptoms: ['Shoulder pain'],
        paymentStatus: PaymentStatus.PAID,
        amount: 800,
        createdAt: new Date('2024-12-03'),
        updatedAt: new Date('2024-12-03'),
        metadata: {
            serviceName: 'Video Consultation',
            patientName: 'Robert Brown',
            doctorName: 'Dr. Sarah Johnson',
            serviceType: ServiceType.VIDEO_CONSULT,
        },
    },
];

interface AvailableDate {
    date: Date;
    availableSlots: number;
    isWeekend: boolean;
    isToday: boolean;
}

interface AvailableTimeSlot {
    startTime: string;
    endTime: string;
    displayTime: string;
    isAvailable: boolean;
}

interface BookingData {
    serviceId: string;
    date: Date;
    timeSlot: string;
    patientNotes?: string;
    patientId: string;
    doctorId: string;
}

class BookingService {
    // Mock data storage
    private appointments: Appointment[] = [...mockAppointments];

    // Get available dates for booking (next 30 days)
    async getAvailableDates(
        doctorId: string,
        serviceId: string
    ): Promise<AvailableDate[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const service = await serviceService.getServiceById(serviceId);
        if (!service || !service.isActive) {
            throw new Error('Service is not available');
        }

        // Get doctor's availability and time off
        const [availabilitySlots, unavailability] = await Promise.all([
            availabilityService.getAvailabilitySlots(doctorId),
            availabilityService.getUnavailability(doctorId),
        ]);

        const availableDates: AvailableDate[] = [];
        const today = startOfDay(new Date());
        const endDate = addDays(today, 30); // Show next 30 days

        const days = eachDayOfInterval({ start: today, end: endDate });

        for (const day of days) {
            // Skip if day is in unavailability (time off)
            const isUnavailable = unavailability.some(unav => {
                const start = startOfDay(new Date(unav.startDate));
                const end = endOfDay(new Date(unav.endDate));
                return isWithinInterval(day, { start, end });
            });

            if (isUnavailable) continue;

            const dayOfWeek = day.getDay();
            const dayAvailabilitySlots = availabilitySlots.filter(slot =>
                slot.dayOfWeek === dayOfWeek && slot.isRecurring
            );

            if (dayAvailabilitySlots.length === 0) continue;

            // Get available time slots for this day
            const timeSlots = await this.generateAvailableTimeSlots(
                doctorId,
                day,
                service.duration
            );

            if (timeSlots.length > 0) {
                availableDates.push({
                    date: day,
                    availableSlots: timeSlots.length,
                    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                    isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
                });
            }
        }

        return availableDates;
    }

    // Generate available time slots for a specific date
    async generateAvailableTimeSlots(
        doctorId: string,
        date: Date,
        serviceDuration: number
    ): Promise<AvailableTimeSlot[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const dayOfWeek = date.getDay();
        const availabilitySlots = await availabilityService.getAvailabilitySlots(doctorId);

        const daySlots = availabilitySlots.filter(slot =>
            slot.dayOfWeek === dayOfWeek && slot.isRecurring
        );

        const availableSlots: AvailableTimeSlot[] = [];

        for (const daySlot of daySlots) {
            const slots = this.generateSlotsFromRange(
                daySlot.startTime,
                daySlot.endTime,
                serviceDuration,
                daySlot.slotDuration || 30
            );

            // Filter out slots that are already booked
            const filteredSlots = slots.filter(slot => {
                return !this.isSlotBooked(date, slot.startTime, doctorId);
            });

            // Convert to display format
            filteredSlots.forEach(slot => {
                availableSlots.push({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    displayTime: this.formatTimeDisplay(slot.startTime, slot.endTime),
                    isAvailable: true,
                });
            });
        }

        // Filter out past time slots for today
        const now = new Date();
        const today = format(now, 'yyyy-MM-dd');
        const selectedDate = format(date, 'yyyy-MM-dd');

        if (today === selectedDate) {
            return availableSlots.filter(slot => {
                const [hours, minutes] = slot.startTime.split(':').map(Number);
                const slotTime = new Date();
                slotTime.setHours(hours, minutes, 0, 0);
                return slotTime > now;
            });
        }

        return availableSlots;
    }

    // Generate time slots from a time range
    private generateSlotsFromRange(
        startTime: string,
        endTime: string,
        slotDuration: number,
        interval: number = 30
    ): Array<{ startTime: string; endTime: string }> {
        const slots: Array<{ startTime: string; endTime: string }> = [];

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute < endMinute)
        ) {
            const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            // Calculate end time based on slot duration
            const endTimeCalculated = this.addMinutes(slotStart, slotDuration);

            // Check if slot fits within availability range
            if (this.isTimeLessOrEqual(endTimeCalculated, endTime)) {
                slots.push({
                    startTime: slotStart,
                    endTime: endTimeCalculated,
                });
            }

            // Move to next possible start time
            currentMinute += interval;
            if (currentMinute >= 60) {
                currentHour += 1;
                currentMinute -= 60;
            }
        }

        return slots;
    }

    // Check if a time slot is already booked
    private isSlotBooked(
        date: Date,
        startTime: string,
        doctorId: string
    ): boolean {
        const appointmentDate = format(date, 'yyyy-MM-dd');

        return this.appointments.some(appointment => {
            const appointmentDateStr = format(new Date(appointment.date), 'yyyy-MM-dd');
            return (
                appointment.doctorId === doctorId &&
                appointmentDateStr === appointmentDate &&
                appointment.startTime === startTime &&
                appointment.status !== 'CANCELLED'
            );
        });
    }

    // Add minutes to a time string
    private addMinutes(time: string, minutes: number): string {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }

    // Compare time strings
    private isTimeLessOrEqual(time1: string, time2: string): boolean {
        const [h1, m1] = time1.split(':').map(Number);
        const [h2, m2] = time2.split(':').map(Number);

        if (h1 < h2) return true;
        if (h1 === h2) return m1 <= m2;
        return false;
    }

    // Format time for display (e.g., "9:00 AM - 9:30 AM")
    private formatTimeDisplay(startTime: string, endTime: string): string {
        const formatSingleTime = (time: string): string => {
            const [hours, minutes] = time.split(':').map(Number);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        };

        return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
    }

    // Create a booking
    async createBooking(bookingData: BookingData): Promise<Appointment> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const service = await serviceService.getServiceById(bookingData.serviceId);

        if (!service || !service.isActive) {
            throw new Error('Service is not available');
        }

        // Validate the slot is still available
        const availableSlots = await this.generateAvailableTimeSlots(
            bookingData.doctorId,
            bookingData.date,
            service.duration
        );

        const isSlotAvailable = availableSlots.some(slot =>
            slot.startTime === bookingData.timeSlot
        );

        if (!isSlotAvailable) {
            throw new Error('Selected time slot is no longer available');
        }

        // Calculate end time
        const endTime = this.addMinutes(bookingData.timeSlot, service.duration);

        // Create appointment
        const newAppointment: Appointment = {
            id: `appt_${Date.now()}`,
            patientId: bookingData.patientId,
            doctorId: bookingData.doctorId,
            serviceId: bookingData.serviceId,
            date: bookingData.date,
            startTime: bookingData.timeSlot,
            endTime,
            status: AppointmentStatus.NEW,
            notes: bookingData.patientNotes,
            amount: service.price,
            paymentStatus: PaymentStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: {
                serviceName: service.name,
                serviceType: service.type,
            },
        };

        // Add to mock appointments
        this.appointments.push(newAppointment);

        return newAppointment;
    }

    // Get booking summary for confirmation
    async getBookingSummary(serviceId: string, date: Date, timeSlot: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const service = await serviceService.getServiceById(serviceId);

        if (!service) {
            throw new Error('Service not found');
        }

        const endTime = this.addMinutes(timeSlot, service.duration);

        return {
            serviceName: service.name,
            serviceDescription: service.description,
            serviceType: service.type,
            duration: service.duration,
            price: service.price,
            date: format(date, 'EEEE, MMMM d, yyyy'),
            time: this.formatTimeDisplay(timeSlot, endTime),
            startTime: timeSlot,
            endTime,
        };
    }

    // Get appointments for a patient
    async getPatientAppointments(patientId: string): Promise<Appointment[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.appointments.filter(appt => appt.patientId === patientId);
    }

    // Get appointments for a doctor
    async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.appointments.filter(appt => appt.doctorId === doctorId);
    }

    // Cancel an appointment
    async cancelBooking(appointmentId: string, reason?: string): Promise<Appointment> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const appointment = this.appointments.find(appt => appt.id === appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        appointment.status = AppointmentStatus.CANCELLED;
        appointment.notes = reason ? `${appointment.notes}\nCancelled: ${reason}` : 'Cancelled';
        appointment.updatedAt = new Date();

        return appointment;
    }

    // Update appointment status
    async updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const appointment = this.appointments.find(appt => appt.id === appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        appointment.status = status;
        appointment.updatedAt = new Date();

        return appointment;
    }
}

export const bookingService = new BookingService();
export type { AvailableDate, AvailableTimeSlot, BookingData };

