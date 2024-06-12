/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  today,
  getLocalTimeZone,
  ZonedDateTime,
  now,
  parseAbsoluteToLocal
} from '@internationalized/date';
import { format, formatISO } from 'date-fns';
import { useState, useEffect } from 'react';
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
  ButtonGroup
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

const formatToISO8601 = (zonedDateTime: ZonedDateTime): string => {
  const { year, month, day, hour, minute, second } = zonedDateTime;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const utcDate = new Date(date).toISOString();
  return formatISO(utcDate);
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

const getCurrentTime = () => new Date().toISOString();

const getEndTime = (startTime: string) => {
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 5);
  return endTime.toISOString();
};
const convertToISO8601 = (date: string, time: TimeInputValue): string => {
  const dateTimeString = `${date}T${time.hour}:${time.minute}:${time.second}`;
  const dateObj = new Date(dateTimeString);

  // Adjust the timezone offset
  const tzOffset = dateObj.getTimezoneOffset() * 60000;
  const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString();

  return localISOTime;
};

const formatToLocalISO8601 = (date: Date): string => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = (num: number) => (num < 10 ? '0' : '') + num;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}${diff}${pad(Math.floor(Math.abs(tzOffset) / 60))}:${pad(
    Math.abs(tzOffset) % 60
  )}`;
};

export default function Home() {
  const {
    isOpen: deleteMultiBookingIsOpen,
    onOpen: deleteMultiBookingOnOpen,
    onOpenChange: deleteMultiBookingOnOpenChange
  } = useDisclosure();

  const [date, setDate] = useState<DateValue>();
  const [selectedDate, setSelectedDate] = useState<ZonedDateTime>(
    generateDates()[0]
  );
  const [startTime, setStartTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(getCurrentTime())
  );
  const [endTime, setEndTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(getEndTime(getCurrentTime()))
  );
  const [submitDate, setSubmitDate] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 1 })
  });
  const [refreshComponent, setRefreshComponent] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);

  const [currentRoom, setCurrentRoom] = useState<IRoomByIdResponse>();
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
    const startDate = formatToISO8601(selectedDate);
    const endDate = formatToISO8601(getEndOfDay(selectedDate));

    try {
      const res = await RoomsService.getInstance().getRoomById([
        { name: 'roomId', value: selectedRoom },
        { name: 'startDate', value: startDate },
        { name: 'endDate', value: endDate }
      ]);
      if (res?.roomId) {
        setCurrentRoom(res);
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

  useEffect(() => {
    selectedRoom && getRoom();
  }, [selectedRoom, refreshComponent, selectedDate]);

  useEffect(() => {
    getRoomCompact();
  }, []);

  const handleDateChange = (newDate: any) => {
    const timeZone = getLocalTimeZone();
    const zonedDate = new ZonedDateTime(
      newDate.year,
      newDate.month,
      newDate.day,
      timeZone,
      0,
      newDate.hour,
      newDate.minute,
      newDate.second,
      newDate.millisecond
    );
    setDate(newDate);
    setSelectedDate(zonedDate);
  };

  async function bookDesk() {
    console.log(submitDate?.start?.toString(), 'test1');
    console.log(startTime, 'test2');
    setbtnLoading(true);
    const startDate = convertToISO8601(
      submitDate?.start?.toString(),
      startTime
    );
    const endDate = convertToISO8601(submitDate?.end?.toString(), endTime);

    try {
      const res = await RoomsService.getInstance().bookDesk({
        deskId: selectedDesk?.deskId,
        startDate, // Pass Date object directly
        endDate // Pass Date object directly
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

  return (
    <div className="flex flex-col justify-center items-center">
      <Tabs
        size="lg"
        aria-label="Options"
        selectedKey={selectedRoom}
        onSelectionChange={(e: number) => {
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
                            selectedDate.day === date.day
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() => setSelectedDate(date)}
                        >
                          {`${date.day}/${date.month}/${date.year}`}
                        </Button>
                      ))}
                      <DatePicker
                        onChange={handleDateChange}
                        value={date}
                        className="max-w-[184px]"
                      />
                    </ButtonGroup>
                  </div>
                </div>
                {selectedDesk && (
                  <div className="flex justify-between items-center gap-4 mt-2 w-full">
                    <DateRangePicker
                      aria-label="Date (Controlled)"
                      value={submitDate}
                      allowsNonContiguousRanges
                      onChange={setSubmitDate}
                      size="lg"
                      className="max-w-[384px]"
                      visibleMonths={2}
                      CalendarBottomContent={
                        <div className="flex justify-between items-center gap-2 p-3 w-full">
                          <TimeInput
                            hourCycle={24}
                            hideTimeZone
                            label="Start Time"
                            value={startTime}
                            onChange={setStartTime}
                          />
                          <TimeInput
                            hourCycle={24}
                            hideTimeZone
                            label="End Time"
                            value={endTime}
                            onChange={setEndTime}
                          />
                        </div>
                      }
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
                        Submit
                      </AppHandledBorderedButton>
                    )}
                  </div>
                )}
                <div className="flex justify-center items-center mt-10">
                  <div
                    id="canvas"
                    style={{
                      backgroundRepeat: 'no-repeat'
                    }}
                    className="relative bg-gray-100 border w-[1400px] h-[800px] overflow-auto"
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
              <Spinner size="lg" />
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