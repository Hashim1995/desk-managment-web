interface IDesk {
  deskId?: number;
  clientId: string;
  name: string;
  positionX: number;
  positionY: number;
  ownerId: number;
  width?: string;
  height?: string;
  opacity?: number;
  isCircle?: boolean;
  backgroundColor?: string;
}

interface IRooms {
  roomId: number;
  name: string;
  photoFileId: number | string | null;
  desks: IDesk[];
}

interface IRoomByIdResponse {
  desks: IDesk[];
  roomId: number;
  name: string;
  photoFileId: number;
}

interface IRoomsCreate extends Pick<IRooms, 'name' | 'photoFileId'> {
  password: string;
}

export type { IRooms, IRoomsCreate, IDesk, IRoomByIdResponse };
