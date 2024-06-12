interface IReportItem {
    bookingId: number;
    userId: number;
    userName: string;
    deskId: number;
    deskName: string;
    deskOwnerName: string | null;
    roomId: number;
    roomName: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    deletedAt: string | null;
}

interface IBookingReportsResponse {
    totalCount: number;
    items: IReportItem[];
}

export type { IReportItem, IBookingReportsResponse }