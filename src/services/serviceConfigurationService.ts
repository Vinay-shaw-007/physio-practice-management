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
    
    async getServices(params?: {
        doctorId?: string;
        isActive?: boolean;
        type?: ServiceType;
        search?: string;
        // mockServices?: Service[];
    }): Promise<Service[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let filteredServices = [...(mockServices) || []];

        // Apply filters
        if (params?.doctorId) {
            filteredServices = filteredServices.filter(service =>
                service.doctorId === params.doctorId || !service.doctorId
            );
        }

        if (params?.isActive !== undefined) {
            filteredServices = filteredServices.filter(service =>
                service.isActive === params.isActive
            );
        }

        if (params?.type) {
            filteredServices = filteredServices.filter(service =>
                service.type === params.type
            );
        }

        if (params?.search) {
            const searchTerm = params.search.toLowerCase();
            filteredServices = filteredServices.filter(service =>
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm)
            );
        }

        return filteredServices;
    }

    async getServiceById(id: string): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 200));

        const service = mockServices.find(s => s.id === id);
        if (!service) throw new Error('Service not found');

        return service;
    }

    async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const newService: Service = {
            ...service,
            id: mockServices.length+1 + '', // Simple ID generation
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockServices.unshift(newService);
        return newService;
    }

    async updateService(id: string, updates: Partial<Service>): Promise<Service> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = mockServices.findIndex(service => service.id === id);
        if (index === -1) throw new Error('Service not found');

        mockServices[index] = {
            ...mockServices[index],
            ...updates,
            updatedAt: new Date(),
        };

        return mockServices[index];
    }

    async deleteService(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = mockServices.findIndex(service => service.id === id);
        if (index === -1) throw new Error('Service not found');

        mockServices.splice(index, 1);
    }

    async toggleServiceStatus(id: string, mockServices: Service[]): Promise<Service> {
        const service = mockServices.find(s => s.id === id);
        if (!service) throw new Error('Service not found');

        return this.updateService(id, { isActive: !service.isActive });
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

    // Statistics for dashboard
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