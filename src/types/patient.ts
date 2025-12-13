export interface MedicalRecord {
    id: string;
    patientId: string;
    date: Date;
    type: 'CONSULTATION' | 'LAB_TEST' | 'PRESCRIPTION' | 'VACCINATION' | 'SURGERY';
    title: string;
    description: string;
    doctorName: string;
    attachments?: string[];
    tags: string[];
}