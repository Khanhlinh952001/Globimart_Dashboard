'use client'; // Ensure this is at the very top

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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
  Chip,
  Autocomplete,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Close } from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { fireStore, storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
// New component for rendering HTML content safely
function HTMLDescription({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

interface ImageType {
  file: File | null; // Allow null for images fetched from Firestore
  preview: string;
  url: string;
}

interface Product {
  id: string;
  productName: string;
  sku: string; // Added SKU
  description: string;
  introducing: string;
  category: string;
  price: number;
  features: string[];
  stock: number;
  sales: number;
  rating: number; // Added Rating
  reviews: number; // Added Reviews
  sizes: string[];
  colors: string[];
  images: ImageType[];
  imagePreview: string;
}

export default function ProductEdit({ params }: { params: { id: string } }): React.JSX.Element {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    id: params.id,
    productName: '',
    sku: '', // Initialize SKU
    description: '',
    introducing: '',
    category: '',
    price: 0,
    features: [],
    stock: 0,
    sales: 0,
    rating: 0, // Initialize Rating
    reviews: 0, // Initialize Reviews
    sizes: [],
    colors: [],
    images: [],
    imagePreview: 'https://png.pngtree.com/element_our/20190530/ourlarge/pngtree-flat-photo-icon-download-image_1257070.jpg',
  });
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsDirty(true);
    const { name, value } = event.target;
    setProduct(prev => {
      const newValue = ['price', 'stock', 'rating', 'reviews'].includes(name) ? Number(value) : value;
      
      // Validate sales price cannot be higher than regular price
      if (name === 'sales' && Number(value) > prev.price) {
        toast.error('Sales price cannot be higher than regular price');
        return prev;
      }
      
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating product...");
    try {
      const docRef = doc(fireStore, 'products', params.id);
      await updateDoc(docRef, {
        productName: product.productName,
        sku: product.sku, // Include SKU
        description: product.description,
        introducing: product.introducing,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sizes: product.sizes,
        colors: product.colors,
        sales: product.sales,
        rating: product.rating, // Include Rating
        reviews: product.reviews, // Include Reviews
        features: product.features,
        images: product.images.map(image => image.url), // Save URLs to Firestore
      });
      setIsDirty(false);
      toast.update(toastId, {
        render: "Product updated successfully! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
      // Delay navigation to allow the success message to be seen
      setTimeout(() => {
        router.push('/dashboard/products/list');
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.update(toastId, {
        render: "Error updating product. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
      setLoading(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setLoading(true); // Add loading state
      try {
        const newImages: ImageType[] = [];
        for (const file of Array.from(files)) {
          if (file.size > 5000000) { // 5MB limit
            toast.error(`File ${file.name} is too large. Max size is 5MB`);
            continue;
          }
          const uniqueFileName = `${uuidv4()}_${file.name}`;
          const storageRef = ref(storage, `images/${uniqueFileName}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          newImages.push({ file, preview: URL.createObjectURL(file), url });
        }
        setProduct(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
          imagePreview: newImages[0]?.preview || prev.imagePreview
        }));
        toast.success('Images uploaded successfully');
      } catch (error) {
        toast.error('Error uploading images');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeImage = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    const imageToDelete = product.images[index];
    if (imageToDelete.url) { // Use URL to reference the image in storage
      // Extract the storage path from the URL
      const storagePath = imageToDelete.url.split('.com/')[1];
      const imageRef = ref(storage, storagePath); // Reference using the storage path
      try {
        await deleteObject(imageRef); // Delete the image from storage
        toast.success("Image deleted successfully.");
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error("Failed to delete image.");
        return;
      }
    }
    // Revoke the object URL to free memory
    if (imageToDelete.preview && typeof imageToDelete.preview === 'string') {
      URL.revokeObjectURL(imageToDelete.preview);
    }
    setProduct(prev => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updatedImages,
        imagePreview: updatedImages.length > 0 ? updatedImages[0].preview : 'https://png.pngtree.com/element_our/20190530/ourlarge/pngtree-flat-photo-icon-download-image_1257070.jpg'
      };
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(fireStore, 'products', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(prev => ({
            ...prev,
            productName: data.productName || '',
            sku: data.sku || '', // Fetch SKU from Firestore
            description: data.description || '',
            introducing: data.introducing || '',
            category: data.category || '',
            price: data.price || 0,
            stock: data.stock || 0,
            sizes: data.sizes || [],
            colors: data.colors || [],
            sales: data.sales || 0,
            rating: data.rating || 0, // Fetch Rating from Firestore
            reviews: data.reviews || 0, // Fetch Reviews from Firestore
            features: data.features || [],
            images: data.images ? data.images.map((url: string) => ({ file: null, preview: url, url })) : [],
            imagePreview: data.images && data.images.length > 0 ? data.images[0] : prev.imagePreview,
          }));
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'color', 'background',
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3, pr: 1 }} display="flex">
          Edit Product 
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
                        Edit the information about the product.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      {/* Product Name */}
                      <TextField
                        fullWidth
                        label="Product Name"
                        margin="normal"
                        name="productName"
                        onChange={handleChange}
                        value={product.productName}
                        variant="outlined"
                        required
                      />

                      {/* SKU */}
                      <TextField
                        fullWidth
                        label="SKU"
                        margin="normal"
                        name="sku"
                        onChange={handleChange}
                        value={product.sku}
                        variant="outlined"
                        required
                      />

                      {/* Product Description */}
                      <TextField
                        fullWidth
                        label="Product Description"
                        margin="normal"
                        name="description"
                        onChange={handleChange}
                        value={product.description}
                        variant="outlined"
                        required
                      />

                      {/* Product Introduction */}
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Product Introduction
                      </Typography>
                      <ReactQuill
                        theme="snow"
                        value={product.introducing}
                        onChange={(value) => { setProduct(prev => ({ ...prev, introducing: value })) }}
                        modules={modules}
                        formats={formats}
                        style={{ height: '200px', marginBottom: '50px', borderRadius: '10px' }}
                      />

                      {/* Product Category */}
                      <FormControl fullWidth margin="normal" sx={{ mt: 4 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={product.category}
                          label="Category"
                          name="category"
                          onChange={(event) => { handleChange(event as ChangeEvent<HTMLInputElement>) }}
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
                        onChange={handleChange}
                        value={product.price}
                        variant="outlined"
                        required
                      />

                      {/* Sales Price */}
                      <TextField
                        fullWidth
                        label="Sales Price"
                        margin="normal"
                        name="sales"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={handleChange}
                        value={product.sales} // Corrected to salesPrice
                        variant="outlined"
                        required
                      />

                      {/* Rating */}
                      <TextField
                        fullWidth
                        label="Rating"
                        margin="normal"
                        name="rating"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">/ 5</InputAdornment>,
                          inputProps: { min: 0, max: 5, step: 0.1 },
                        }}
                        onChange={handleChange}
                        value={product.rating}
                        variant="outlined"
                        required
                      />

                      {/* Reviews */}
                      <TextField
                        fullWidth
                        label="Reviews"
                        margin="normal"
                        name="reviews"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">#</InputAdornment>,
                        }}
                        onChange={handleChange}
                        value={product.reviews}
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
                        renderInput={(inputParams) => (
                          <TextField
                            {...inputParams}
                            variant="outlined"
                            label="Sizes"
                            placeholder="Add sizes"
                          />
                        )}
                        value={product.sizes}
                        onChange={(event, newValue) => {
                          setProduct(prev => ({ ...prev, sizes: newValue }));
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
                        renderInput={(inputParams) => (
                          <TextField
                            {...inputParams}
                            variant="outlined"
                            label="Colors"
                            placeholder="Add colors"
                          />
                        )}
                        value={product.colors}
                        onChange={(event, newValue) => {
                          setProduct(prev => ({ ...prev, colors: newValue }));
                        }}
                        sx={{ mt: 2, mb: 2 }}
                      />

                      {/* Product Features */}
                      <Autocomplete
                        multiple
                        id="features"
                        options={[]} // No predefined options
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
                            label="Features"
                            placeholder="Add features"
                          />
                        )}
                        value={product.features}
                        onChange={(event, newValue) => {
                          setProduct(prev => ({ ...prev, features: newValue }));
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
                            startIcon={<CloudUploadIcon />}
                          >
                            Add Images
                          </Button>
                        </label>
                      </Box>

                      {/* Display Selected Images */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {product.images.map((image, index) => (
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
                              <Close fontSize="small" />
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
                  disabled={loading || !product.productName || !product.price || !product.category || !product.sku}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </form>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Product Overview
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 2, // Added shadow for depth
                    }}
                  >
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].preview}
                        alt={product.productName}
                        width={120} // Increased image size
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <Typography variant="subtitle1" color="text.secondary">No Image</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {product.productName || 'Product Name'}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" sx={{ mt: 1, color: 'primary.main', fontWeight: 'bold' }}>
                        ${product.sales} {/* Display salesPrice */}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, ml: 1, textDecoration: 'line-through', color: 'text.secondary' }}>
                        ${product.price}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      SKU: {product.sku || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Description"
                      secondary={
                        <HTMLDescription html={product.description || 'No description available'} />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Category"
                      secondary={product.category || 'Category'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Price"
                      secondary={`$${product.price}`}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Stock"
                      secondary={product.stock.toString() || '0'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sales"
                      secondary={product.sales.toString() || '0'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Rating"
                      secondary={`${product.rating.toFixed(1)} / 5`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Reviews"
                      secondary={product.reviews.toString() || '0'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sizes"
                      secondary={product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Colors"
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {product.colors && product.colors.length > 0 ? (
                            product.colors.map((color, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: color.toLowerCase(), // Convert color to lowercase
                                  marginRight: 1,
                                  border: '1px solid #ccc', // Optional: Add border for better visibility
                                }}
                              />
                            ))
                          ) : (
                            'No colors specified'
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Features"
                      secondary={
                        product.features && product.features.length > 0
                          ? product.features.map((feature, index) => (
                              <Chip key={index} label={feature} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))
                          : 'No features specified'
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer
        position="top-center"
        autoClose={2000} // Increased autoClose to match the success message delay
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}
