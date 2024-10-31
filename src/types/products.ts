export interface ProductImage {
  file: File;
  preview: string;
}

export interface CreateProductType {
  id: string;
  storeId: string;
  storeName: string;
  productName: string;
  category: string;
  price: number;
  introducing?: string;
  detailPage?: string;
  stock: number;
  sizes: string[];
  createdAt: string;
  updatedAt: string;

  sales?: number;
  description: string;
  images: { file?: File; preview?: string }[];
  colors: string[];
  categories?: string[];
  features?: string[];
  sku?: string;
  rating?: number;
  reviews?: number;
}
export interface AddProductType {
  id: string;
  storeId: string;
  storeName: string;
  productName: string;
  introducing?: string;
  category: string;
  price: number;
  detailPage?: string;
  stock: number;
  sizes: string[];
  createdAt: string;
  updatedAt: string;
  sales?: number;
  description: string;
  images: string[];
  colors: string[];
  categories?: string[];
  features?: string[];
  sku?: string;
  rating?: number;
  reviews?: number;
}

export interface ProductPull {
  id: string;
  avatar?: string;
  storeId: string;
  storeName: string;
  introducing?: string;
  detail: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  detailPage?: string;
  sales?: string;
  sizes: string[];
  images: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
  categories?: string[] ;
   features?: string[] ;
   sku?: string ;
   rating?: number,
   reviews?: number,
}

export const sizeOptions: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const colorOptions: string[] = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
