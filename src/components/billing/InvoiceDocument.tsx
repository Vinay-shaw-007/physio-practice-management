import { Print as PrintIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { Invoice, InvoiceStatus } from '../../types/invoice';

interface InvoiceDocumentProps {
    invoice: Invoice;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice }) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: invoice.currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.PAID: return '#10b981';
            case InvoiceStatus.OVERDUE: return '#ef4444';
            default: return '#3b82f6';
        }
    };

    const primaryPayment = invoice.paymentHistory[0];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2, '@media print': { display: 'none' } }}>
                <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
                    Print / Save PDF
                </Button>
            </Box>

            <Paper
                elevation={0} // Removed shadow for cleaner print look
                sx={{
                    p: 4,
                    maxWidth: '800px',
                    mx: 'auto',
                    border: '1px solid #eee', // Light border for screen view
                    '@media print': {
                        border: 'none',
                        p: 0,
                        mx: 0,
                        maxWidth: '100%',
                    }
                }}
            >
                {/* Header - Compact */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Box>
                        {/* Logo Placeholder */}
                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* <img src="/logo.png" style={{ height: 40 }} alt="Logo" /> */}
                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                {invoice.clinicDetails.name}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250, fontSize: '0.9rem' }}>
                            {invoice.clinicDetails.address}<br />
                            {invoice.clinicDetails.phone}<br />
                            {invoice.clinicDetails.email}<br />
                            {invoice.clinicDetails.taxId}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">INVOICE</Typography>
                        <Typography variant="body1" color="text.secondary">#{invoice.invoiceNumber}</Typography>

                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={invoice.status}
                                size="small"
                                sx={{
                                    bgcolor: `${getStatusColor(invoice.status)}15`,
                                    color: getStatusColor(invoice.status),
                                    fontWeight: 'bold',
                                    border: `1px solid ${getStatusColor(invoice.status)}`
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Info Grid - Compact */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">BILLED TO</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{invoice.patientDetails.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                            {invoice.patientDetails.email}<br />
                            {invoice.patientDetails.phone}<br />
                            {invoice.patientDetails.address}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" color="text.secondary">INVOICE DATE</Typography>
                                <Typography variant="body2" fontWeight="medium">{format(new Date(invoice.date), 'dd MMM yyyy')}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" color="text.secondary">PAYMENT MODE</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {primaryPayment?.method || 'N/A'}
                                    {primaryPayment?.transactionId ? ` (${primaryPayment.transactionId})` : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Items Table */}
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 1 }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell><Typography variant="subtitle2" fontWeight="bold">Item Description</Typography></TableCell>
                                <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Qty</Typography></TableCell>
                                <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Price</Typography></TableCell>
                                <TableCell align="right"><Typography variant="subtitle2" fontWeight="bold">Amount</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Typography variant="body2">{item.description}</Typography>
                                    </TableCell>
                                    <TableCell align="right"><Typography variant="body2">{item.quantity}</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="body2">{formatCurrency(item.unitPrice)}</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="body2">{formatCurrency(item.amount)}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Totals Section */}
                <Grid container justifyContent="flex-end">
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body2" fontWeight="medium">{formatCurrency(invoice.subtotal)}</Typography>
                        </Box>
                        {invoice.taxTotal > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Tax (GST)</Typography>
                                <Typography variant="body2" fontWeight="medium">{formatCurrency(invoice.taxTotal)}</Typography>
                            </Box>
                        )}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">{formatCurrency(invoice.totalAmount)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="success.main">Amount Paid</Typography>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                                - {formatCurrency(invoice.amountPaid)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Balance Due</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formatCurrency(invoice.balanceDue)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Footer - Compact */}
                <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #e0e0e0' }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" fontWeight="bold" display="block">Terms & Conditions</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {invoice.terms}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                This is a computer generated invoice and does not require a physical signature.
                            </Typography>
                            <Typography variant="caption" fontWeight="bold" color="primary.main">
                                www.physiopro-clinic.com
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default InvoiceDocument;

