export interface Order {
  id: string;
  subtotal: number;
  createdAt:any;
  shippingCost: number;
  customerId: string;
  total: number;
  pay?:boolean;
  userInfo: {
    phoneNumber: string;
    displayName: string;
    address: {
      street: string;
      zipCode: string;
      city: string;
      state: string;
    };
  };
  items: Array<{
    image: string;
    detailPage: string;
    size: string;
    quantity: number;
    id: string;
    price: number;
    color: string;
    productName: string;
    storeId: string;
  }>;
  paymentMethod: string;
  shippingMethod: string;
  status: string; // Add this line
}
