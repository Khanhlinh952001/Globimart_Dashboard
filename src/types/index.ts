// Sample data for the entire project
import { type ProductPull } from "./products";
import { type Users } from "./user";
// Sample Accounts
// export const sampleAccounts: Account[] = [
//   {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phoneNumber: "+1234567890",
//     avatarUrl: "https://example.com/avatars/john.jpg",
//     gender: GENDER.MALE,
//     dateOfBirth: "1990-01-15",
//     role: ROLE.CLIENT,
//     shopId: null
//   },
//   {
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     phoneNumber: "+1987654321",
//     avatarUrl: "https://example.com/avatars/jane.jpg",
//     gender: GENDER.FEMALE,
//     dateOfBirth: "1985-05-20",
//     role: ROLE.SHOP,
//     shopId: "SHOP001"
//   },
//   {
//     name: "Alex Johnson",
//     email: "alex.johnson@example.com",
//     phoneNumber: "+1122334455",
//     avatarUrl: "https://example.com/avatars/alex.jpg",
//     gender: GENDER.OTHER,
//     dateOfBirth: "1988-11-30",
//     role: ROLE.SHIPPER,
//     shopId: null
//   }
// ];

// Sample Login Accounts
// export const sampleLoginAccounts: LoginAccount[] = [
//   { email: "john.doe@example.com", password: "password123" },
//   { email: "jane.smith@example.com", password: "securepass456" },
//   { email: "alex.johnson@example.com", password: "shipperpass789" }
// ];


// Sample Products
export const sampleProducts: ProductPull[] = [
  {
    id: "PROD001",
    storeId: "STORE001",
    storeName: "Fashion Emporium",
    detail:'https://www.11st.co.kr/products/2126828599',
    productName: "Classic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt for everyday wear.",
    category: "Apparel",
    price: 19.99,
    image: "https://example.com/images/tshirt-main.jpg",
    // imagePreview: "https://example.com/images/tshirt-preview.jpg",
    stock: 100,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://example.com/images/tshirt-white.jpg",
      "https://example.com/images/tshirt-black.jpg"
    ],
    colors: ["White", "Black"],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-04-15T12:00:00Z"
  },
  {
    id: "PROD002",
    storeId: "STORE001",
    storeName: "Fashion Emporium",
    productName: "Slim Fit Jeans",
    detail:'https://www.11st.co.kr/products/2298180110',
    description: "Modern slim fit jeans with stretch fabric for comfort and style.",
    category: "Apparel",
    price: 49.99,
    image: "https://example.com/images/jeans-main.jpg", // Add this line
    // imagePreview: "https://example.com/images/jeans-preview.jpg",
    stock: 75,
    sizes: ["28", "30", "32", "34"],
    images: [
      "https://example.com/images/jeans-blue.jpg",
      "https://example.com/images/jeans-black.jpg"
    ],
    colors: ["Blue", "Black"],
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-04-20T14:30:00Z"
  }
];

// Sample Orders

// Sample Tracking Info

// Sample Users
export const sampleUsers: Users[] = [
  {
    id: "USER001",
    name: "John Doe",
    avatar: "https://example.com/avatars/john.jpg",
    email: "john.doe@example.com"
  },
  {
    id: "USER002",
    name: "Jane Smith",
    avatar: "https://example.com/avatars/jane.jpg",
    email: "jane.smith@example.com"
  }
];

// You can add more sample data for other types as needed
