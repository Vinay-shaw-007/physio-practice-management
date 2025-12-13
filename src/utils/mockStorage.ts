import { Appointment, AvailabilitySlot, Service, ServiceType, Unavailability } from '../types';

// Storage Keys (Table Names)
const STORAGE_KEYS = {
    SERVICES: 'physiopro_services',
    AVAILABILITY: 'physiopro_availability',
    UNAVAILABILITY: 'physiopro_unavailability',
    APPOINTMENTS: 'physiopro_appointments',
};

// Seed Data (Initial "DB" state)
const SEED_DATA = {
    services: [
        {
            id: '1',
            name: 'Clinic Consultation',
            description: 'In-person consultation at the clinic',
            duration: 30,
            price: 600,
            type: ServiceType.CLINIC_VISIT,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            name: 'Home Visit',
            description: 'Physiotherapy session at patient\'s home',
            duration: 60,
            price: 1200,
            type: ServiceType.HOME_VISIT,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ] as Service[],
    availability: [
        {
            id: '1',
            doctorId: '1',
            dayOfWeek: 1, // Monday
            startTime: '09:00',
            endTime: '17:00',
            isRecurring: true,
            slotDuration: 30,
            maxAppointmentsPerSlot: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        // Add other days as needed for testing
    ] as AvailabilitySlot[],
    appointments: [] as Appointment[]
};

// Helper: Handle Date serialization/deserialization correctly
// JSON.stringify turns dates to strings; this turns them back to Date objects
const dateReviver = (_key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

class MockStorage {
    // Generic getter "SELECT * FROM table"
    private getItem<T>(key: string, seedData: T): T {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) {
                localStorage.setItem(key, JSON.stringify(seedData));
                return seedData;
            }
            return JSON.parse(stored, dateReviver);
        } catch (e) {
            console.error(`Error reading ${key} from storage`, e);
            return seedData;
        }
    }

    // Generic setter "UPDATE table"
    private setItem<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // --- Services Table Accessors ---
    getServices(): Service[] {
        return this.getItem(STORAGE_KEYS.SERVICES, SEED_DATA.services);
    }

    saveServices(services: Service[]) {
        this.setItem(STORAGE_KEYS.SERVICES, services);
    }

    // --- Availability Table Accessors ---
    getAvailability(): AvailabilitySlot[] {
        return this.getItem(STORAGE_KEYS.AVAILABILITY, SEED_DATA.availability);
    }

    saveAvailability(slots: AvailabilitySlot[]) {
        this.setItem(STORAGE_KEYS.AVAILABILITY, slots);
    }

    // --- Unavailability Table Accessors ---
    getUnavailability(): Unavailability[] {
        return this.getItem(STORAGE_KEYS.UNAVAILABILITY, []);
    }

    saveUnavailability(items: Unavailability[]) {
        this.setItem(STORAGE_KEYS.UNAVAILABILITY, items);
    }

    // --- Appointments Table Accessors ---
    getAppointments(): Appointment[] {
        return this.getItem(STORAGE_KEYS.APPOINTMENTS, SEED_DATA.appointments);
    }

    saveAppointments(appointments: Appointment[]) {
        this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    }

    // --- Patients (Mock Profile) ---
    // In a real app, this would be a "users" table. 
    // For now, we store one mock patient profile in localStorage to allow updates.
    getPatientProfile(defaultProfile: any): any {
        return this.getItem('physiopro_patient_profile', defaultProfile);
    }

    savePatientProfile(profile: any) {
        this.setItem('physiopro_patient_profile', profile);
    }

    // --- Medical Records ---
    getMedicalRecords(defaultRecords: any[]): any[] {
        return this.getItem('physiopro_medical_records', defaultRecords);
    }

    saveMedicalRecords(records: any[]) {
        this.setItem('physiopro_medical_records', records);
    }

    // Reset DB (Useful for testing)
    clearAll() {
        localStorage.clear();
        window.location.reload();
    }
}

export const mockStorage = new MockStorage();