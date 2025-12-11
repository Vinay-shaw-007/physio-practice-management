// import { Appointment } from '../types';
// import { apiService } from './api';

// class AppointmentService {
//     async getAppointments(params?: {
//         status?: string;
//         date?: Date;
//         doctorId?: string;
//         patientId?: string;
//     }): Promise<Appointment[]> {
//         return apiService.get<Appointment[]>('/appointments', { params });
//     }

//     async getAppointmentById(id: string): Promise<Appointment> {
//         return apiService.get<Appointment>(`/appointments/${id}`);
//     }

//     async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
//         return apiService.post<Appointment>('/appointments', data);
//     }

//     async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
//         return apiService.put<Appointment>(`/appointments/${id}`, data);
//     }

//     async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
//         return apiService.patch<Appointment>(`/appointments/${id}/status`, { status });
//     }

//     async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
//         return apiService.patch<Appointment>(`/appointments/${id}/cancel`, { reason });
//     }

//     async getTodayAppointments(): Promise<Appointment[]> {
//         return apiService.get<Appointment[]>('/appointments/today');
//     }

//     async getUpcomingAppointments(limit?: number): Promise<Appointment[]> {
//         return apiService.get<Appointment[]>('/appointments/upcoming', {
//             params: { limit },
//         });
//     }
// }

// export const appointmentService = new AppointmentService();


import { Appointment, AppointmentStatus, PaymentStatus } from '../types';

// Reuse the same mock appointments from bookingService
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
    },
  },
];

class AppointmentService {
  private appointments: Appointment[] = [...mockAppointments];

  async getAppointments(params?: {
    status?: string;
    date?: Date;
    doctorId?: string;
    patientId?: string;
  }): Promise<Appointment[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredAppointments = [...this.appointments];

    if (params?.doctorId) {
      filteredAppointments = filteredAppointments.filter(appt => appt.doctorId === params.doctorId);
    }

    if (params?.patientId) {
      filteredAppointments = filteredAppointments.filter(appt => appt.patientId === params.patientId);
    }

    if (params?.status) {
      filteredAppointments = filteredAppointments.filter(appt => appt.status === params.status);
    }

    if (params?.date) {
      const targetDate = params.date.toDateString();
      filteredAppointments = filteredAppointments.filter(appt => 
        new Date(appt.date).toDateString() === targetDate
      );
    }

    return filteredAppointments;
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const appointment = this.appointments.find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    
    return appointment;
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newAppointment: Appointment = {
      ...data,
      id: `appt_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Appointment;
    
    this.appointments.unshift(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.appointments.findIndex(appt => appt.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    this.appointments[index] = {
      ...this.appointments[index],
      ...data,
      updatedAt: new Date(),
    };
    
    return this.appointments[index];
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    return this.updateAppointment(id, { status });
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.updateAppointment(id, { 
      status: AppointmentStatus.CANCELLED,
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
    });
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toDateString();
    return this.appointments.filter(appt => 
      new Date(appt.date).toDateString() === today
    );
  }

  async getUpcomingAppointments(limit?: number): Promise<Appointment[]> {
    const now = new Date();
    const upcoming = this.appointments.filter(appt => 
      new Date(appt.date) > now
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (limit) {
      return upcoming.slice(0, limit);
    }
    return upcoming;
  }
}

export const appointmentService = new AppointmentService();