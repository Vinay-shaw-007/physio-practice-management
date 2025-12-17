// import { AvailableDate, AvailableTimeSlot, BookingData } from '@/types/booking';
// import { mockStorage } from '@/utils/mockStorage';
// import { addDays, eachDayOfInterval, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
// import { Appointment, AppointmentStatus, PaymentStatus } from '../types';
// import { appointmentService } from './appointmentService';
// import { availabilityService } from './availabilityService';
// import { serviceService } from './serviceConfigurationService';
// class BookingService {
//     // Mock data storage
//     // private appointments: Appointment[] = [...mockAppointments];

//     // Get available dates for booking (next 30 days)
//     // BUSINESS LOGIC: Get only dates that actually have slots available
//     async getAvailableDates(
//         doctorId: string,
//         serviceId: string
//     ): Promise<AvailableDate[]> {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 300));

//         const service = await serviceService.getServiceById(serviceId);
//         if (!service || !service.isActive) {
//             throw new Error('Service is not available');
//         }

//         // Get doctor's availability and time off
//         const [availabilitySlots, unavailability] = await Promise.all([
//             availabilityService.getAvailabilitySlots(doctorId),
//             availabilityService.getUnavailability(doctorId),
//         ]);

//         const availableDates: AvailableDate[] = [];
//         const today = startOfDay(new Date());
//         const endDate = addDays(today, 30); // Show next 30 days
//         const days = eachDayOfInterval({ start: today, end: endDate });

//         // Optimization: Fetch all confirmed appointments once
//         const allAppointments = mockStorage.getAppointments().filter(a =>
//             a.doctorId === doctorId && a.status !== AppointmentStatus.CANCELLED
//         );

//         for (const day of days) {
//             // Logic 1: Check Doctor's Time Off
//             // Skip if day is in unavailability (time off)
//             const isUnavailable = unavailability.some(unav => {
//                 const start = startOfDay(new Date(unav.startDate));
//                 const end = endOfDay(new Date(unav.endDate));
//                 return isWithinInterval(day, { start, end });
//             });

//             if (isUnavailable) continue;

//             // Logic 2: Check Weekly Schedule
//             const dayOfWeek = day.getDay();
//             const dayAvailabilitySlots = availabilitySlots.filter(slot =>
//                 slot.dayOfWeek === dayOfWeek && slot.isRecurring
//             );

//             if (dayAvailabilitySlots.length === 0) continue;

//             // Logic 3: Calculate actual free slots (Collision detection)
//             // Get available time slots for this day
//             const timeSlots = await this.generateAvailableTimeSlots(
//                 doctorId,
//                 day,
//                 service.duration,
//                 allAppointments
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

//     // BUSINESS LOGIC: Generate specific time slots for a day
//     // Generate available time slots for a specific date
//     async generateAvailableTimeSlots(
//         doctorId: string,
//         date: Date,
//         serviceDuration: number,
//         preFetchedAppointments?: Appointment[]
//     ): Promise<AvailableTimeSlot[]> {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 200));

//         const dayOfWeek = date.getDay();
//         const availabilitySlots = await availabilityService.getAvailabilitySlots(doctorId);
//         const daySlots = availabilitySlots.filter(slot =>
//             slot.dayOfWeek === dayOfWeek && slot.isRecurring
//         );

//         // Use provided appointments or fetch fresh from DB
//         const appointments = preFetchedAppointments || mockStorage.getAppointments().filter(a =>
//             a.doctorId === doctorId && a.status !== AppointmentStatus.CANCELLED
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
//                 return !this.isSlotBooked(date, slot.startTime, appointments);
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

//         // Filter out past time slots if date is today
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
//             // const endTimeCalculated = this.addMinutes(slotStart, slotDuration);

//             const [endSlotHour, endSlotMinute] = this.addMinutesToTime(currentHour, currentMinute, slotDuration);
//             const slotEnd = `${endSlotHour.toString().padStart(2, '0')}:${endSlotMinute.toString().padStart(2, '0')}`;

//             // Check if slot fits within availability range
//             if (endSlotHour < endHour || (endSlotHour === endHour && endSlotMinute <= endMinute)) {
//                 slots.push({
//                     startTime: slotStart,
//                     endTime: slotEnd,
//                 });
//             }

//             // // Move to next possible start time
//             // currentMinute += interval;
//             // if (currentMinute >= 60) {
//             //     currentHour += 1;
//             //     currentMinute -= 60;
//             // }

