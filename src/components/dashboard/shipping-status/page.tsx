import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Dữ liệu demo
const shippingData = [
  { id: 1, orderNumber: '12345', status: 'Shipped', date: '2023-10-01' },
  { id: 2, orderNumber: '67890', status: 'In Transit', date: '2023-10-02' },
  { id: 3, orderNumber: '54321', status: 'Delivered', date: '2023-10-03' },
];

function ShippingStatusPage():React.JSX.Element {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Shipping Status
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.orderNumber}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ShippingStatusPage;
