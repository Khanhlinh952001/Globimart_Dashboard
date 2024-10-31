// "use client"
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box, Button, Chip, TextField, Grid, Link, Avatar, Card, CardHeader, CardContent, Divider, Stack, IconButton } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import { Order, TrackingInfo } from '@/types/order';
// import { Product } from '@/types/products';
// import { format, parseISO, differenceInDays } from 'date-fns';
// import { sampleOrders, sampleProducts, sampleTrackingInfo } from '@/types';
// import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { ChipProps } from '@mui/material';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import HomeIcon from '@mui/icons-material/Home';
// import { formatDate } from '../../../../utils/fomatDate';
// const useStyles = makeStyles({
//     tableHeader: {
//         backgroundColor: '#f5f5f5',
//     },
//     tableRow: {
//         '&:nth-of-type(odd)': {
//             backgroundColor: '#f9f9f9',
//         },
//     },
//     productImage: {
//         width: '50px',
//         height: '50px',
//         objectFit: 'cover',
//     },
// });

// const OrderDetailPage: React.FC = () => {
//     const { id } = useParams();
//     const [order, setOrder] = useState<Order | null>(null);
//     const classes = useStyles();
//     const router = useRouter();
//     const warehouseAddress = "123 Warehouse St, Seoul, South Korea";
//     const [orderTrackingCode, setOrderTrackingCode] = useState<string>('');
//     const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
//     const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});

//     useEffect(() => {
//         if (id) {
//             const foundOrder = sampleOrders.find(order => order.id === id);
//             if (foundOrder) {
//                 setOrder(foundOrder);
//             } else {
//                 console.error('Order not found');
//             }
//         }
//     }, [id]);

//     const handleProductDetail = (url: string) => {
//         router.push(url);
//     };

//     const handleCopyAddress = () => {
//         navigator.clipboard.writeText(warehouseAddress);
//         alert("Warehouse address copied to clipboard!");
//     };

//     const handleTrackOrder = () => {
//         if (orderTrackingCode === sampleTrackingInfo.code) {
//             setTrackingInfo(sampleTrackingInfo);
//         } else {
//             alert('Invalid tracking code');
//         }
//     };

//     const handleSaveOrderCode = () => {
//         alert(`Order code ${orderTrackingCode} saved!`);
//     };

//     const renderEstimatedDelivery = (estimatedDelivery: string) => {
//         const today = new Date();
//         const deliveryDate = parseISO(estimatedDelivery);
//         const daysUntilDelivery = differenceInDays(deliveryDate, today);

//         let message = '';
//         if (daysUntilDelivery > 0) {
//             message = `Estimated delivery in ${daysUntilDelivery} day${daysUntilDelivery > 1 ? 's' : ''}`;
//         } else if (daysUntilDelivery === 0) {
//             message = 'Estimated delivery is today';
//         } else {
//             message = 'Delivery date has passed';
//         }

//         return (
//             <Box display="flex" alignItems="center" marginTop={1}>
//                 <Typography variant="body1" style={{ marginRight: '10px' }}>
//                     Estimated Delivery: {format(deliveryDate, 'MMMM d, yyyy')}
//                 </Typography>
//                 <Chip label={message} color={daysUntilDelivery >= 0 ? 'primary' : 'error'} />
//             </Box>
//         );
//     };

//     useEffect(() => {
//         if (order && order.products) {
//             order.products.forEach(product => {
//                 const foundProduct = sampleProducts.find(p => p.id === product.id);
//                 if (foundProduct) {
//                     setProductDetails(prev => ({ ...prev, [product.id]: foundProduct }));
//                 }
//             });
//         }
//     }, [order]);

//     const renderTrackingTimeline = (trackingInfo: TrackingInfo) => {
//         return (
//             <Timeline>
//                 {trackingInfo.history.map((event, index) => (
//                     <TimelineItem key={index}>
//                         <TimelineSeparator>
//                             <TimelineDot color={getTimelineDotColor(event.status)}>
//                                 {getTimelineIcon(event.status)}
//                             </TimelineDot>
//                             {index < trackingInfo.history.length - 1 && <TimelineConnector />}
//                         </TimelineSeparator>
//                         <TimelineContent>
//                             <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
//                                 {event.status}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                  {formatDate(event.date) }
//                             </Typography>
//                             <Typography variant="subtitle2">
//                                 {event.location}
//                             </Typography>
//                         </TimelineContent>
//                     </TimelineItem>
//                 ))}
//             </Timeline>
//         );
//     };

//     if (!order) {
//         return (
//             <Container>
//                 <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//                     <CircularProgress />
//                 </Box>
//             </Container>
//         );
//     }