//             // Increment
//             const [nextHour, nextMinute] = this.addMinutesToTime(currentHour, currentMinute, interval);
//             currentHour = nextHour;
//             currentMinute = nextMinute;
//         }

//         return slots;
//     }

//     // Check if a time slot is already booked
//     private isSlotBooked(
//         date: Date,
//         startTime: string,
//         appointments: Appointment[]
//     ): boolean {
//         const appointmentDate = format(date, 'yyyy-MM-dd');

//         return appointments.some(appointment => {
//             const appointmentDateStr = format(new Date(appointment.date), 'yyyy-MM-dd');
//             return (
//                 appointmentDateStr === appointmentDate &&
//                 appointment.startTime === startTime &&
//                 appointment.status !== 'CANCELLED'
//             );
//         });
//     }

//     private addMinutesToTime(h: number, m: number, add: number): [number, number] {
//         const total = h * 60 + m + add;
//         return [Math.floor(total / 60), total % 60];
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

//     // BUSINESS LOGIC: Perform Booking Transaction
//     // Create a booking
//     async createBooking(bookingData: BookingData): Promise<Appointment> {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const service = await serviceService.getServiceById(bookingData.serviceId);

//         if (!service || !service.isActive) {
//             throw new Error('Service is not available');
//         }

//         // Concurrency check (Simulation): Re-validate availability
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
//         // const endTime = this.addMinutes(bookingData.timeSlot, service.duration);

//         const [endHour, endMinute] = bookingData.timeSlot.split(':').map(Number);
//         const [finalEndH, finalEndM] = this.addMinutesToTime(endHour, endMinute, service.duration);
//         const endTime = `${finalEndH.toString().padStart(2, '0')}:${finalEndM.toString().padStart(2, '0')}`;

//         // Create appointment
//         const newAppointment: Appointment = {
//             id: (mockStorage.getAppointments().length + 1).toString(),
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
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             metadata: {
//                 serviceName: service.name,
//                 serviceType: service.type,
//                 patientName: 'Current User', // In real app, fetch from auth context or DB
//                 doctorName: 'Dr. Sarah Johnson' // Mock
//             },
//         };

//         // Save to DB via Appointment Service
//         return appointmentService.createAppointment(newAppointment);
//     }

//     // Get booking summary for confirmation
//     async getBookingSummary(serviceId: string, date: Date, timeSlot: string) {
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 200));

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

//     // Get appointments for a patient
//     async getPatientAppointments(patientId: string): Promise<Appointment[]> {
//         await new Promise(resolve => setTimeout(resolve, 300));
//         const appointments = mockStorage.getAppointments();
//         return appointments.filter(appt => appt.patientId === patientId);
//     }

//     // Get appointments for a doctor
//     async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
//         await new Promise(resolve => setTimeout(resolve, 300));
//         const appointments = mockStorage.getAppointments();
//         return appointments.filter(appt => appt.doctorId === doctorId);
//     }

//     async rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<Appointment> {
//         const appointment = await appointmentService.getAppointmentById(appointmentId);

//         const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
//         const [endHour, endMinute] = appointment.endTime.split(':').map(Number);
//         const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

//         const [newStartHour, newStartMinute] = newTime.split(':').map(Number);
//         const [newEndHour, newEndMinute] = this.addMinutesToTime(newStartHour, newStartMinute, duration);
//         const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;

//         return appointmentService.updateAppointment(appointmentId, {
//             date: newDate,
//             startTime: newTime,
//             endTime: newEndTime,
//             status: AppointmentStatus.RESCHEDULED
//         });
//     }

//     // Cancel an appointment
//     async cancelBooking(appointmentId: string, reason?: string): Promise<Appointment> {
//         await new Promise(resolve => setTimeout(resolve, 300));

//         // const appointment = this.appointments.find(appt => appt.id === appointmentId);
//         // if (!appointment) {
//         //     throw new Error('Appointment not found');
//         // }

//         // appointment.status = AppointmentStatus.CANCELLED;
//         // appointment.notes = reason ? `${appointment.notes}\nCancelled: ${reason}` : 'Cancelled';
//         // appointment.updatedAt = new Date();

//         // return appointment;
//         return appointmentService.cancelAppointment(appointmentId, reason);
//     }

//     // Update appointment status
//     async updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment> {
//         await new Promise(resolve => setTimeout(resolve, 300));

//         return appointmentService.updateAppointmentStatus(appointmentId, status);
//         // const appointment = this.appointments.find(appt => appt.id === appointmentId);
//         // if (!appointment) {
//         //     throw new Error('Appointment not found');
//         // }

