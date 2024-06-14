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
  photoFileId: number;
}

export interface ILogin {
  emailOrPhone?: string;
  password?: string;
}
export interface IGoogleLogin {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'btn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}

export interface ILoginResponse extends IGlobalResponse {
  firstName: string;
  email: string;
  lastName: string;
  userFullName: string;
  token: string;
}
