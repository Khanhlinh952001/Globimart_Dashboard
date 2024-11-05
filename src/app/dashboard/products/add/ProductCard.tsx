import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Box } from '@mui/material';
import { setDoc, doc } from 'firebase/firestore'; // Import getFirestore and collection
import {  toast } from 'react-toastify'; // Import ToastContainer and toast
import { v4 as uuidv4 } from 'uuid';
import type { AddProductType } from '@/types/products';
import { useUser } from '@/hooks/use-user';
import { fireStore } from '@/lib/firebase';
import generateRandomString from '@/utils/generateRandomString';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

interface ProductCardProps {
  product: {
    ProductCode: string[];
    ProductName: string[];
    ProductPrice: string[];
    ProductImage300: string[];
    DetailPageUrl: string[];
    SalePrice: string[];
    ReviewCount: string[];
    // Add other fields as necessary
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [message, setMessage] = useState<string>(''); // Specify type for message
  const [products, setProduct] = useState<AddProductType | null>(null); // Initialize product state
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const logProductDetails = () => {
    const productDetails = {

    };
    console.log(productDetails); // Log the product details
  };

  const handleAddProduct = async () => { // Make the function async
    setLoading(true); // Set loading to true
    const newProductId = generateRandomString();
    logProductDetails(); // Log product details
    if (user) {
      const newProduct = { // Create a new product object
        id: newProductId,
        storeId: user.id,
        storeName: user.storeName || '',
        productName: product.ProductName[0],
        category: user.productCategory || '',
        sku:product.ProductCode[0],
        price: parseFloat(product.ProductPrice[0]) || 0,
        sales: parseFloat(product.SalePrice[0]) || 0,
        detailPage: product.DetailPageUrl[0] || '',
        stock: 100,
        sizes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: '',
        images: product.ProductImage300, // Change from [product.ProductImage300] to product.ProductImage300
        colors: []
      };
      try {
        // Corrected Firestore document reference
        await setDoc(doc(fireStore, 'products', newProductId), newProduct); // Add product to Firestore
        setProduct(newProduct); // Set the product state
        toast.success(`Đã thêm sản phẩm: ${product.ProductName[0]}`); // Show success toast
      } catch (error) {
        console.error("Error adding product: ", error); // Log any errors
        toast.error("Lỗi khi thêm sản phẩm!"); // Show error toast
      } finally {
        setLoading(false); // Set loading to false after operation
      }
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}> {/* Responsive grid item */}
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
          <CardMedia
            component="img"
            height="200"
            image={product.ProductImage300[0]} // Display the first image
            alt={product.ProductName[0]}
            sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }} // Bo tròn góc
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{product.ProductName[0]}</Typography>
            <Typography variant="body2" color="text.secondary">
              Price: <span style={{ fontWeight: 'bold' }}>{product.ProductPrice[0]} </span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sale Price: <span style={{ color: 'red', fontWeight: 'bold' }}>{product.SalePrice[0]} </span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews: {product.ReviewCount[0]}
            </Typography>
          </CardContent>
          <Box display="flex" justifyContent="space-between" sx={{ padding: 1 }}>
            <Button size="small" href={product.DetailPageUrl[0]} target="_blank" variant="contained" color="primary">
              View Details
            </Button>
            <Button size="small" variant="contained" color="secondary" onClick={handleAddProduct} disabled={loading}>
              {loading ? 'Loading...' : 'Add Product'} {/* Show loading text */}
            </Button>
          </Box>
        </Card>
        {message ? <Typography variant="body2" color="success.main">{message}</Typography> : null} {/* Display message */}
      </Grid>
  );
};

export default ProductCard;
