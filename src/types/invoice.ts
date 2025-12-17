export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    ISSUED = 'ISSUED',
    PAID = 'PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'DEBIT/CREDIT CARD', // Combined for display
    UPI = 'UPI',
    NET_BANKING = 'NET BANKING',
    INSURANCE = 'INSURANCE'
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    status: InvoiceStatus;
    
    appointmentId?: string;
    patientId: string;
    doctorId: string;

    patientDetails: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
    clinicDetails: {
        name: string;
        address: string;
        phone: string;
        email: string;
        taxId?: string;
        logoUrl?: string;
    };

    items: InvoiceItem[];
    subtotal: number;
    taxTotal: number;
    discount: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    
    currency: string;
    notes?: string;
    terms?: string;
    
    // Track the payment history
    paymentHistory: {
        id: string;
        date: Date;
        amount: number;
        method: PaymentMethod;
        transactionId?: string; // For Razorpay/Stripe ID
    }[];
}