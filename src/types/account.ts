export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum ROLE {
  CLIENT = 'CLIENT',
  SHOP = 'SHOP',
  SHIPPER = 'SHIPPER'
}

export interface Account {
  name: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  gender: GENDER;
  dateOfBirth: string;
  role: ROLE;
  shopId: string | null;
}
