interface IDeskBookings {
  bookedById: number;
  bookedByName: string;
  bookingId: number;
  endDate: any;
  isBookedByMe: boolean;
  startDate: any;
}

interface IDesk {
  deskId?: number;
  clientId: string;
  name: string;
  positionX: number;
  positionY: number;
  ownerId: number;
  ownerName: number;
  width?: string;
  height?: string;
  opacity?: number;
  isCircle?: boolean;
  isBookingAllowedByOwner: boolean;
  isBookedByMe: boolean;
  bookings: IDeskBookings[];
  releases: [];
  backgroundColor?: string;
}
interface IOwnedDesks
  extends Omit<IDesk, 'ownerName' | 'bookings' | 'releases'> {
  ownerName: string;
  roomId: number;
  roomName: string;
  ownerPhotoFileId: number | null;
  createdAt: string;
  createdBy: number;
  isActive: boolean;
  isBookingAllowedByOwner: boolean;
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

export type {
  IRooms,
  IRoomsCreate,
  IOwnedDesks,
  IDeskBookings,
  IDesk,
  IRoomByIdResponse
};
