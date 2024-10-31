"use client";

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AccountCircle, Delete, PhoneAndroid, Business } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { fireStore } from '@/lib/firebase';
import { useUser } from '@/hooks/use-user';
import LayoutWithSidebar from '../LayoutWithSidebar';

const AccountSettings: React.FC = () => {
  const { user } = useUser(); // Lấy dữ liệu người dùng từ hook tùy chỉnh
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    productCategory: '',
    role: '',
    description: '',
    storeName: '',
    businessName: '',
    bankName: '',
    bankNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        productCategory: user.productCategory || '',
        role: user.role || '',
        description: user.description || '',
        storeName: user.storeName || '',
        businessName: user.businessName || '',
        bankName: user.bankName || '',
        bankNumber: user.bankNumber || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpdateInfo = async (infoType: 'user' | 'business') => {
    try {
      if (!user?.id) {
        toast.error('Không tìm thấy thông tin người dùng!');
        return;
      }

      const dataToUpdate = infoType === 'user'
        ? {
            email: formData.email,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            productCategory: formData.productCategory,
            role: formData.role,
            description: formData.description,
            storeName: formData.storeName,
          }
        : {
            businessName: formData.businessName,
            bankName: formData.bankName,
            bankNumber: formData.bankNumber,
          };

      await updateDoc(doc(fireStore, 'Shops', user.id), dataToUpdate);

      toast.success(
        infoType === 'user'
          ? 'Cập nhật thông tin người dùng thành công!'
          : 'Cập nhật thông tin doanh nghiệp thành công!'
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật tài liệu: ", error);
      toast.error(
        infoType === 'user'
          ? 'Cập nhật thông tin người dùng thất bại. Vui lòng thử lại!'
          : 'Cập nhật thông tin doanh nghiệp thất bại. Vui lòng thử lại!'
      );
    }
  };

  return (
    <LayoutWithSidebar>
      <Stack spacing={3}>
        {/* Thông tin người dùng */}
        <Card>
          <CardHeader title="Thông tin người dùng" />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Tên cửa hàng"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Tên"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Họ"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Danh mục sản phẩm"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Vai trò"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <Button variant="contained" onClick={() => handleUpdateInfo('user')}>
                Cập nhật
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Thông tin doanh nghiệp */}
        <Card>
          <CardHeader
            avatar={<Avatar><Business /></Avatar>}
            title="Thông tin doanh nghiệp"
          />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Tên doanh nghiệp"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Tên ngân hàng"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Số tài khoản"
                name="bankNumber"
                value={formData.bankNumber}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <Button variant="contained" onClick={() => handleUpdateInfo('business')}>
                Cập nhật
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Phần xóa tài khoản */}
        <Card>
          <CardHeader
            avatar={<Avatar><Delete /></Avatar>}
            title="Xóa tài khoản"
          />
          <CardContent>
            <Typography variant="subtitle1">Xóa tài khoản của bạn và tất cả dữ liệu nguồn của bạn. Điều này là không thể đảo ngược.</Typography>
            <Button variant="outlined" color="error">Xóa tài khoản</Button>
          </CardContent>
        </Card>
      </Stack>
    </LayoutWithSidebar>
  );
};

export default AccountSettings;
