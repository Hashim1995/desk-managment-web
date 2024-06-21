/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import {
  today,
  getLocalTimeZone,
  ZonedDateTime,
  Time,
  now
} from '@internationalized/date';
import { format } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  Tab,
  Button,
  DatePicker,
  Spinner,
  DateValue,
  DateRangePicker,
  RangeValue,
  useDisclosure,
  Chip,
  TimeInput,
  TimeInputValue
} from '@nextui-org/react';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import AppHandledSolidButton from '@/components/forms/button/app-handled-solid-button';
import { tokenizeImage } from '@/utils/functions/functions';
import DeskItem from './desk-item';
import { IDesk } from './types';
import DeleteMultiBookingModal from './delete-multi-booking';

const getCurrentTime = () => {
  const now = new Date();
  return new Time(now.getHours(), now.getMinutes());
};

const generateDates = (): ZonedDateTime[] => {
  const today = now(getLocalTimeZone());
  return Array.from({ length: 7 }, (_, i) => today.add({ days: i }));
};
const formatToISO8601 = (zonedDateTime: ZonedDateTime) => {
  const { year, month, day, hour, minute, second } = zonedDateTime;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
  return formattedDate;
};

const getEndOfDay = (zonedDateTime: ZonedDateTime): ZonedDateTime => {
  const { year, month, day } = zonedDateTime;
  return new ZonedDateTime(
    year,
    month,
    day,
    zonedDateTime.timeZone,
    0,
    23,
    59,
    zonedDateTime.second
  );
};
function extractDate(input: string): string {
  const dateMatch = input.match(/\d{4}-\d{2}-\d{2}/);
  return dateMatch ? dateMatch[0] : 'Invalid Date';
}

function prepareBookDatePaylod(
  start: string,
  end: string,
  startTime: TimeInputValue,
  endTime: TimeInputValue
): { startDate: string; endDate: string } {
  const startDateString = extractDate(start);
  const endDateString = extractDate(end);

  return {
    startDate: `${startDateString}T${startTime.toString()}`,
    endDate: `${endDateString}T${endTime.toString()}`
  };
}

