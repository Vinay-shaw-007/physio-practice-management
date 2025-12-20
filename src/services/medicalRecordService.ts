import { MedicalRecord } from '../types';
import { mockStorage } from '../utils/mockStorage';

class MedicalRecordService {
    
    async getRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const allRecords = mockStorage.getMedicalRecords([]);
        return allRecords
            .filter(r => r.patientId === patientId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async addRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate upload delay

        const newRecord: MedicalRecord = {
            ...record,
            id: `rec_${Date.now()}`,
        };

        const records = mockStorage.getMedicalRecords([]);
        records.unshift(newRecord);
        mockStorage.saveMedicalRecords(records);

        return newRecord;
    }

    async deleteRecord(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const records = mockStorage.getMedicalRecords([]);
        const filtered = records.filter(r => r.id !== id);
        mockStorage.saveMedicalRecords(filtered);
    }
}

export const medicalRecordService = new MedicalRecordService();