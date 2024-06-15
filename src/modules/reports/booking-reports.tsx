import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';

import { useEffect, useState } from 'react';
import Empty from '@/components/layout/empty';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { format, parseISO } from 'date-fns';
import { IBookingReportsResponse } from './types';

function LeadsTable() {
  const [data, setData] = useState<IBookingReportsResponse>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableLoading, setTableLoading] = useState(true);

  async function getReports() {
    setTableLoading(true);

    try {
      const res = await RoomsService.getInstance().getReportsList([
        { name: 'page', value: currentPage }
      ]);
      if (res?.items) {
        setData(res);
        setTableLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getReports();
  }, [currentPage]);

  const renderRows = () =>
    data?.items?.map(item => (
      <TableRow className="cursor-pointer" key={item?.bookingId}>
        <TableCell>{item?.userName || '-'}</TableCell>

        <TableCell>{item?.deskName || '-'}</TableCell>
        <TableCell>{item?.deskOwnerName || '-'}</TableCell>
        <TableCell>{item?.roomName || '-'}</TableCell>
        <TableCell>
          {format(parseISO(item?.startDate), 'dd.MM.yyyy HH:mm') || '-'}
        </TableCell>
        <TableCell>
          {format(parseISO(item?.endDate), 'dd.MM.yyyy HH:mm') || '-'}
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-screen p-2 lg:p-6">
      <div className="relative flex justify-between items-center pe-6">
        <h3 className="font-semibold text-default-800 text-xl dark:text-white">
          Reports 😎
        </h3>
      </div>
      <div className="border-1 border-divider bg-transparent shadow-lg p-6 rounded-2xl w-full">
        <Table
          color="default"
          removeWrapper
          className="text-default-900 dark:text-white overflow-x-auto overflow-y-hidden"
          classNames={{
            thead: '!bg-transparent',
            tr: '!bg-transparent',
            th: '!bg-transparent',
            td: '!py-5'
          }}
          aria-label="Example static collection table"
          bottomContent={
            <div className="flex justify-center w-full">
              <Pagination
                isCompact
                color="default"
                showControls
                total={Math.ceil(data?.totalCount / 10)}
                page={currentPage}
                onChange={page => setCurrentPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>User Name</TableColumn>
            <TableColumn>Desk name</TableColumn>
            <TableColumn>Desk owner</TableColumn>
            <TableColumn>Room Name</TableColumn>
            <TableColumn>Start Date</TableColumn>
            <TableColumn>End Date</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={<Empty />}
            isLoading={tableLoading}
            loadingContent={<Spinner />}
          >
            {renderRows()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LeadsTable;