//         // appointment.status = status;
//         // appointment.updatedAt = new Date();

//         // return appointment;
//     }
// }

// export const bookingService = new BookingService();
// export type { AvailableDate, AvailableTimeSlot, BookingData };



import { addDays, eachDayOfInterval, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { mockStorage } from '../utils/mockStorage';
import { appointmentService } from './appointmentService';
import { availabilityService } from './availabilityService';
import { serviceService } from './serviceConfigurationService';
import { AvailableDate, AvailableTimeSlot, BookingData } from '@/types/booking';

class BookingService {
    
    // BUSINESS LOGIC: Get only dates that actually have slots available FOR THE SPECIFIC SERVICE
    async getAvailableDates(doctorId: string, serviceId: string): Promise<AvailableDate[]> {
        const service = await serviceService.getServiceById(serviceId);
        if (!service || !service.isActive) throw new Error('Service not available');

        const [availabilitySlots, unavailability] = await Promise.all([
            availabilityService.getAvailabilitySlots(doctorId),
            availabilityService.getUnavailability(doctorId),
        ]);

        const availableDates: AvailableDate[] = [];
        const today = startOfDay(new Date());
        const endDate = addDays(today, 30);
        const days = eachDayOfInterval({ start: today, end: endDate });

        // Optimization: Fetch all confirmed appointments once
        const allAppointments = mockStorage.getAppointments().filter(a => 
            a.doctorId === doctorId && a.status !== AppointmentStatus.CANCELLED
        );

        for (const day of days) {
            // Logic 1: Check Doctor's Time Off
            const isUnavailable = unavailability.some(unav => {
                const start = startOfDay(new Date(unav.startDate));
                const end = endOfDay(new Date(unav.endDate));
                return isWithinInterval(day, { start, end });
            });
            if (isUnavailable) continue;

            // Logic 2: Check Weekly Schedule & Service Match
            const dayOfWeek = day.getDay();
            
            // FIX: Filter slots that are for this day AND support this service
            const daySlots = availabilitySlots.filter(s => 
                s.dayOfWeek === dayOfWeek && 
                s.isRecurring &&
                // If serviceIds is empty/undefined, it means ALL. If not, check if serviceId is included.
                (!s.serviceIds || s.serviceIds.length === 0 || s.serviceIds.includes(serviceId))
            );

            if (daySlots.length === 0) continue;

            // Logic 3: Calculate actual free slots (Collision detection)
            // Note: We pass serviceId now to double-check
            const slots = await this.generateAvailableTimeSlots(doctorId, day, serviceId, service.duration, allAppointments);
            
            if (slots.length > 0) {
                availableDates.push({
                    date: day,
                    availableSlots: slots.length,
                    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                    isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
                });
            }
        }
        return availableDates;
    }

    // BUSINESS LOGIC: Generate specific time slots for a day
    async generateAvailableTimeSlots(
        doctorId: string, 
        date: Date, 
        serviceId: string, // NEW PARAM
        serviceDuration: number,
        preFetchedAppointments?: Appointment[]
    ): Promise<AvailableTimeSlot[]> {
        
        const dayOfWeek = date.getDay();
        const availabilitySlots = await availabilityService.getAvailabilitySlots(doctorId);
        
        // FIX: Filter slots by Service ID
        const daySlots = availabilitySlots.filter(s => 
            s.dayOfWeek === dayOfWeek && 
            s.isRecurring &&
            (!s.serviceIds || s.serviceIds.length === 0 || s.serviceIds.includes(serviceId))
        );
        
        const appointments = preFetchedAppointments || mockStorage.getAppointments().filter(a => 
            a.doctorId === doctorId && a.status !== AppointmentStatus.CANCELLED
        );

        const availableSlots: AvailableTimeSlot[] = [];

        for (const daySlot of daySlots) {
            const slots = this.generateSlotsFromRange(
                daySlot.startTime, 
                daySlot.endTime, 
                serviceDuration, 
                daySlot.slotDuration || 30
            );

            const filteredSlots = slots.filter(slot => !this.isSlotBooked(date, slot.startTime, appointments));

            filteredSlots.forEach(slot => {
                // Deduplicate slots if multiple availability rules overlap
                if (!availableSlots.some(existing => existing.startTime === slot.startTime)) {
                    availableSlots.push({
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        displayTime: this.formatTimeDisplay(slot.startTime, slot.endTime),
                        isAvailable: true,
                    });
                }
            });
        }

        // Filter out past slots if date is today
        const now = new Date();
        if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
            return availableSlots.filter(slot => {
                const [h, m] = slot.startTime.split(':').map(Number);
                const slotTime = new Date(date);
                slotTime.setHours(h, m, 0, 0);
                return slotTime > now;
            });
        }

        return availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    private isSlotBooked(date: Date, startTime: string, appointments: Appointment[]): boolean {
        const dateStr = format(date, 'yyyy-MM-dd');
        return appointments.some(a => 
            format(new Date(a.date), 'yyyy-MM-dd') === dateStr && a.startTime === startTime
        );
    }

    private generateSlotsFromRange(start: string, end: string, duration: number, interval: number): {startTime: string, endTime: string}[] {
        const slots = [];
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        
        let currH = startH, currM = startM;
        
        while (currH < endH || (currH === endH && currM < endM)) {
            const slotStart = `${currH.toString().padStart(2,'0')}:${currM.toString().padStart(2,'0')}`;
            const [endSlotH, endSlotM] = this.addMinutesToTime(currH, currM, duration);
            const slotEnd = `${endSlotH.toString().padStart(2,'0')}:${endSlotM.toString().padStart(2,'0')}`;

            if (endSlotH < endH || (endSlotH === endH && endSlotM <= endM)) {
                slots.push({ startTime: slotStart, endTime: slotEnd });
            }

            const [nextH, nextM] = this.addMinutesToTime(currH, currM, interval);
            currH = nextH;
            currM = nextM;
        }
        return slots;
    }

    private addMinutesToTime(h: number, m: number, add: number): [number, number] {
        const total = h * 60 + m + add;
        return [Math.floor(total / 60), total % 60];
    }

    private formatTimeDisplay(start: string, end: string): string {
        const fmt = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const dh = h % 12 || 12;
            return `${dh}:${m.toString().padStart(2,'0')} ${ampm}`;
        };
        return `${fmt(start)} - ${fmt(end)}`;
    }

    // BUSINESS LOGIC: Perform Booking Transaction
    async createBooking(data: BookingData): Promise<Appointment> {
        const service = await serviceService.getServiceById(data.serviceId);
        
        // Re-validate availability passing serviceId
        const slots = await this.generateAvailableTimeSlots(data.doctorId, data.date, data.serviceId, service.duration);
        if (!slots.some(s => s.startTime === data.timeSlot)) {
            throw new Error('Slot no longer available');
        }

        const [endH, endM] = data.timeSlot.split(':').map(Number);
        const [finalEndH, finalEndM] = this.addMinutesToTime(endH, endM, service.duration);
        const endTime = `${finalEndH.toString().padStart(2,'0')}:${finalEndM.toString().padStart(2,'0')}`;

        return appointmentService.createAppointment({
            patientId: data.patientId,
            doctorId: data.doctorId,
            serviceId: data.serviceId,
            date: data.date,
            startTime: data.timeSlot,
            endTime: endTime,
            status: AppointmentStatus.CONFIRMED,
            notes: data.patientNotes,
            amount: service.price,
            paymentStatus: PaymentStatus.PENDING,
            metadata: {
                serviceName: service.name,
                serviceType: service.type,
                patientName: 'Current User', 
                doctorName: 'Dr. Sarah Johnson' 
            }
        });
    }

    async rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string, newServiceId?: string): Promise<Appointment> {
        const appointment = await appointmentService.getAppointmentById(appointmentId);
        
        // Use existing service ID if not changing
        const serviceId = newServiceId || appointment.serviceId;
        const service = await serviceService.getServiceById(serviceId);

        const [startH, startM] = appointment.startTime.split(':').map(Number);
        const [endH, endM] = appointment.endTime.split(':').map(Number);
        // Recalculate duration based on service or existing time
        const duration = service ? service.duration : (endH * 60 + endM) - (startH * 60 + startM);

        const [newStartH, newStartM] = newTime.split(':').map(Number);
        const [newEndH, newEndM] = this.addMinutesToTime(newStartH, newStartM, duration);
        const newEndTime = `${newEndH.toString().padStart(2,'0')}:${newEndM.toString().padStart(2,'0')}`;

        return appointmentService.updateAppointment(appointmentId, {
            date: newDate,
            startTime: newTime,
            endTime: newEndTime,
            status: AppointmentStatus.RESCHEDULED
        });
    }

    async cancelBooking(id: string, reason: string): Promise<Appointment> {
        return appointmentService.cancelAppointment(id, reason);
    }
}

export const bookingService = new BookingService();