/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  today,
  getLocalTimeZone,
  ZonedDateTime,
  now
} from '@internationalized/date';
import { format, formatISO } from 'date-fns';
import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Button,
  DatePicker,
  Spinner,
  DateValue
} from '@nextui-org/react';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';
import { tokenizeImage } from '@/utils/functions/functions';
import DeskItem from './desk-item';
import { IRoomByIdResponse, IDesk } from './types';

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

export default function Home() {
  const [date, setDate] = useState<DateValue>();
  const [selectedDate, setSelectedDate] = useState<ZonedDateTime>(
    generateDates()[0]
  );
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
  }, [selectedRoom, selectedDate]);

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
    const startDate = formatToISO8601(selectedDate);
    const endDate = formatToISO8601(getEndOfDay(selectedDate));
    try {
      const res = await RoomsService.getInstance().bookDesk({
        deskId: selectedDesk?.deskId,
        startDate,
        endDate
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Tabs
        aria-label="Options"
        selectedKey={selectedRoom}
        onSelectionChange={(e: number) => {
          setSelectedRoom(e);
        }}
      >
        {roomList?.map(z => (
          <Tab key={z?.id} title={z?.name}>
            {!isSubmitting ? (
              <>
                <div className="flex flex-col items-center p-4">
                  <div className="flex items-center gap-2">
                    {generateDates()?.map((date, index) => (
                      <Button
                        key={`${index}`}
                        color={
                          selectedDate.day === date.day ? 'primary' : 'default'
                        }
                        onClick={() => setSelectedDate(date)}
                        className="text-xs sm:text-base"
                      >
                        {`${date.day}/${date.month}/${date.year}`}
                      </Button>
                    ))}
                    <DatePicker
                      onChange={handleDateChange}
                      value={date}
                      className="max-w-[184px]"
                    />
                  </div>
                </div>
                {selectedDesk && (
                  <div className="flex justify-center mt-2 w-full">
                    <AppHandledBorderedButton
                      size="lg"
                      radius="none"
                      type="submit"
                      onClick={() => bookDesk()}
                    >
                      Submit
                    </AppHandledBorderedButton>
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
              </>
            ) : (
              <Spinner />
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