//     return (
//         <Container maxWidth="lg">
//             <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
//                 <Typography variant="h4">
//                     Order: {order.id}
//                 </Typography>
//                 <Button variant="contained">
//                     Action
//                 </Button>
//             </Stack>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                     <Card>
//                         <CardHeader
//                             title="Order Information"
//                             avatar={
//                                 <Avatar>
//                                     {/* Icon for Order Information */}
//                                 </Avatar>
//                             }
//                         />
//                         <CardContent>
//                             <Stack spacing={2}>
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Customer</Typography>
//                                     <Typography variant="subtitle2">{order.customerName}</Typography>
//                                 </Box>
//                                 <Divider />
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Address</Typography>
//                                     <Typography variant="subtitle2">{order.address}</Typography>
//                                 </Box>
//                                 <Divider />
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Date</Typography>
//                                     <Typography variant="subtitle2">{format(new Date(order.orderDate), 'MMMM d, yyyy HH:mm a')}</Typography>
//                                 </Box>
//                                 <Divider />
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Status</Typography>
//                                     <Chip
//                                         label={order.status}
//                                         color={getStatusColor(order.status)}
//                                         size="small"
//                                     />
//                                 </Box>
//                                 <Divider />
//                                 <Box>
//                                     <Typography variant="body2" color="text.secondary">Payment Method</Typography>
//                                     <Stack direction="row" alignItems="center" spacing={2}>
//                                         <Avatar>
//                                             {/* Icon for payment method */}
//                                         </Avatar>
//                                         <Box>
//                                             <Typography variant="subtitle2">{order.paymentMethod.name}</Typography>
//                                             <Typography variant="body2" color="text.secondary">{order.paymentMethod.cardNumber}</Typography>
//                                         </Box>
//                                     </Stack>
//                                 </Box>
//                             </Stack>
//                         </CardContent>
//                     </Card>

//                     <Card sx={{ mt: 3 }}>
//                         <CardHeader title="Checkout Summary" />
//                         <CardContent>
//                             <TableContainer>
//                                 <Table>
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Product</TableCell>
//                                             <TableCell align="right">Color</TableCell>
//                                             <TableCell align="right">Size</TableCell>
//                                             <TableCell align="right">Qty</TableCell>
//                                             <TableCell align="right">Unit Price</TableCell>
//                                             <TableCell align="right">Amount</TableCell>
//                                             <TableCell align="right">Action</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {order.products?.map((product) => {
//                                             const productDetail = productDetails[product.id];
//                                             return (
//                                                 <TableRow key={product.id}>
//                                                     <TableCell>
//                                                         {productDetail ? (
//                                                             <>
//                                                                 <img src={productDetail.image?.toString()} alt={productDetail.productName} style={{ width: 50, height: 50, marginRight: 10 }} />
//                                                                 {productDetail.productName}
//                                                             </>
//                                                         ) : `Product ${product.id}`}
//                                                     </TableCell>
//                                                     <TableCell align="right">{product.color || 'N/A'}</TableCell>
//                                                     <TableCell align="right">{product.size || 'N/A'}</TableCell>
//                                                     <TableCell align="right">{product.quantity}</TableCell>
//                                                     <TableCell align="right">${productDetail ? productDetail.price.toFixed(2) : 'N/A'}</TableCell>
//                                                     <TableCell align="right">${productDetail ? (productDetail.price * product.quantity).toFixed(2) : 'N/A'}</TableCell>
//                                                     <TableCell align="right">
//                                                         <IconButton
//                                                             onClick={() => handleProductDetail(productDetail.detail)}
//                                                             size="small"
//                                                             color="primary"
//                                                         >
//                                                             <ArrowForwardIcon />
//                                                         </IconButton>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                             <Box sx={{ mt: 2 }}>
//                                 <Stack spacing={2}>
//                                     <Box display="flex" justifyContent="space-between">
//                                         <Typography variant="body2">Subtotal</Typography>
//                                         <Typography variant="body2">${order.subtotal.toFixed(2)}</Typography>
//                                     </Box>
//                                     <Box display="flex" justifyContent="space-between">
//                                         <Typography variant="body2">Discount</Typography>
//                                         <Typography variant="body2" color="error">-${order.discount.toFixed(2)}</Typography>
//                                     </Box>
//                                     <Box display="flex" justifyContent="space-between">
//                                         <Typography variant="body2">Shipping</Typography>
//                                         <Typography variant="body2">${order.shipping.toFixed(2)}</Typography>
//                                     </Box>
//                                     <Box display="flex" justifyContent="space-between">
//                                         <Typography variant="body2">Taxes</Typography>
//                                         <Typography variant="body2">${order.taxes.toFixed(2)}</Typography>
//                                     </Box>
//                                     <Box display="flex" justifyContent="space-between">
//                                         <Typography variant="subtitle1">Total</Typography>
//                                         <Typography variant="subtitle1">${order.amount.toFixed(2)}</Typography>
//                                     </Box>
//                                 </Stack>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card sx={{ mb: 3 }}>
//                         <CardHeader
//                             title="Main Warehouse"
//                             avatar={
//                                 <Avatar>
//                                     <InventoryIcon />
//                                 </Avatar>
//                             }
//                         />
//                         <CardContent>
//                             <Typography variant="body1" gutterBottom>{warehouseAddress}</Typography>
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<ContentCopyIcon />}
//                                 onClick={handleCopyAddress}
//                             >
//                                 Copy Address
//                             </Button>
//                         </CardContent>
//                     </Card>

