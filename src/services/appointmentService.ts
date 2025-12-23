// import { ConsultationData } from '@/components/appointments/ConsultationModal';
// import { Appointment, AppointmentStatus } from '../types';
// import { mockStorage } from '../utils/mockStorage';
// import { invoiceService } from './invoiceService';

// class AppointmentService {
//   // private appointments: Appointment[] = [...mockAppointments];

//   // GET /api/appointments
//   async getAppointments(params?: {
//     status?: string;
//     date?: Date;
//     doctorId?: string;
//     patientId?: string;
//   }): Promise<Appointment[]> {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 300));

//     let filtered = mockStorage.getAppointments();

//     // Backend Logic: Apply Filters
//     if (params?.doctorId) {
//       filtered = filtered.filter(appt => appt.doctorId === params.doctorId);
//     }

//     if (params?.patientId) {
//       filtered = filtered.filter(appt => appt.patientId === params.patientId);
//     }

//     if (params?.status && params.status !== 'ALL') {
//       filtered = filtered.filter(appt => appt.status === params.status);
//     }

//     if (params?.date) {
//       const targetDate = new Date(params.date).toDateString();
//       filtered = filtered.filter(appt =>
//         new Date(appt.date).toDateString() === targetDate
//       );
//     }

//     return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }

//   async getAppointmentById(id: string): Promise<Appointment> {
//     await new Promise(resolve => setTimeout(resolve, 200));

//     const appointment = mockStorage.getAppointments().find(a => a.id === id);
//     if (!appointment) throw new Error('Appointment not found');

//     return appointment;
//   }

//   // Internal method used by BookingService
//   async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
//     await new Promise(resolve => setTimeout(resolve, 300));

//     const appointments = mockStorage.getAppointments();
//     const newAppointment: Appointment = {
//       ...data,
//       id: appointments.length + 1 + '',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     } as Appointment;

//     appointments.unshift(newAppointment);
//     mockStorage.saveAppointments(appointments);
//     return newAppointment;
//   }

//   async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
//     await new Promise(resolve => setTimeout(resolve, 300));

//     const appointments = mockStorage.getAppointments();
//     const index = appointments.findIndex(appt => appt.id === id);
//     if (index === -1) throw new Error('Appointment not found');

//     appointments[index] = {
//       ...appointments[index],
//       ...data,
//       updatedAt: new Date(),
//     };

//     mockStorage.saveAppointments(appointments);

//     return appointments[index];
//   }

//   async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
//     return this.updateAppointment(id, { status });
//   }

//   async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
//     const appt = await this.getAppointmentById(id);
//     const updatedNotes = reason ? `${appt.notes || ''}\n[Cancelled]: ${reason}` : appt.notes;

//     return this.updateAppointment(id, {
//       status: AppointmentStatus.CANCELLED,
//       notes: updatedNotes,
//     });
//   }

//   // Extra methods

//   async getTodayAppointments(): Promise<Appointment[]> {
//     const today = new Date().toDateString();
//     const appointments = mockStorage.getAppointments();
//     return appointments.filter(appt =>
//       new Date(appt.date).toDateString() === today
//     );
//   }

//   async getUpcomingAppointments(limit?: number): Promise<Appointment[]> {
//     const now = new Date();
//     const appointments = mockStorage.getAppointments();
//     const upcoming = appointments.filter(appt =>
//       new Date(appt.date) > now
//     ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     if (limit) {
//       return upcoming.slice(0, limit);
//     }
//     return upcoming;
//   }

//   // NEW: Handle Consultation Completion & Invoice Generation
//   async completeAppointment(id: string, data: ConsultationData): Promise<Appointment> {
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const appointment = await this.getAppointmentById(id);

//     // Merge consultation data into metadata
//     const updatedMetadata = {
//       ...appointment.metadata,
//       diagnosis: data.diagnosis,
//       treatment: data.treatment,
//       prescription: data.prescription,
//       clinicalNotes: data.clinicalNotes,
//       completedAt: new Date()
//     };

//     // 1. Update the appointment status
//     const updatedAppointment = await this.updateAppointment(id, {
//       status: AppointmentStatus.COMPLETED,
//       metadata: updatedMetadata
//     });

//     // 2. TRIGGER INVOICE GENERATION
//     // This ensures the bill is ready immediately after the doctor clicks "Complete"
//     await invoiceService.generateFromAppointment(updatedAppointment);

