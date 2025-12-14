import { Appointment, AvailabilitySlot, Service, Unavailability, User } from '../types';

// Storage Keys
const STORAGE_KEYS = {
    SERVICES: 'physiopro_services',
    AVAILABILITY: 'physiopro_availability',
    UNAVAILABILITY: 'physiopro_unavailability',
    APPOINTMENTS: 'physiopro_appointments',
    USERS: 'physiopro_users', // Main Users Table
    MEDICAL_RECORDS: 'physiopro_medical_records',
};

// Helper: Handle Date serialization
const dateReviver = (_key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

class MockStorage {
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

    private setItem<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // --- Users (Auth) ---
    // FIX: Using User[] type instead of any[]
    getUsers(): User[] {
        return this.getItem<User[]>(STORAGE_KEYS.USERS, []);
    }

    // FIX: Using User type instead of any
    saveUser(user: User) {
        const users = this.getUsers();
        // Check if exists
        const index = users.findIndex((u) => u.id === user.id);
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        this.setItem(STORAGE_KEYS.USERS, users);
    }

    findUserByEmail(email: string): User | undefined {
        const users = this.getUsers();
        return users.find((u) => u.email === email);
    }

    // New Helper to get user by ID
    getUserById(id: string): User | undefined {
        const users = this.getUsers();
        return users.find((u) => u.id === id);
    }

    // --- Services ---
    getServices(): Service[] {
        return this.getItem(STORAGE_KEYS.SERVICES, []);
    }

    saveServices(services: Service[]) {
        this.setItem(STORAGE_KEYS.SERVICES, services);
    }

    // --- Availability ---
    getAvailability(): AvailabilitySlot[] {
        return this.getItem(STORAGE_KEYS.AVAILABILITY, []);
    }

    saveAvailability(slots: AvailabilitySlot[]) {
        this.setItem(STORAGE_KEYS.AVAILABILITY, slots);
    }

    // --- Unavailability ---
    getUnavailability(): Unavailability[] {
        return this.getItem(STORAGE_KEYS.UNAVAILABILITY, []);
    }

    saveUnavailability(items: Unavailability[]) {
        this.setItem(STORAGE_KEYS.UNAVAILABILITY, items);
    }

    // --- Appointments ---
    getAppointments(): Appointment[] {
        return this.getItem(STORAGE_KEYS.APPOINTMENTS, []);
    }

    saveAppointments(appointments: Appointment[]) {
        this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    }

    // --- Medical Records ---
    getMedicalRecords(defaultRecords: any[]): any[] {
        return this.getItem(STORAGE_KEYS.MEDICAL_RECORDS, defaultRecords);
    }

    saveMedicalRecords(records: any[]) {
        this.setItem(STORAGE_KEYS.MEDICAL_RECORDS, records);
    }

    clearAll() {
        localStorage.clear();
        window.location.reload();
    }
}

export const mockStorage = new MockStorage();