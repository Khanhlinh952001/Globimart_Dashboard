'use client'; // Ensure this is at the very top

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Autocomplete,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import dynamic from 'next/dynamic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import generateRandomString from '@/utils/generateRandomString';
import { toast, ToastContainer } from 'react-toastify';
import { fireStore } from '@/lib/firebase';
import { useUser } from '@/hooks/use-user';
import { colorOptions, sizeOptions, CreateProductType } from '@/types/products';
import HTMLDescription from '@/components/dashboard/products/create/html';
import 'react-toastify/dist/ReactToastify.css';
import { modules, formats } from './modules';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Initial product state
const initialProductState: CreateProductType = {
  productName: '',
  price: 0,
  introducing: '',
  category: '',
  stock: 0,
  sku: '',
  sizes: [],
  colors: [],
  images: [],
  sales: 0,
  id: '',
  storeId: '',
  storeName: '',
  createdAt: '',
  updatedAt: '',
  description: '',
  rating: 5,      // Added default rating
  reviews: 100,   // Added default reviews
};

export default function CreateProduct(): React.JSX.Element {
  const [productState, setProductState] = useState<CreateProductType>(initialProductState);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      productState.images.forEach((img) => {
        if (img.preview && typeof img.preview === 'string') {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [productState.images]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    if (!user?.id) {
      toast.error('User ID not available. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      toast.info('Creating product...', { autoClose: false, toastId: 'creatingProduct' });

      const newProductId = generateRandomString();
      const storage = getStorage();

      // Upload images and get URLs
      const imageUrls = await Promise.all(
        productState.images.map(async (img) => {
          if (img.file) {
            const imageRef = ref(storage, `products/${newProductId}/${uuidv4()}_${img.file.name}`);
            await uploadBytes(imageRef, img.file);
            return await getDownloadURL(imageRef);
          }
          return null;
        })
      ).then((urls) => urls.filter((url) => url !== null) as string[]);

      const productData = {
        ...productState,
        id: newProductId,
        storeName: user.storeName,
        storeId: user.id,
        rating: productState.rating,   // Ensure rating is included
        reviews: productState.reviews, // Ensure reviews are included
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: imageUrls,
      };

      // Remove any potential circular references and ensure serializability
      const cleanedProductData = JSON.parse(JSON.stringify(productData)) as CreateProductType;

      await setDoc(doc(fireStore, 'products', newProductId), cleanedProductData);
      toast.dismiss('creatingProduct');
      toast.success('Product added successfully!');
      setProductState(initialProductState);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.dismiss('creatingProduct');
      toast.error('Error adding product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setProductState((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number): void => {
    const imageToRemove = productState.images[index];

    // Revoke the object URL to free memory
    if (imageToRemove.preview && typeof imageToRemove.preview === 'string') {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setProductState((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>
        Tạo sản phẩm mới
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Product Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Provide basic information about the product.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      {/* Product Name */}
                      <TextField
                        fullWidth
                        label="Product Name"
                        margin="normal"
                        name="productName"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, productName: e.target.value }));
                        }}
                        value={productState.productName}
                        variant="outlined"
                        required
                      />

                      {/* SKU */}
                      <TextField
                        fullWidth
                        label="SKU"
                        margin="normal"
                        name="sku"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, sku: e.target.value }));
                        }}
                        value={productState.sku}
                        variant="outlined"
                        required
                      />

                      {/* Product Description */}
                      <TextField
                        fullWidth
                        label="Product Description"
                        margin="normal"
                        name="description"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, description: e.target.value }));
                        }}
                        value={productState.description}
                        variant="outlined"
                        required
                      />

                      {/* Product Introduction */}
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Product Introduction
                      </Typography>
                      <ReactQuill
                        theme="snow"
                        value={productState.introducing}
                        onChange={(value) => {
                          setProductState((prev) => ({ ...prev, introducing: value }));
                        }}
                        modules={modules}
                        formats={formats}
                        style={{ height: '200px', marginBottom: '50px', borderRadius: '10px' }}
                      />

                      {/* Product Category */}
                      <FormControl fullWidth margin="normal" sx={{ mt: 6, mb: 2 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          value={productState.category}
                          label="Category"
                          onChange={(e) => {
                            setProductState((prev) => ({ ...prev, category: e.target.value }));
                          }}
                          required
                        >
                          <MenuItem value="clothing">Clothing</MenuItem>
                          <MenuItem value="electronics">Electronics</MenuItem>
                          <MenuItem value="books">Books</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Product Price */}
                      <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        name="price"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, price: Number(e.target.value) }));
                        }}
                        value={productState.price}
                        variant="outlined"
                        required
                      />

                      {/* Sales Price */}
                      <TextField
                        fullWidth
                        label="Sales Price"
                        margin="normal"
                        name="salesPrice"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, sales: Number(e.target.value) }));
                        }}
                        value={productState.sales}
                        variant="outlined"
                        required
                      />

                      {/* Stock */}
                      <TextField
                        fullWidth
                        label="Stock"
                        margin="normal"
                        name="stock"
                        type="number"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductState((prev) => ({ ...prev, stock: Number(e.target.value) }));
                        }}
                        value={productState.stock}
                        variant="outlined"
                        required
                      />

                      {/* Product Sizes */}
                      <Autocomplete
                        multiple
                        id="sizes"
                        options={sizeOptions}
                        freeSolo
                        renderTags={(value: string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Select Sizes"
                            placeholder="Add sizes"
                          />
                        )}
                        value={productState.sizes}
                        onChange={(_, newValue: string[]) => {
                          setProductState((prev) => ({ ...prev, sizes: newValue }));
                        }}
                        sx={{ mt: 2, mb: 2 }}
                      />

                      {/* Product Colors */}
                      <Autocomplete
                        multiple
                        id="colors"
                        options={colorOptions}
                        freeSolo
                        renderTags={(value: string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Colors"
                            placeholder="Add colors"
                          />
                        )}
                        value={productState.colors}
                        onChange={(_, newValue: string[]) => {
                          setProductState((prev) => ({ ...prev, colors: newValue }));
                        }}
                        sx={{ mt: 2, mb: 2 }}
                      />

                      {/* Add Images */}
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <input
                          accept="image/*"
                          id="contained-button-file"
                          multiple
                          type="file"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<AddPhotoAlternateIcon />}
                          >
                            Add Images
                          </Button>
                        </label>
                      </Box>

                      {/* Display Selected Images */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {productState.images.map((image, index) => (
                          <Box key={uuidv4()} sx={{ position: 'relative' }}>
                            <img
                              src={image.preview}
                              alt={`Product ${index + 1}`}
                              width={100}
                              height={100}
                              style={{ objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                              onClick={() => removeImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    !productState.productName ||
                    !productState.price ||
                    !productState.category ||
                    isLoading
                  }
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Creating...' : 'Create Product'}
                </Button>
              </Box>
            </form>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Overview
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2,
                    }}
                  >
                    {productState.images.length > 0 ? (
                      <img
                        src={productState.images[0].preview}
                        alt={productState.productName}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <Typography variant="subtitle1">No Image</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6">{productState.productName || 'Product Name'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      in {productState.category || 'Category'}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                      ${productState.sales}
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                      ${productState.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Description"
                      secondary={
                        <HTMLDescription html={productState.description || 'No description available'} />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Stock" secondary={productState.stock} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sizes"
                      secondary={
                        productState.sizes.length > 0
                          ? productState.sizes.join(', ')
                          : 'No sizes specified'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Colors"
                      secondary={
                        productState.colors.length > 0
                          ? productState.colors.join(', ')
                          : 'No colors specified'
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Box>
  );
}