//     return updatedAppointment;
//   }
// }

// export const appointmentService = new AppointmentService();

import { ConsultationData } from '@/components/appointments/ConsultationModal';
import { Appointment, AppointmentStatus } from '../types';
import { mockStorage } from '../utils/mockStorage';
import { invoiceService } from './invoiceService';

class AppointmentService {

  // GET /api/appointments
  async getAppointments(params?: {
    status?: string;
    date?: Date;
    doctorId?: string;
    patientId?: string;
  }): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let allAppointments = mockStorage.getAppointments();
    
    // --- NEW: Auto-Absent Logic ---
    // Check for appointments that have ended > 5 mins ago and are still pending
    const now = new Date();
    let hasUpdates = false;

    allAppointments = allAppointments.map(appt => {
        // Only check active appointments
        if (appt.status === AppointmentStatus.CONFIRMED || appt.status === AppointmentStatus.RESCHEDULED) {
            
            // Construct the Appointment End Time
            const apptDate = new Date(appt.date);
            const [hours, minutes] = appt.endTime.split(':').map(Number);
            const apptEnd = new Date(apptDate);
            apptEnd.setHours(hours, minutes, 0, 0);

            // Add 5 minutes buffer
            const bufferTime = new Date(apptEnd.getTime() + 5 * 60000);

            // If current time is past the buffer, mark as ABSENT
            if (now > bufferTime) {
                hasUpdates = true;
                return { ...appt, status: AppointmentStatus.ABSENT };
            }
        }
        return appt;
    });

    // Save changes if any updates happened
    if (hasUpdates) {
        mockStorage.saveAppointments(allAppointments);
    }
    // -----------------------------

    let filtered = allAppointments;

    // Backend Logic: Apply Filters
    if (params?.doctorId) {
      filtered = filtered.filter(appt => appt.doctorId === params.doctorId);
    }

    if (params?.patientId) {
      filtered = filtered.filter(appt => appt.patientId === params.patientId);
    }

    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter(appt => appt.status === params.status);
    }

    if (params?.date) {
      const targetDate = new Date(params.date).toDateString();
      filtered = filtered.filter(appt =>
        new Date(appt.date).toDateString() === targetDate
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const appointment = mockStorage.getAppointments().find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');

    return appointment;
  }

  // Internal method used by BookingService
  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const appointments = mockStorage.getAppointments();
    const newAppointment: Appointment = {
      ...data,
      id: appointments.length + 1 + '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Appointment;

    appointments.unshift(newAppointment);
    mockStorage.saveAppointments(appointments);
    return newAppointment;
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const appointments = mockStorage.getAppointments();
    const index = appointments.findIndex(appt => appt.id === id);
    if (index === -1) throw new Error('Appointment not found');

    appointments[index] = {
      ...appointments[index],
      ...data,
      updatedAt: new Date(),
    };

    mockStorage.saveAppointments(appointments);

    return appointments[index];
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    return this.updateAppointment(id, { status });
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const appt = await this.getAppointmentById(id);
    const updatedNotes = reason ? `${appt.notes || ''}\n[Cancelled]: ${reason}` : appt.notes;

    return this.updateAppointment(id, {
      status: AppointmentStatus.CANCELLED,
      notes: updatedNotes,
    });
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toDateString();
    const appointments = mockStorage.getAppointments();
    return appointments.filter(appt =>
      new Date(appt.date).toDateString() === today
    );
  }

  async getUpcomingAppointments(limit?: number): Promise<Appointment[]> {
    const now = new Date();
    const appointments = mockStorage.getAppointments();
    const upcoming = appointments.filter(appt =>
      new Date(appt.date) > now
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (limit) {
      return upcoming.slice(0, limit);
    }
    return upcoming;
  }

  async completeAppointment(id: string, data: ConsultationData): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const appointment = await this.getAppointmentById(id);

    const updatedMetadata = {
      ...appointment.metadata,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      prescription: data.prescription,
      clinicalNotes: data.clinicalNotes,
      completedAt: new Date()
    };

    const updatedAppointment = await this.updateAppointment(id, {
      status: AppointmentStatus.COMPLETED,
      metadata: updatedMetadata
    });

    await invoiceService.generateFromAppointment(updatedAppointment);

    return updatedAppointment;
  }
}

export const appointmentService = new AppointmentService();