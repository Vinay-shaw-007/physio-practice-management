
export interface ClinicSettings {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    taxId: string; // GSTIN
    currency: string;
    consultationFee: number;
}

const DEFAULT_SETTINGS: ClinicSettings = {
    name: 'PhysioPro Clinic',
    email: 'contact@physiopro.com',
    phone: '+91 98765 43210',
    address: '123 Health Avenue, Medical District, Bangalore - 560001',
    website: 'www.physiopro.com',
    taxId: 'GSTIN: 29ABCDE1234F1Z5',
    currency: 'INR',
    consultationFee: 500
};

class SettingsService {
    private STORAGE_KEY = 'physiopro_settings';

    async getSettings(): Promise<ClinicSettings> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            // Initialize with defaults if not found
            this.saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
        return JSON.parse(stored);
    }

    async saveSettings(settings: ClinicSettings): Promise<ClinicSettings> {
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }

    // Helper to get just the invoice-relevant details
    async getInvoiceDetails() {
        const settings = await this.getSettings();
        return {
            name: settings.name,
            address: settings.address,
            phone: settings.phone,
            email: settings.email,
            taxId: settings.taxId
        };
    }
}

export const settingsService = new SettingsService();