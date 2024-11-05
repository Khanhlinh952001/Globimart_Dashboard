"use client"
import * as React from 'react';
import { useState } from 'react'; // Ensure useState is imported
import { Box, TextField, InputAdornment, Grid, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'; // Import axios
import { parseString } from 'xml2js'; // Import parseString
import { ToastContainer } from 'react-toastify';
import Typography from '@mui/material/Typography'; // Add import for Typography
import ProductCard from './ProductCard'; // Import ProductCard component
import GoogleTranslate from '@/components/GoogleTranslate';
interface Product {
  ProductCode: string[];
  ProductName: string[];
  ProductPrice: string[];
  ProductImage300: string[];
  DetailPageUrl: string[];
  SalePrice: string[];
  ReviewCount: string[];
  // Add other fields as necessary
}

export default function Page(): React.JSX.Element {
  const [searchValue, setSearchValue] = useState(''); // Ensure useState is used correctly
  const [json, setJson] = useState<Product[] | null>(null); // Define json type
  const [loading, setLoading] = useState(false); // Define loading state
  const apiKey = "23ebb9fd1b66ae392b91870ed7bb4447";

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => { // Make function async
    setSearchValue(event.target.value);
    try {
      setLoading(true);
      const response = await axios.get(
        `https://app-service-nine.vercel.app/api?key=${apiKey}&apiCode=ProductSearch&keyword=${searchValue}` // Use searchValue
      );

      // Check if response status is not OK or data is undefined or empty
      if (response.status !== 200 || !response.data) {
        console.error('Response:', response); // Log the entire response for debugging
        throw new Error('Response data is empty or undefined');
      }

      // Parse the XML data
      parseString(response.data, function (err, result) {
        if (err) {
          throw new Error(`Error parsing XML: ${err.message}`);
        }
        const jsonData =
          result?.ProductSearchResponse?.Products[0]?.Product || [];
        // You can handle the parsed JSON data here
        setJson(jsonData);
        setLoading(false);
      });
    } catch (error: unknown) { // Specify the type of error
      if (error instanceof Error) { // Check if error is an instance of Error
        console.error('Error fetching/searching results:', error.message);
      } else {
        console.error('Error fetching/searching results:', error); // Handle unknown error
      }
      setLoading(false); // Ensure loading is set to false on error
      throw error; // Re-throw the error to handle it in the calling code
    }
  }

  return (
    <Box display="flex" justifyContent="center" width="100%">
        <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
        <Box position="absolute" top="50%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
          {loading ? <CircularProgress /> : null} {/* Display loading icon */}
        </Box>
      <Grid container spacing={2} justifyContent="center"> {/* Căn giữa các phần tử */}
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
          // onKeyPress={handleSearchChange} // Thêm sự kiện onKeyPress
          sx={{ width: '80%', margin: '0 auto' }} // Căn giữa ô nhập liệu
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      <GoogleTranslate />


        {!searchValue && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              Nhập tên sản phẩm để thêm
            </Typography>
          </Grid>
        )}

        {json && Array.isArray(json) ? json.map((product, index) => (
          <ProductCard key={index} product={product} />
        )) : null}
      </Grid>
    </Box>
  );
}
