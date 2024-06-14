/* eslint-disable no-use-before-define */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  today,
  getLocalTimeZone,
  ZonedDateTime,
  now,
  parseAbsoluteToLocal,
  Time
} from '@internationalized/date';
import { format, formatISO, sub } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  Tab,
  Button,
  DatePicker,
  Spinner,
  DateValue,
  DateRangePicker,
  TimeInput,
  RangeValue,
  RangeCalendar,
  TimeInputValue,
  DateInput,
  useDisclosure,
  ButtonGroup,
  Chip
} from '@nextui-org/react';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';
import { tokenizeImage } from '@/utils/functions/functions';
import DeskItem from './desk-item';
import { IRoomByIdResponse, IDesk } from './types';
import DeleteMultiBookingModal from './delete-multi-booking';

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

// const convertToISO8601 = (dateZoned: string): string => {
//   const time = timeZoned?.toString();
//   const date = dateZoned?.toString();
//   const formattedTime = time.match(/\d\d:\d\d/)[0];
//   const dateTime = `${date}T00:00`;
//   return dateTime;
// };

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
    let endHour = 23;
    let endMinute = 59;

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
      endHour = 23;
      endMinute = 59;
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
    const endZonedDate = new ZonedDateTime(
      newDate.year,
      newDate.month,
      newDate.day,
      timeZone,
      0,
      endHour,
      endMinute,
      newDate.second,
      newDate.millisecond
    );

    setFilterDate(startZonedDate);
    setSubmitDate({
      start: startZonedDate,
      end: endZonedDate
    });
  };

  async function bookDesk() {
    setbtnLoading(true);

    const startDateTime = new Date(submitDate.start.toString());
    const endDateTime = new Date(submitDate.end.toString());
    const startDate = `${format(startDateTime, 'yyyy-MM-dd')}T00:00:00`;
    const endDate = `${format(endDateTime, 'yyyy-MM-dd')}T23:59:59`;
    console.log(startDate, 'salam-start');
    console.log(endDate, 'salam-start');
    try {
      const res = await RoomsService.getInstance().bookDesk({
        deskId: selectedDesk?.deskId,
        startDate: 1, // Pass Date object directly
        endDate: 2 // Pass Date object directly
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
        setRefreshComponent(z => !z);
      }
    } catch (err) {
      console.log(err);
    }
    setbtnLoading(false);
  }

  useEffect(() => {
    const perpx = 1.9 / 1920;
    const scaleCanvas = () => {
      if (canvasRef.current) {
        const screenWidth = window.innerWidth;
        if (screenWidth < 800) {
          const ratio = perpx * screenWidth;
          canvasRef.current.style.transform = `scale(${ratio})`;
        } else {
          canvasRef.current.style.transform = 'none';
        }
      }
    };
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', scaleCanvas);
  }, []);

  useEffect(() => {
    selectedRoom && getRoom();
  }, [selectedRoom, refreshComponent, filterDate]);

  useEffect(() => {
    getRoomCompact();
  }, []);

  useEffect(() => {
    setSelectedDesk(null);
  }, [selectedRoom]);
  return (
    <div className="flex flex-col justify-center items-center">
      <Tabs
        size="lg"
        aria-label="Options"
        selectedKey={selectedRoom}
        onSelectionChange={(e: number) => {
          setFilterDate(generateDates()[0]);
          setSelectedRoom(e);
        }}
      >
        {roomList?.map(z => (
          <Tab key={z?.id} title={z?.name}>
            {!isSubmitting ? (
              <div className="min-h-screen">
                <div className="flex flex-col items-center p-4">
                  <div className="flex items-center gap-2">
                    <ButtonGroup>
                      {generateDates()?.map((date, index) => (
                        <Button
                          key={`${index}`}
                          color={
                            filterDate.day === date.day ? 'primary' : 'default'
                          }
                          onClick={() => handleFilterDateChange(date)}
                        >
                          {`${date.day}/${date.month}/${date.year}`}
                        </Button>
                      ))}
                    </ButtonGroup>
                    <DatePicker
                      hourCycle={24}
                      onChange={handleFilterDateChange}
                      value={filterDate}
                      minValue={today(getLocalTimeZone())}
                    />
                  </div>
                </div>

                {selectedDesk && (
                  <div className="flex justify-between items-center gap-4 mt-2 w-full">
                    <DateRangePicker
                      aria-label="Date (Controlled)"
                      value={submitDate}
                      onChange={setSubmitDate}
                      hourCycle={24}
                      minValue={today(getLocalTimeZone())}
                      size="lg"
                      visibleMonths={2}
                      calendarWidth={900}
                    />
                    {selectedDesk?.isBookedByMe ? (
                      <AppHandledBorderedButton
                        size="lg"
                        isLoading={btnLoading}
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
                        Cancel Desk
                      </AppHandledBorderedButton>
                    ) : (
                      <AppHandledBorderedButton
                        size="lg"
                        isLoading={btnLoading}
                        radius="none"
                        type="submit"
                        onClick={() => bookDesk()}
                      >
                        Book - {selectedDesk?.name}
                      </AppHandledBorderedButton>
                    )}
                  </div>
                )}
                <div className="relative flex justify-center items-center mt-10">
                  <div className="-top-3 z-10 absolute flex gap-2">
                    <Chip color="primary"> My bookings</Chip>
                    <Chip color="success">Free</Chip>
                    <Chip color="default"> Assigned to someone</Chip>
                    <Chip color="danger">Booked</Chip>
                  </div>
                  <div
                    id="canvas"
                    ref={canvasRef}
                    style={{
                      backgroundRepeat: 'no-repeat'
                    }}
                    className="relative bg-gray-100 border w-[1000px] h-[1000px] overflow-scroll"
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
