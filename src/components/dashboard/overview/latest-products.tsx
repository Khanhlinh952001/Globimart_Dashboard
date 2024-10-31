import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import { paths } from '@/paths';
import useProduct from '@/hooks/use-product';
import { CircularProgress, Chip, Grid, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
export interface Product {
  id: string;
  images: string[];
  productName: string;
  updatedAt: string; // Changed to string to match ISO format
  price: number;
  stock: number;
  description: string;
  sales: number;
  rating: number;
  category: string;
  colors: string[];
  sizes: string[];
}

export interface LatestProductsProps {
  sx?: SxProps;
}

export function LatestProducts({ sx }: LatestProductsProps): React.JSX.Element {
  const { products, loading } = useProduct();
   const router= useRouter();
  // Ensure products are sorted by updatedAt descending and take top 5
  const latestProducts = React.useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [products]);

  if (loading) {
    return (
      <Card sx={sx}>
        <CardHeader title="Latest Products" />
        <Divider />
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  // Helper function to truncate product names
  const truncate = (str: string, maxLength: number) => {
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Sản phẩm mới nhất" />
      <Divider />
      <List>
        {latestProducts.map((product, index) => (
          <ListItem
            divider={index < latestProducts.length - 1}
            key={product.id}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              {product.images && product.images.length > 0 ? (
                <Avatar
                  variant="rounded"
                  src={product.images[0]}
                  alt={product.productName}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: 'var(--mui-palette-neutral-200)',
                    width: 64,
                    height: 64,
                    mr: 2,
                  }}
                >
                  N/A
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Tooltip title={product.productName}>
                  <Typography
                    variant="h6"
                    component="div"
                    noWrap
                    sx={{ maxWidth: 200 }} // Adjust maxWidth as needed
                  >
                    {truncate(product.productName, 50)} {/* Truncate to 50 characters */}
                  </Typography>
                </Tooltip>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {product.description || 'No description available.'}
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item>
                      <Chip label={`Price: $${product.price}`} color="primary" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`Stock: ${product.stock}`} color="success" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`Sales: ${product.sales}`} color="warning" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label={`Rating: ${product.rating}`} color="info" size="small" />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 1 }}>
                    {product.colors.map((color) => (
                      <Chip
                        key={color}
                        label={color}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {product.sizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
              }
            />
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          onClick={()=>router.push(paths.dashboard.productList)}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}

export default LatestProducts;
