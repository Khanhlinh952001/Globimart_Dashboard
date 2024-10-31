import { type User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  id:string;
  firstName?: string;
  lastName?: string;
  logoUrl?:string;
  phone?:string;
  category?:string;
  address?:string;
  productCategory?:string;
  role?:string;
  exchange:number;
  description?:string;
  businessName?:string;
  bankName?:string;
  bankNumber?:string;
  storeName?:string
}
export interface Users {
  id: string;
  name: string;
  avatar: string;
  email: string;
}
