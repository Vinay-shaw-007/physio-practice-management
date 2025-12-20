import { Appointment } from '../types';
import { Invoice, InvoiceItem, InvoiceStatus, PaymentMethod } from '../types/invoice';
import { mockStorage } from '../utils/mockStorage';
import { settingsService } from './settingsService';
class InvoiceService {

    async getAllInvoices(patientId?: string): Promise<Invoice[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        let invoices = mockStorage.getInvoices();

        if (patientId) {
            invoices = invoices.filter(inv => inv.patientId === patientId);
        }

        // Sort by date desc
        return invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async getInvoiceById(id: string): Promise<Invoice> {
        const invoice = mockStorage.getInvoices().find(i => i.id === id);
        if (!invoice) throw new Error("Invoice not found");
        return invoice;
    }

    // Auto-generate invoice from a completed appointment
    async generateFromAppointment(appointment: Appointment, paymentMethod: PaymentMethod = PaymentMethod.UPI): Promise<Invoice> {
        const existing = mockStorage.getInvoices().find(i => i.appointmentId === appointment.id);
        if (existing) return existing;

        const patient = mockStorage.getUserById(appointment.patientId);
        const clinicSettings = await settingsService.getInvoiceDetails();

        const item: InvoiceItem = {
            id: Date.now().toString(),
            description: `${appointment.metadata?.serviceName || 'Consultation'}`,
            quantity: 1,
            unitPrice: appointment.amount,
            taxRate: 0,
            amount: appointment.amount
        };

        const taxAmount = item.amount * (item.taxRate / 100);
        const total = item.amount + taxAmount;

        // Since payment is collected at booking, we mark it PAID immediately
        const newInvoice: Invoice = {
            id: `inv_${Date.now()}`,
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            date: new Date(),
            dueDate: new Date(), // Due date is same as issue date since it's already paid
            status: InvoiceStatus.PAID, // <--- Set to PAID
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,

            patientDetails: {
                name: appointment.metadata?.patientName || patient?.name || 'Patient',
                email: patient?.email || '',
                phone: patient?.phone,
                address: patient && 'address' in patient ? (patient as any).address : ''
            },
            clinicDetails: clinicSettings,

            items: [item],
            subtotal: item.amount,
            taxTotal: taxAmount,
            discount: 0,
            totalAmount: total,

            // Mark as fully paid
            amountPaid: total,
            balanceDue: 0,

            currency: 'INR',
            notes: 'Thank you for your business.',
            terms: 'Payment received successfully.', // Updated terms

            paymentHistory: [
                {
                    id: `pay_${Date.now()}`,
                    date: new Date(), // Ideally this is the booking date
                    amount: total,
                    method: paymentMethod, // e.g., UPI, Card
                    transactionId: `TXN${Date.now()}` // Mock Transaction ID
                }
            ]
        };

        mockStorage.saveInvoice(newInvoice);
        return newInvoice;
    }

    async recordPayment(invoiceId: string, amount: number, method: PaymentMethod): Promise<Invoice> {
        const invoice = await this.getInvoiceById(invoiceId);

        const newPaid = invoice.amountPaid + amount;
        const newBalance = invoice.totalAmount - newPaid;

        let newStatus = invoice.status;
        if (newBalance <= 0) newStatus = InvoiceStatus.PAID;
        else if (newPaid > 0) newStatus = InvoiceStatus.PARTIALLY_PAID;

        const updatedInvoice: Invoice = {
            ...invoice,
            amountPaid: newPaid,
            balanceDue: Math.max(0, newBalance),
            status: newStatus,
            paymentHistory: [
                ...invoice.paymentHistory,
                {
                    id: Date.now().toString(),
                    date: new Date(),
                    amount,
                    method
                }
            ]
        };

        mockStorage.saveInvoice(updatedInvoice);
        return updatedInvoice;
    }
}

export const invoiceService = new InvoiceService();