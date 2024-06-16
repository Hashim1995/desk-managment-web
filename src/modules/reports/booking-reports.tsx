/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
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

import { useEffect, useMemo, useState } from 'react';
import Empty from '@/components/layout/empty';
import { MdRefresh, MdSearch } from 'react-icons/md';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { FaSort } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';
import AppHandledSolidButton from '@/components/forms/button/app-handled-solid-button';
import AppHandledDatePicker from '@/components/forms/date/app-handled-date-picker';
import {
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { convertFormDataToQueryParams } from '@/utils/functions/functions';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { IBookingReportsResponse, IReportFilter, IReportItem } from './types';

function convertDateToISO(inputDate: string): any {
  return format(inputDate, "yyyy-MM-dd'T'HH:mm");
}

type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: keyof IReportItem | null;
  direction: SortDirection;
}

function LeadsTable() {
  const [data, setData] = useState<IBookingReportsResponse>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableLoading, setTableLoading] = useState(true);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending'
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<IReportFilter>({
    mode: 'onSubmit',
    defaultValues: {
      startDate: null,
      endDate: null,
      deskName: '',
      deskOwnerName: '',
      roomName: '',
      operationType: null
    }
  });

  const onSubmit: SubmitHandler<IReportFilter> = async (
    data: IReportFilter
  ) => {
    setCurrentPage(1);
    if (data.bookingDate) {
      data.startDate = convertDateToISO(data?.startDate?.toDate());
      data.endDate = convertDateToISO(data?.endDate?.toDate());
    }
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IReportFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  async function getReports() {
    setTableLoading(true);

    try {
      const res = await RoomsService.getInstance().getReportsList([
        ...queryParams,
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
  }, [currentPage, refreshComponent, sortConfig]);

  const sortedItems = useMemo(() => {
    const sortableItems = [...(data?.items || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof IReportItem) => {
    // Ensure direction is always a valid SortDirection type
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderRows = () =>
    sortedItems.map((item: IReportItem) => (
      <TableRow className="cursor-pointer" key={item.bookingId}>
        <TableCell>{item.deskName || '-'}</TableCell>
        <TableCell>{item.deskOwnerName || '-'}</TableCell>
        <TableCell>{item.roomName || '-'}</TableCell>
        <TableCell>
          {item.operationType === 1
            ? 'Booking'
            : item.operationType === 2
            ? 'Cancel'
            : '-'}
        </TableCell>
        <TableCell>
          {item.startDate
            ? format(parseISO(item.startDate), 'dd.MM.yyyy HH:mm')
            : '-'}
        </TableCell>
        <TableCell>
          {item.endDate
            ? format(parseISO(item.endDate), 'dd.MM.yyyy HH:mm')
            : '-'}
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col gap-2 p-4 lg:p-6 w-full max-w-[1024px] h-full min-h-screen">
        <div className="relative flex justify-between items-center pe-6">
          <h3 className="font-semibold text-default-800 text-xl dark:text-white">
            Reports 😎
          </h3>
        </div>
        <form
          id="account-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex sm:flex-row flex-col justify-between gap-3 sm:gap-4 mb-3 w-full"
        >
          <div className="flex md:flex-row flex-col w-full">
            <div className="left flex sm:flex-row flex-col gap-5 w-full">
              <div className="flex flex-col gap-5 w-full sm:w-1/2">
                <div className="w-full">
                  <AppHandledInput
                    name="deskName"
                    required={false}
                    errors={errors}
                    inputProps={{
                      id: 'deskName'
                    }}
                    type="text"
                    className="text-default-900 dark:text-white"
                    control={control}
                    size="sm"
                    label={inputPlaceholderText('Desk name')}
                  />
                </div>
                <div className="w-full">
                  <AppHandledInput
                    name="roomName"
                    required={false}
                    errors={errors}
                    inputProps={{
                      id: 'roomName'
                    }}
                    type="text"
                    className="text-default-900 dark:text-white"
                    control={control}
                    size="sm"
                    label={inputPlaceholderText('Room name')}
                  />
                </div>
                <div className="w-full">
                  <AppHandledInput
                    name="deskOwnerName"
                    required={false}
                    errors={errors}
                    inputProps={{
                      id: 'deskOwnerName'
                    }}
                    type="text"
                    className="text-default-900 dark:text-white"
                    control={control}
                    size="sm"
                    label={inputPlaceholderText('Desk owner name')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 w-full sm:w-1/2">
                <div className="w-full">
                  <AppHandledDatePicker
                    name="startDate"
                    selectProps={{
                      id: 'startDate'
                    }}
                    control={control}
                    label={selectPlaceholderText('Start date')}
                    // className="app-select text-base sm:text-xl"

                    errors={errors}
                  />
                </div>
                <div className="w-full">
                  <AppHandledDatePicker
                    name="endDate"
                    selectProps={{
                      id: 'endDate'
                    }}
                    control={control}
                    label={selectPlaceholderText('End date')}
                    // className="app-select text-base sm:text-xl"

                    errors={errors}
                  />
                </div>
                <div className="w-full">
                  <AppHandledSelect
                    name="operationType"
                    selectProps={{
                      id: 'operationType'
                    }}
                    control={control}
                    label={selectPlaceholderText('Operation type')}
                    options={[
                      {
                        value: 1,
                        label: 'Booking'
                      },
                      {
                        value: 2,
                        label: 'Cancel'
                      }
                    ]}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
            <div className="md:right flex md:flex-col items-start md:items-end gap-2 mt-4 md:mt-0 w-40">
              <AppHandledSolidButton type="submit">
                <MdSearch size={21} />
              </AppHandledSolidButton>
              <AppHandledBorderedButton
                type="button"
                onClick={() => {
                  reset();
                  setCurrentPage(1);
                  setQueryParams([]);
                  setRefreshComponent(r => !r);
                }}
              >
                <MdRefresh size={20} />
              </AppHandledBorderedButton>
            </div>
          </div>
        </form>
        <div className="border-1 border-divider bg-transparent shadow-lg p-6 rounded-2xl w-full">
          <Table
            className="overflow-x-auto overflow-y-hidden"
            color="default"
            removeWrapper
            classNames={{
              thead: '!bg-transparent',
              tr: '!bg-transparent',
              th: '!bg-transparent',
              td: '!py-5'
            }}
            aria-label="Example static collection table"
            bottomContent={
              <div className="flex justify-center w-full">
                {data?.totalCount > 10 ? (
                  <Pagination
                    isCompact
                    color="default"
                    showControls
                    total={Math.ceil(data?.totalCount / 10)}
                    page={currentPage}
                    onChange={page => setCurrentPage(page)}
                  />
                ) : null}
              </div>
            }
          >
            <TableHeader>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('deskName')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  Desk name <FaSort />
                </p>
              </TableColumn>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('deskOwnerName')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  Desk owern <FaSort />
                </p>
              </TableColumn>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('roomName')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  Room name <FaSort />
                </p>
              </TableColumn>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('operationType')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  Operation type <FaSort />
                </p>
              </TableColumn>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('startDate')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  Start date <FaSort />
                </p>
              </TableColumn>
              <TableColumn
                className="cursor-pointer"
                onClick={() => requestSort('endDate')}
              >
                <p className="flex items-center gap-2">
                  {' '}
                  End date <FaSort />
                </p>
              </TableColumn>
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
    </div>
  );
}

export default LeadsTable;
