"use client";
import { useEffect, useState } from 'react';
import * as React from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import Container from '@mui/material/Container';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import type { ProductPull } from '@/types/products';
import { useUser } from '@/hooks/use-user';
import { fireStore } from "@/lib/firebase";

function Page(): React.JSX.Element {
  const { user } = useUser();
  const [flashSales, setFlashSales] = useState<ProductPull[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      if (user?.id) {
        setLoading(true);
        try {
          const productsRef = collection(fireStore, 'flashSales');
          const q = query(productsRef, where('storeId', '==', user.id));
          const querySnapshot = await getDocs(q);
          const fetchedProducts: ProductPull[] = [];
          querySnapshot.forEach((snapshot) => {
            fetchedProducts.push({ id: snapshot.id, ...snapshot.data() } as ProductPull);
          });
          setFlashSales(fetchedProducts);
        } catch (error) {
          // Use a logging service or error boundary in production
          // console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    void fetchProducts(); // Fix: Mark the promise as ignored
  }, [user]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(fireStore, 'flashSales', id));
      setFlashSales(flashSales.filter(sale => sale.id !== id));
      toast.success('Flash sale deleted successfully!');
      setOpenDeleteDialog(false);
    } catch (error) {
      // Use a logging service or error boundary in production
      // console.error('Error deleting flash sale:', error);
      toast.error('Error deleting flash sale.');
    }
  };

  const shortenId = (id: string): string => {
    return `${id.slice(0, 6)}...`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const openDeleteDialogHandler = (id: string): void => {
    setSelectedSaleId(id);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialogHandler = (): void => {
    setOpenDeleteDialog(false);
    setSelectedSaleId(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách Sản phẩm Sales {flashSales.length}
      </Typography>
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
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : flashSales.length === 0 ? (
        <Typography>No flash sales available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Màu sắc</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Ngày thêm</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flashSales.map((flashSale, index) => (
                <TableRow key={flashSale.id || `flash-sale-${index}`}>
                  <TableCell title={flashSale.id}>{shortenId(flashSale.id)}</TableCell>
                  <TableCell>{flashSale.productName}</TableCell>
                  <TableCell>{flashSale.sizes.join(', ') || 'Free Size'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {flashSale.colors?.length > 0 ? (
                        flashSale.colors.map((color) => (
                          <Box
                            key={`${flashSale.id}-color-${color}`}
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: color.toLowerCase(),
                              marginRight: 1,
                            }}
                          />
                        ))
                      ) : (
                        'No colors'
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>${flashSale.sales}</TableCell>
                  <TableCell>{flashSale.category}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {flashSale.images?.length && flashSale.images[0] ? <img
                          src={flashSale.images[0]}
                          alt={flashSale.images[0]}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '8px', borderRadius: '10px', padding: '4px' }}
                        /> : null}
                      <Typography variant="body2">
                        {flashSale.images?.length ?? 0} {(flashSale.images?.length ?? 0) === 1 ? 'image' : 'images'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{flashSale.stock ?? 'N/A'}</TableCell>
                  <TableCell>{formatDate(flashSale.createdAt)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <IconButton aria-label="delete" size="small" style={{ padding: 2 }} onClick={() => { openDeleteDialogHandler(flashSale.id); }}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDeleteDialog} onClose={closeDeleteDialogHandler}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flash sale?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialogHandler} color="primary">
           Cancel
          </Button>
          <Button onClick={() => {
            if (selectedSaleId) {
              void handleDelete(selectedSaleId);
            }
          }} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Page;
