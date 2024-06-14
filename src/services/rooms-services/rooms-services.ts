/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import {
  IDesk,
  IOwnedDesks,
  IRoomByIdResponse,
  IRoomsCreate
} from '@/modules/home/types';
import { IBookingReportsResponse } from '@/modules/reports/types';
import {
  ErrorCallBack,
  HttpUtil,
  IHTTPSParams
  // IHTTPSParams
} from '../adapter-config/config';

export class RoomsService {
  // eslint-disable-next-line no-use-before-define
  private static instance: RoomsService | null;

  private constructor() { }

  public static getInstance(): RoomsService {
    if (!this.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance!;
  }

  public async getRoomsList(
    // params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<{ name: string; id: number }[]> {
    const res = await HttpUtil.get('/Rooms/compact', null, false, onError);
    return res;
  }

  public async getReportsList(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IBookingReportsResponse> {
    const res = await HttpUtil.get('/Bookings', params, false, onError);
    return res;
  }

  public async getMyDesks(
    // params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IOwnedDesks[]> {
    const res = await HttpUtil.get('/Desks/Owned', null, false, onError);
    return res;
  }

  public async switchMyDeskStatus(
    id: number,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.put(`/Desks/Bookability/${id}`, null, onError);
    return res;
  }

  public async getRoomById(
    params: IHTTPSParams[],
    onError?: ErrorCallBack
  ): Promise<IRoomByIdResponse> {
    const res = await HttpUtil.get(
      `/Bookings/RoomStatus`,
      params,
      false,
      onError
    );
    return res;
  }

  public async getOwnerComboList(
    onError?: ErrorCallBack
  ): Promise<{ name: string; id: number }[]> {
    const res = await HttpUtil.get(`/Users/Compact`, null, false, onError);
    return res;
  }

  public async saveDesk(
    payload: { roomId: number; desks: IDesk[] },
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/desks', payload, onError);
    return res;
  }

  public async bookDesk(
    payload: { deskId: number; startDate: any; endDate: any },
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/Bookingssalam', payload, onError);
    return res;
  }

  public async createRoomsMain(
    payload: IRoomsCreate,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.post('/Rooms', payload, onError);
    return res;
  }

  public async updateRoomsMain(
    payload: any,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.put('/Users', payload, onError);
    return res;
  }

  public async cancelDesk(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`Bookings/${id}`, onError);
    return res;
  }

  public async delete(id: number, onError?: ErrorCallBack): Promise<any> {
    const res = await HttpUtil.delete(`Users/${id}`, onError);
    return res;
  }

  public async deleteDesk(
    id: number,
    onError?: ErrorCallBack
  ): Promise<{ id: number }> {
    const res = await HttpUtil.delete(`Desks/${id}`, onError);
    return res;
  }
}