//                     <Card sx={{ mb: 3 }}>
//                         <CardHeader
//                             title="Track Order"
//                             avatar={
//                                 <Avatar>
//                                     <LocalShippingIcon />
//                                 </Avatar>
//                             }
//                         />
//                         <CardContent>
//                             <Box display="flex" alignItems="center" mb={2}>
//                                 <TextField
//                                     value={orderTrackingCode}
//                                     onChange={(e) => setOrderTrackingCode(e.target.value)}
//                                     placeholder="Enter tracking code"
//                                     variant="outlined"
//                                     size="small"
//                                     fullWidth
//                                     sx={{ mr: 1 }}
//                                 />
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleTrackOrder}
//                                     sx={{ mr: 1 }}
//                                 >
//                                     Track
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="secondary"
//                                     onClick={handleSaveOrderCode}
//                                 >
//                                     Save
//                                 </Button>
//                             </Box>
//                             {trackingInfo && (
//                                 <Box mt={2}>
//                                     <Typography variant="h6" gutterBottom>Tracking Information</Typography>
//                                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                                         <Typography variant="body1">Status:</Typography>
//                                         <Chip label={trackingInfo.status} color={getChipColor(trackingInfo.status)} />
//                                     </Box>
//                                     {renderEstimatedDelivery(trackingInfo.estimatedDelivery)}
//                                     <Typography variant="body2" color="text.secondary" mt={1}>
//                                         Current Location: {trackingInfo.currentLocation}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Last Updated: {trackingInfo.lastUpdated}
//                                     </Typography>
//                                 </Box>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {trackingInfo && (
//                         <Card>
//                             <CardHeader
//                                 title="Tracking Timeline"
//                                 avatar={
//                                     <Avatar>
//                                         <InventoryIcon />
//                                     </Avatar>
//                                 }
//                             />
//                                 {renderTrackingTimeline(trackingInfo)}
//                         </Card>
//                     )}
//                 </Grid>
//             </Grid>


//         </Container>
//     );
// };

// const getChipColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
//     switch (status) {
//         case 'In Transit':
//             return 'info';
//         case 'Delivered':
//             return 'success';
//         case 'Pending':
//             return 'warning';
//         case 'Cancelled':
//             return 'error';
//         default:
//             return 'default';
//     }
// };

// const getTimelineDotColor = (status: string): "inherit" | "grey" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
//     switch (status.toLowerCase()) {
//         case 'order placed':
//         case 'processing':
//             return 'secondary';
//         case 'shipped':
//         case 'in transit':
//             return 'primary';
//         case 'out for delivery':
//             return 'info';
//         case 'delivered':
//         case 'completed':
//             return 'success';
//         default:
//             return 'grey';
//     }
// };

// const getTimelineIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//         case 'order placed':
//             return <StorefrontIcon />;
//         case 'processing':
//             return <InventoryIcon />;
//         case 'shipped':
//             return <LocalShippingIcon />;
//         case 'in transit':
//             return <FlightTakeoffIcon />;
//         case 'out for delivery':
//             return <LocalShippingIcon />;
//         case 'delivered':
//             return <HomeIcon />;
//         case 'completed':
//             return <CheckCircleIcon />;
//         default:
//             return <InventoryIcon />;
//     }
// };

// const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
//     switch (status.toLowerCase()) {
//         case 'completed':
//         case 'delivered':
//         case 'successful':
//             return 'success';
//         case 'processing':
//         case 'in transit':
//             return 'info';
//         case 'pending':
//             return 'warning';
//         case 'cancelled':
//         case 'failed':
//             return 'error';
//         default:
//             return 'default';
//     }
// };

// export default OrderDetailPage;
import * as React from 'react';

function Page (): React.JSX.Element {
  return ( <div /> );
}

export default Page;
