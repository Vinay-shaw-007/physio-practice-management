import {
    Description as InvoiceIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    Grid,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import InvoiceDocument from '../../components/billing/InvoiceDocument';
import { invoiceService } from '../../services/invoiceService';
import { useAppSelector } from '../../store/store';
import { Invoice, InvoiceStatus } from '../../types/invoice';

const PatientBilling: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // For Demo: Generate a fake invoice if none exists
            // In real app, this happens after appointment completion
            let data = await invoiceService.getAllInvoices(user.id);
            if (data.length === 0) {
                // Create a dummy one for visualization
                // const dummy = await invoiceService.generateFromAppointment({
                //     id: '1',
                //     patientId: user.id,
                //     doctorId: '1',
                //     amount: 1500,
                //     date: new Date(),
                //     // ... other appointment fields
                // } as any);
                // data = [dummy];
            }
            setInvoices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.PAID: return 'success';
            case InvoiceStatus.OVERDUE: return 'error';
            case InvoiceStatus.ISSUED: return 'primary';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Billing & Invoices
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : invoices.length === 0 ? (
                <Alert severity="info">No invoices found. Invoices are generated after appointment completion.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {invoices.map((invoice) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={invoice.id}>
                            <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 } }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InvoiceIcon color="primary" />
                                            <Typography variant="h6" fontWeight="bold">
                                                {invoice.invoiceNumber}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={invoice.status}
                                            color={getStatusColor(invoice.status)}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Date: {format(new Date(invoice.date), 'MMM d, yyyy')}
                                    </Typography>

                                    <Box sx={{ my: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: invoice.currency }).format(invoice.totalAmount)}
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<ViewIcon />}
                                        onClick={() => setSelectedInvoice(invoice)}
                                    >
                                        View Invoice
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Invoice Viewer Modal */}
            <Dialog
                open={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                maxWidth="md"
                fullWidth
            >
                <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
                    {selectedInvoice && <InvoiceDocument invoice={selectedInvoice} />}
                </Box>
            </Dialog>
        </Container>
    );
};

export default PatientBilling;