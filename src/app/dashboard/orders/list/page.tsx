"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  IconButton,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOrders } from '@/hooks/use-orders';

function OrdersList(): React.JSX.Element {
  const router = useRouter();

  const { orders, loading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');
console.log(orders)


  const filteredOrders = orders.filter(order => {
    if (filterPaid === 'all') return true;
    return filterPaid === 'paid' ? order.pay : !order.pay;
  });

  useEffect(() => {
    if (error) {
      toast.error('Error loading orders');
    }
  }, [error]);

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  const formatDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const shortenId = (id: string) => {
    return `${id.slice(0, 6)}...`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách Đơn hàng ({filteredOrders.length})
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle1">Lọc theo trạng thái thanh toán:</Typography>
        <Button variant={filterPaid === 'all' ? 'contained' : 'outlined'} onClick={() => setFilterPaid('all')}>
          Tất cả
        </Button>
        <Button variant={filterPaid === 'paid' ? 'contained' : 'outlined'} onClick={() => setFilterPaid('paid')}>
          Đã thanh toán
        </Button>
        <Button variant={filterPaid === 'unpaid' ? 'contained' : 'outlined'} onClick={() => setFilterPaid('unpaid')}>
          Chưa thanh toán
        </Button>
      </Box>

      {filteredOrders.length === 0 ? (
        <Typography>Không có đơn hàng nào.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái thanh toán</TableCell> {/* Thêm cột trạng thái thanh toán */}
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell title={order.id}>{shortenId(order.id.toLocaleUpperCase())}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</TableCell>
                    <TableCell>{order.userInfo.displayName}</TableCell>
                    <TableCell>{formatDate(order.createdAt.seconds)}</TableCell>
                    <TableCell>{order.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}</TableCell> {/* Hiển thị trạng thái thanh toán */}
                    <TableCell>
                      <IconButton
                        aria-label="view details"
                        onClick={() => handleViewDetails(order.id)}
                        disabled={!order.pay}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {selectedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box p={2} bgcolor="background.paper" boxShadow={3} borderRadius={2}>
                          <Typography variant="h6" gutterBottom>Chi tiết đơn hàng:</Typography>
                          <Typography variant="body1">Tổng phụ: <strong>${order.subtotal}</strong></Typography>
                          <Typography variant="body1">Chi phí vận chuyển: <strong>${order.shippingCost}</strong></Typography>
                          <Typography variant="body1">Phương thức vận chuyển: <strong>{order.shippingMethod}</strong></Typography>
                          <Typography variant="body1">Phương thức thanh toán: <strong>{order.paymentMethod}</strong></Typography>

                          <Typography variant="h6" mt={2} gutterBottom>Thông tin khách hàng:</Typography>
                          <Typography variant="body1">Điện thoại: <strong>{order.userInfo.phoneNumber}</strong></Typography>
                          <Typography variant="body1">Địa chỉ: <strong>{`${order.userInfo.address.street}, ${order.userInfo.address.city}, ${order.userInfo.address.state}, ${order.userInfo.address.zipCode}`}</strong></Typography>

                          <Typography variant="h6" mt={2} gutterBottom>Sản phẩm:</Typography>
                          {order.items.map((item) => (
                            <Box key={item.id} mt={1} p={1} border={1} borderColor="grey.300" borderRadius={1}>
                              <Typography variant="body2">Số lượng: <strong>{item.quantity}</strong></Typography>
                              <Typography variant="body2">Kích thước: <strong>{item.size}</strong></Typography>
                              <Typography variant="body2">Màu sắc: <strong>{item.color || 'N/A'}</strong></Typography>
                              <Box display="flex" alignItems="center" mt={1}>
                                <img src={item.image} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                <Button variant="contained" color="primary" onClick={() => window.open(item.detailPage, '_blank')}>
                                  Nhập hàng
                                </Button>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
}

export default OrdersList;
