import { IGlobalResponse } from './common';

export interface IAuth {
  id: number;
  createdAt: Date | string;
  createdAtFormatted: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nickName: string | null;
  email: string;
  phoneNumber: string | null;
}

export interface ILogin {
  emailOrPhone?: string;
  password?: string;
}

export interface ILoginResponse extends IGlobalResponse {
  firstName: string;
  email: string;
  lastName: string;
  userFullName: string;
  token: string;
}
