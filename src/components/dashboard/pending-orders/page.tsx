import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function PendingOrdersPage() {
    // Sample data for demonstration
    const orders = [
        { id: 1, customerName: 'John Doe' },
        { id: 2, customerName: 'Jane Smith' },
        { id: 3, customerName: 'Alice Johnson' },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Pending Orders
            </Typography>
            <List>
                {orders.map(order => (
                    <ListItem key={order.id}>
                        <ListItemText primary={`Order #${order.id}`} secondary={order.customerName} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default PendingOrdersPage;
