import { Invoice } from '@/types/booking';
import {
    CloudDownload as DownloadIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    Chip,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { useAppSelector } from '../../store/store';



const PatientBilling: React.FC = () => {
    const theme = useTheme();
    const { user } = useAppSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await patientService.getInvoices(user?.id || '1');
            setInvoices(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (id: string) => {
        alert(`Downloading Invoice ${id}...`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'OVERDUE': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Billing & Invoices
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your payments and download invoices.
                    </Typography>
                </Box>
                <Card sx={{ p: 2, bgcolor: 'primary.main', color: 'white', minWidth: 200 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Outstanding</Typography>
                    <Typography variant="h4" fontWeight="bold">
                        ${invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0)}
                    </Typography>
                </Card>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell>Invoice Details</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Loading...</TableCell>
                            </TableRow>
                        ) : invoices.map((invoice) => (
                            <TableRow key={invoice.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <ReceiptIcon color="action" />
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {invoice.invoiceNumber}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {invoice.paymentMethod}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{invoice.service}</TableCell>
                                <TableCell>{format(new Date(invoice.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                    <Typography fontWeight="bold">${invoice.amount}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={invoice.status}
                                        size="small"
                                        color={getStatusColor(invoice.status) as any}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        startIcon={<DownloadIcon />}
                                        size="small"
                                        onClick={() => handleDownload(invoice.id)}
                                    >
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PatientBilling;