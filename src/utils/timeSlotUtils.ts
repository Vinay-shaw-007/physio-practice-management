import { AvailabilitySlot } from '../types';

export const generateTimeSlots = (
    startTime: string,
    endTime: string,
    slotDuration: number = 30,
    maxAppointments: number = 1
): Array<{ start: string; end: string }> => {
    const slots: Array<{ start: string; end: string }> = [];

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
    ) {
        // Calculate end time for this slot
        let endHourCalc = currentHour;
        let endMinuteCalc = currentMinute + slotDuration;

        while (endMinuteCalc >= 60) {
            endHourCalc += 1;
            endMinuteCalc -= 60;
        }

        // Format times
        const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const slotEnd = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;

        // Check if slot fits within availability
        if (
            endHourCalc < endHour ||
            (endHourCalc === endHour && endMinuteCalc <= endMinute)
        ) {
            slots.push({
                start: slotStart,
                end: slotEnd,
            });
        }

        // Move to next slot
        currentMinute += slotDuration;
        while (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
        }
    }

    return slots;
};

export const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || '';
};

export const formatTimeForDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const isTimeSlotAvailable = (
    date: Date,
    time: string,
    availabilitySlots: AvailabilitySlot[],
    bookedSlots: Array<{ date: string; time: string }>
): boolean => {
    const dayOfWeek = date.getDay();

    // Check if time falls within any availability slot
    const isWithinAvailability = availabilitySlots.some(slot => {
        if (slot.dayOfWeek !== dayOfWeek) return false;
        return time >= slot.startTime && time <= slot.endTime;
    });

    if (!isWithinAvailability) return false;

    // Check if slot is already booked
    const isBooked = bookedSlots.some(
        slot =>
            new Date(slot.date).toDateString() === date.toDateString() &&
            slot.time === time
    );

    return !isBooked;
};