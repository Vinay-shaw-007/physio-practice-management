import { mockStorage } from '@/utils/mockStorage';
import { Service, ServiceType } from '../types';

// Mock data for development - Pre-populated with your example services
const mockServices: Service[] = [
    {
        id: '1',
        name: 'Clinic Consultation',
        description: 'In-person consultation at the clinic',
        duration: 30,
        price: 600,
        type: ServiceType.CLINIC_VISIT,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Home Visit',
        description: 'Physiotherapy session at patient\'s home',
        duration: 60,
        price: 1200,
        type: ServiceType.HOME_VISIT,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        name: 'Video Consultation',
        description: 'Remote consultation via video call',
        duration: 30,
        price: 800,
        type: ServiceType.VIDEO_CONSULT,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
];

class ServiceService {

    // GET /api/services
    async getServices(params?: {
        doctorId?: string;
        isActive?: boolean;
        type?: ServiceType;
        search?: string;
        // mockServices?: Service[];
    }): Promise<Service[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let services = mockStorage.getServices();

        // Backend Logic: Filtering
        if (params?.doctorId) {
            services = services.filter(s => s.doctorId === params.doctorId || !s.doctorId);
        }

        if (params?.isActive !== undefined) {
            services = services.filter(s => s.isActive === params.isActive);
        }

        if (params?.type) {
            services = services.filter(service =>
                service.type === params.type
            );
        }

        if (params?.search) {
            const searchTerm = params.search.toLowerCase();
            services = services.filter(service =>
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm)
            );
        }

        return services;
    }

    // GET /api/services/:id
    async getServiceById(id: string): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 200));

        const services = mockStorage.getServices();
        const service = services.find(s => s.id === id);
        if (!service) throw new Error('Service not found');

        return service;
    }
    
    // POST /api/services
    async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const services = mockStorage.getServices();
        const newService: Service = {
            ...service,
            id: services.length + 1 + '', // Simple ID generation
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        services.unshift(newService);
        mockStorage.saveServices(services);
        return newService;
    }

    // PUT /api/services/:id
    async updateService(id: string, updates: Partial<Service>): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const services = mockStorage.getServices();
        const index = services.findIndex(service => service.id === id);
        if (index === -1) throw new Error('Service not found');

        services[index] = {
            ...services[index],
            ...updates,
            updatedAt: new Date(),
        };

        return services[index];
    }

    // DELETE /api/services/:id
    async deleteService(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const services = mockStorage.getServices().filter(s => s.id !== id);
        mockStorage.saveServices(services);
    }

    // PATCH /api/services/:id/toggle-status
    async toggleServiceStatus(id: string, _mockServices: Service[]): Promise<Service> {
        // Fetches fresh from storage to ensure consistency
        const services = mockStorage.getServices();
        const index = services.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Service not found');

        services[index].isActive = !services[index].isActive;
        services[index].updatedAt = new Date();
        mockStorage.saveServices(services);
        
        return services[index];
    }

    async bulkUpdateStatus(ids: string[], isActive: boolean, mockServices: Service[]): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));

        ids.forEach(id => {
            const index = mockServices.findIndex(service => service.id === id);
            if (index !== -1) {
                mockServices[index] = {
                    ...mockServices[index],
                    isActive,
                    updatedAt: new Date(),
                };
            }
        });
    }

    // GET /api/services/stats
    async getServiceStats(doctorId?: string) {
        const services = await this.getServices({ doctorId });

        return {
            total: services.length,
            active: services.filter(s => s.isActive).length,
            inactive: services.filter(s => !s.isActive).length,
            byType: {
                [ServiceType.CLINIC_VISIT]: services.filter(s => s.type === ServiceType.CLINIC_VISIT).length,
                [ServiceType.HOME_VISIT]: services.filter(s => s.type === ServiceType.HOME_VISIT).length,
                [ServiceType.VIDEO_CONSULT]: services.filter(s => s.type === ServiceType.VIDEO_CONSULT).length,
            },
            averagePrice: services.length > 0
                ? services.reduce((sum, s) => sum + s.price, 0) / services.length
                : 0,
            averageDuration: services.length > 0
                ? services.reduce((sum, s) => sum + s.duration, 0) / services.length
                : 0,
        };
    }
}

export const serviceService = new ServiceService();