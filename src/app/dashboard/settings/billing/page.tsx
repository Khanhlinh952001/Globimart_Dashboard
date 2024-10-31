import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LayoutWithSidebar from '../LayoutWithSidebar';

// Giả lập dữ liệu
const currentPlan = {
  name: 'Pro Plan',
  price: '$19.99/month',
  nextBillingDate: '2023-05-01',
};

const billingHistory = [
  { date: '2023-04-01', amount: '$19.99', status: 'Paid' },
  { date: '2023-03-01', amount: '$19.99', status: 'Paid' },
  { date: '2023-02-01', amount: '$19.99', status: 'Paid' },
];

export default function BillingSettings() {
  return (
    <LayoutWithSidebar>
      <Box >
        <Typography variant="h4" gutterBottom>
          Billing & Plans
        </Typography>

        <Grid container spacing={3} sx={{mt:4}}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Plan
              </Typography>
              <Typography variant="body1">
                {currentPlan.name} - {currentPlan.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next billing date: {currentPlan.nextBillingDate}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary">
                  Upgrade Plan
                </Button>
                <Button variant="outlined" color="secondary" sx={{ ml: 2 }}>
                  Cancel Subscription
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Typography variant="body1">
                Visa ending in 1234
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Update Payment Method
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Billing History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistory.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button size="small">Download Invoice</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </LayoutWithSidebar>
  );
}
