"use client"
import React from 'react';
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
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { type ProductPull } from '@/types/products';
import useProduct from '@/hooks/use-product';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductsList(): React.JSX.Element {
  const {
    products,
    loading,
    deleting,
    handleEdit,
    handleDelete,
    handleAddToFlashSales,
    formatDate,
    shortenId,
  } = useProduct();
console.log(products)
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" translate="no">
      <Typography variant="h4" component="h1" gutterBottom>
      Danh sách sản phẩm {products.length}
      </Typography>

      {products.length === 0 ? (
        <Typography>No products available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Added Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product: ProductPull) => (
                <TableRow key={product.id}>
                  <TableCell title={product.id}>{shortenId(product.id)}</TableCell>
                  <TableCell 
                    title={product.productName}
                    sx={{
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {product.productName}
                  </TableCell>
                  <TableCell>{product.sizes.join(', ') || 'Free Size'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.colors?.length > 0 ? (
                        product.colors.map((color, index) => (
                          <Box
                            key={index}
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
                  <TableCell>${product.sales}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '8px',
                            borderRadius: '10px',
                            padding: '4px',
                          }}
                        />
                      ) : null}
                      <Typography variant="body2">
                        {product.images.length} {product.images.length === 1 ? 'image' : 'images'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <a href={product.detailPage} target="_blank" rel="noopener noreferrer">
                        <IconButton aria-label="view" size='small' style={{ padding: 1 }}>
                          <VisibilityIcon fontSize="inherit" />
                        </IconButton>
                      </a>
                      <IconButton
                        aria-label="edit"
                        size='small'
                        style={{ padding: 2 }}
                        onClick={() => handleEdit(product.id)}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size='small'
                        style={{ padding: 2 }}
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="add to flash sales"
                        size='small'
                        onClick={() => handleAddToFlashSales(product)}
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {deleting && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
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

export default ProductsList;