export default function Home() {
  const {
    isOpen: deleteMultiBookingIsOpen,
    onOpen: deleteMultiBookingOnOpen,
    onOpenChange: deleteMultiBookingOnOpenChange
  } = useDisclosure();
  const canvasRef = useRef(null);
  const [filterDate, setFilterDate] = useState<ZonedDateTime>(
    generateDates()[0]
  );
  const [submitDate, setSubmitDate] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone())
  });
  const [submitStartTime, setSubmitStartTime] = useState<TimeInputValue>(
    getCurrentTime()
  );
  const [submitEndTime, setSubmitEndTime] = useState<TimeInputValue>(
    new Time(23, 59)
  );

  const [refreshComponent, setRefreshComponent] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [deskList, setDeskList] = useState<IDesk[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<number>();
  const [selectedDesk, setSelectedDesk] = useState<IDesk>();
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const fetchTokenizedImage = async (id: string) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${id}`
      });

      setPhotoUrl(tokenizedFile?.url || '');
    } catch (err) {
      console.log(err);
    }
  };

  async function getRoom() {
    setIsSubmitting(true);
    const startDate = formatToISO8601(filterDate);
    const endDate = formatToISO8601(getEndOfDay(filterDate));

    try {
      const res = await RoomsService.getInstance().getRoomById([
        { name: 'roomId', value: selectedRoom },
        { name: 'startDate', value: startDate },
        { name: 'endDate', value: endDate }
      ]);
      if (res?.roomId) {
        setDeskList(res?.desks);
        res?.desks?.map(z => z?.recentlyBooked && setSelectedDesk(z));
        res?.photoFileId && fetchTokenizedImage(res?.photoFileId?.toString());
        setIsSubmitting(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getRoomCompact() {
    try {
      const res = await RoomsService.getInstance().getRoomsList();
      setRoomList(res);
      setSelectedRoom(res[0]?.id);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFilterDateChange = (newDate: any) => {
    const timeZone = getLocalTimeZone();
    let hour = 0;
    let minute = 0;

    const todayDate = today(timeZone);
    if (
      newDate.year === todayDate.year &&
      newDate.month === todayDate.month &&
      newDate.day === todayDate.day
    ) {
      const now = new Date();
      hour = now.getHours();
      minute = now.getMinutes();
    } else {
      hour = 0;
      minute = 0;
    }
    const startZonedDate = new ZonedDateTime(
      newDate.year,
      newDate.month,
      newDate.day,
      timeZone,
      0,
      hour,
      minute,
      newDate.second,
      newDate.millisecond
    );

    setFilterDate(startZonedDate);
    const startZonedDateForSubmit = new ZonedDateTime(
      newDate.year,
      newDate.month,
      newDate.day,
      timeZone,
      0,
      0,
      0,
      0
    );

    const ForSubmit = new ZonedDateTime(
      newDate.year,
      newDate.month,
      newDate.day,
      timeZone,
      23,
      59,
      59,
      0
    );

    setSubmitStartTime(new Time(hour, minute));
    setSubmitEndTime(new Time(23, 59));

    setSubmitDate({ start: startZonedDateForSubmit, end: ForSubmit });
  };

  async function bookDesk() {
    setbtnLoading(true);

    const { startDate, endDate } = prepareBookDatePaylod(
      submitDate.start?.toString(),
      submitDate.end?.toString(),
      submitStartTime,
      submitEndTime
    );

    try {
      const res = await RoomsService.getInstance().bookDesk({
        deskId: selectedDesk?.deskId,
        startDate,
        endDate
      });
      if (res) {
        setRefreshComponent(z => !z);
      }
    } catch (err) {
      console.log(err);
    }
    setbtnLoading(false);
  }

  async function cancelDesk() {
    setbtnLoading(true);
    try {
      const res = await RoomsService.getInstance().cancelDesk(
        selectedDesk?.bookings[0]?.bookingId
      );
      if (res) {
        setSelectedDesk(null);
        setRefreshComponent(z => !z);
      }
    } catch (err) {
      console.log(err);
    }
    setbtnLoading(false);
  }

  useEffect(() => {
    getRoomCompact();
    // const perpx = 1.9 / 1920;
    // const scaleCanvas = () => {
    //   if (canvasRef.current) {
    //     const screenWidth = window.innerWidth;
    //     if (screenWidth < 1030) {
    //       const ratio = perpx * screenWidth;
    //       canvasRef.current.style.transform = `scale(${ratio})`;
    //       canvasRef.current.style.transformOrigin = 'top';
    //     } else {
    //       canvasRef.current.style.transform = 'none';
    //     }
    //   }
    // };
    // scaleCanvas();
    // window.addEventListener('resize', scaleCanvas);

    // return () => window.removeEventListener('resize', scaleCanvas);
  }, []);

  useEffect(() => {
    selectedRoom && getRoom();
  }, [selectedRoom, refreshComponent, filterDate]);

  useEffect(() => {
    setSelectedDesk(null);
  }, [selectedRoom]);

  return (
    <div className="flex flex-col justify-center items-center min-w-[320px] overflow-x-hidden">
      <Tabs
        size="sm"
        aria-label="Options"
        variant="bordered"
        color="default"
        className="mt-5"
        selectedKey={selectedRoom}
        onSelectionChange={(e: number) => {
          setFilterDate(generateDates()[0]);
          setSelectedRoom(e);
        }}
      >
        {roomList?.map(z => (
          <Tab key={z?.id} title={z?.name}>
            {!isSubmitting ? (
              <div className="flex flex-col gap-8 min-h-screen">
                <div className="flex flex-col items-center p-4">
                  <div className="flex xl:flex-row flex-col items-center gap-2">
                    <div className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                        {generateDates()?.map(date => (
                          <Button
                            key={`${date}`}
                            onClick={() => handleFilterDateChange(date)}
                            className={`${
                              filterDate.day === date.day
                                ? 'bg-[#333a4a]'
                                : 'bg-transparent'
                            }`}
                          >
                            {`${date.month}/${date.day}/${date.year}`}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <DatePicker
                      hourCycle={24}
                      onChange={handleFilterDateChange}
                      granularity="day"
                      value={filterDate}
                      onKeyDown={e => {
                        e.preventDefault();
                      }}
                      minValue={today(getLocalTimeZone())}
                      className="w-72"
                    />
                  </div>
                </div>

                {selectedDesk ? (
                  <div className="flex md:flex-row justify-between items-center gap-4 mt-4 md:mt-10">
                    <div className="flex justify-between items-center gap-2">
                      <DateRangePicker
                        aria-label="Date (Controlled)"
                        value={submitDate}
                        label="Date"
                        granularity="day"
                        onChange={setSubmitDate}
                        hourCycle={24}
                        minValue={today(getLocalTimeZone())}
                        size="lg"
                        onKeyDown={e => {
                          e.preventDefault();
                        }}
                        visibleMonths={2}
                        calendarWidth={900}
                      />
                      <TimeInput
                        label="Start time"
                        className="w-[200px]"
                        size="lg"
                        hourCycle={24}
                        value={submitStartTime}
                        onChange={setSubmitStartTime}
                      />
                      <TimeInput
                        label="End time"
                        className="w-[200px]"
                        size="lg"
                        hourCycle={24}
                        value={submitEndTime}
                        onChange={setSubmitEndTime}
                      />
                    </div>

                    {selectedDesk?.isBookedByMe ? (
                      <AppHandledSolidButton
                        size="lg"
                        isLoading={btnLoading}
                        color="danger"
                        radius="none"
                        type="submit"
                        onClick={() => {
                          if (selectedDesk?.bookings?.length > 1) {
                            deleteMultiBookingOnOpen();
                          } else {
                            cancelDesk();
                          }
                        }}
                      >
                        Cancel - {selectedDesk?.name}
                      </AppHandledSolidButton>
                    ) : (
                      <AppHandledSolidButton
                        size="lg"
                        isLoading={btnLoading}
                        radius="none"
                        type="submit"
                        color="success"
                        variant="solid"
                        onClick={() => bookDesk()}
                      >
                        Book - {selectedDesk?.name}
                      </AppHandledSolidButton>
                    )}
                  </div>
                ) : null}
                <div className="relative flex justify-center items-center mt-10">
                  <div className="-top-5 sm:-top-8 z-10 absolute flex gap-2 ml-0 sm:ml-16">
                    <Chip
                      color="primary"
                      className="p-0 sm:p-1 rounded h-5 sm:h-fit text-[10px] sm:text-sm"
                    >
                      {' '}
                      My bookings
                    </Chip>
                    <Chip
                      color="success"
                      className="p-0 sm:p-1 rounded h-5 sm:h-fit text-[10px] text-white sm:text-sm"
                    >
                      Free
                    </Chip>
                    <Chip
                      color="default"
                      className="p-0 sm:p-1 rounded h-5 sm:h-fit text-[10px] sm:text-sm"
                    >
                      {' '}
                      Assigned to someone
                    </Chip>
                    <Chip
                      color="danger"
                      className="p-0 sm:p-1 rounded h-5 sm:h-fit text-[10px] sm:text-sm"
                    >
                      Booked
                    </Chip>
                  </div>
                  <div
                    id="canvas"
                    ref={canvasRef}
                    style={{
                      backgroundRepeat: 'no-repeat',
                      transformOrigin: 'top'
                    }}
                    className="relative bg-gray-100 scale-35 sm:scale-55 md:scale-75 xl:scale-100 border w-[1000px] min-w-[320px] h-[900px] min-h-[320px] overflow-hidden"
                  >
                    <img
                      alt=""
                      src={photoUrl}
                      className="absolute inset-0 object-contain"
                    />
                    {deskList.map(desk => (
                      <DeskItem
                        key={desk?.clientId || desk?.deskId}
                        desk={desk}
                        selectedDesk={selectedDesk}
                        setSelectedDesk={setSelectedDesk}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Spinner className="h-48 min-h-screen" size="lg" />
            )}
          </Tab>
        ))}
      </Tabs>
      {deleteMultiBookingIsOpen && (
        <DeleteMultiBookingModal
          onOpenChange={deleteMultiBookingOnOpenChange}
          isOpen={deleteMultiBookingIsOpen}
        />
      )}
    </div>
  );
}
