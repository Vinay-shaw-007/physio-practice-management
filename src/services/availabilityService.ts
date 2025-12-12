import { mockStorage } from '@/utils/mockStorage';
import { AvailabilitySlot, Unavailability } from '../types';

// Mock data for development
const mockAvailabilitySlots: AvailabilitySlot[] = [
    {
        id: '1',
        doctorId: '1',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '12:00',
        isRecurring: true,
        slotDuration: 30,
        maxAppointmentsPerSlot: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        doctorId: '1',
        dayOfWeek: 1, // Monday
        startTime: '14:00',
        endTime: '18:00',
        isRecurring: true,
        slotDuration: 30,
        maxAppointmentsPerSlot: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        doctorId: '1',
        dayOfWeek: 2, // Tuesday
        startTime: '10:00',
        endTime: '17:00',
        isRecurring: true,
        slotDuration: 60,
        maxAppointmentsPerSlot: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const mockUnavailability: Unavailability[] = [
    {
        id: '1',
        doctorId: '1',
        title: 'Vacation',
        startDate: new Date('2024-12-25'),
        endDate: new Date('2024-12-31'),
        reason: 'Christmas holidays',
        isAllDay: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

class AvailabilityService {

    // GET /api/availability
    async getAvailabilitySlots(doctorId: string): Promise<AvailabilitySlot[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockStorage.getAvailability().filter(slot => slot.doctorId === doctorId);
    }

    // POST /api/availability
    async createAvailabilitySlot(slot: Omit<AvailabilitySlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<AvailabilitySlot> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const slots = mockStorage.getAvailability();
        const newSlot: AvailabilitySlot = {
            ...slot,
            id: slots.length + 1 + '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        slots.push(newSlot);
        mockStorage.saveAvailability(slots);
        return newSlot;
    }

    // PUT /api/availability/:id
    async updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const slots = mockStorage.getAvailability();
        const index = slots.findIndex(slot => slot.id === id);
        if (index === -1) throw new Error('Slot not found');

        slots[index] = {
            ...slots[index],
            ...updates,
            updatedAt: new Date(),
        };

        mockStorage.saveAvailability(slots);
        return slots[index];
    }

    // DELETE /api/availability/:id
    async deleteAvailabilitySlot(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const slots = mockStorage.getAvailability().filter(s => s.id !== id);
        mockStorage.saveAvailability(slots);
    }

    // --- Unavailability (Time Off) ---

    // GET /api/unavailability
    async getUnavailability(doctorId: string): Promise<Unavailability[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockStorage.getUnavailability().filter(item => item.doctorId === doctorId);
    }

    // POST /api/unavailability
    async createUnavailability(item: Omit<Unavailability, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unavailability> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const items = mockStorage.getUnavailability();
        const newItem: Unavailability = {
            ...item,
            id: items.length + 1 + '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        items.push(newItem);
        mockStorage.saveUnavailability(items);
        return newItem;
    }

    // DELETE /api/unavailability/:id
    async deleteUnavailability(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const items = mockStorage.getUnavailability().filter(i => i.id !== id);
        mockStorage.saveUnavailability(items);
    }

    // Helper: Generate time slots for a given date based on availability
    async generateAvailableSlots(
        doctorId: string,
        date: Date,
        serviceDuration: number = 30, // in minutes
    ): Promise<{ startTime: string; endTime: string }[]> {
        const dayOfWeek = date.getDay();
        const availabilitySlots = mockAvailabilitySlots.filter(
            slot => slot.doctorId === doctorId && slot.dayOfWeek === dayOfWeek
        );

        const slots: { startTime: string; endTime: string }[] = [];

        availabilitySlots.forEach(slot => {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);

            let currentHour = startHour;
            let currentMinute = startMinute;

            while (
                currentHour < endHour ||
                (currentHour === endHour && currentMinute < endMinute)
            ) {
                const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

                // Calculate end time
                let endHourCalc = currentHour;
                let endMinuteCalc = currentMinute + serviceDuration;

                while (endMinuteCalc >= 60) {
                    endHourCalc += 1;
                    endMinuteCalc -= 60;
                }

                const slotEnd = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;

                // Check if slot fits within availability
                if (
                    endHourCalc < endHour ||
                    (endHourCalc === endHour && endMinuteCalc <= endMinute)
                ) {
                    slots.push({
                        startTime: slotStart,
                        endTime: slotEnd,
                    });
                }

                // Move to next slot (using slot duration or default 30 min)
                currentMinute += slot.slotDuration || 30;
                while (currentMinute >= 60) {
                    currentHour += 1;
                    currentMinute -= 60;
                }
            }
        });

        return slots;
    }
}

export const availabilityService = new AvailabilityService();