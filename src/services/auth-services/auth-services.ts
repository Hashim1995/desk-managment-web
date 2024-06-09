/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
import { IAuth, ILogin, ILoginResponse } from '@/models/user';
import { IGlobalResponse } from '@/models/common';
import { ErrorCallBack, HttpUtil } from '../adapter-config/config';

export interface IAuthResponse extends IGlobalResponse {
  Data: IAuth;
}

export class AuthService {
  // eslint-disable-next-line no-use-before-define
  private static instance: AuthService | null;

  private constructor() { }

  public static getInstance(): AuthService {
    if (!this.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance!;
  }

  // public async getUserData(onError?: ErrorCallBack): Promise<IAuthResponse> {
  //   const res = await HttpUtil.get('/authentication/me', null, false, onError);
  //   return res;
  // }

  public async login(
    body: ILogin,
    onError?: ErrorCallBack
  ): Promise<ILoginResponse> {
    const res = await HttpUtil.post('/Account/Authentication', body, onError);
    return res;
  }

  public async getMe(onError?: ErrorCallBack): Promise<IAuth> {
    const res = await HttpUtil.get('/Account/UserInfo', null, false, onError);
    return res;
  }
}
