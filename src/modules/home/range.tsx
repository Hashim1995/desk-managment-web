/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {
  today,
  parseAbsoluteToLocal,
  getLocalTimeZone
} from '@internationalized/date';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';

import {
  TimeInputValue,
  RangeCalendar,
  TimeInput,
  Tabs,
  Tab,
  Button,
  DatePicker,
  Spinner,
  DateValue,
  RangeValue
} from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { tokenizeImage } from '@/utils/functions/functions';
import DeskItem from './desk-item';
import { IRoomByIdResponse, IDesk } from './types';

export default function Home() {
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 1 })
  });

  const getCurrentTime = () => new Date().toISOString();
  const getEndTime = (startTime: string) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 5);
    return endTime.toISOString();
  };

  const [startTime, setStartTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(getCurrentTime())
  );
  const [endTime, setEndTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(getEndTime(getCurrentTime()))
  );
  const generateDates = (): string[] => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(today, i), 'EEE dd.MM')
    );
  };
  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  const [currentRoom, setCurrentRoom] = useState<IRoomByIdResponse>();
  const [deskList, setDeskList] = useState<IDesk[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<number>();
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const params = useParams();
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);

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

  const convertToISO8601 = (date: string, time: TimeInputValue) => {
    const dateTime = `${date}T${time.toString().split('T')[1].split('+')[0]}`;
    const utcDateTime = new Date(dateTime).toISOString();
    return utcDateTime;
  };

  async function getRoom() {
    setIsSubmitting(true);
    const startDate = convertToISO8601(date?.start?.toString(), startTime);
    const endDate = convertToISO8601(date?.end?.toString(), endTime);

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
  }, [selectedRoom]);
  useEffect(() => {
    getRoomCompact();
  }, []);

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
                    {dates.map(date => (
                      <Button
                        key={date}
                        color={selectedDate === date ? 'primary' : 'default'}
                        onClick={() => setSelectedDate(date)}
                        className="text-xs sm:text-base"
                      >
                        {date}
                      </Button>
                    ))}
                    <DatePicker className="max-w-[284px]" />
                  </div>

                  <form
                    onSubmit={() => getRoom()}
                    className="flex flex-col items-center gap-4 mt-4 w-full"
                  >
                    <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-4 w-full">
                      <RangeCalendar
                        aria-label="Date (Controlled)"
                        value={date}
                        allowsNonContiguousRanges
                        onChange={setDate}
                        color="warning"
                        visibleMonths={2}
                        bottomContent={
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
                    </div>
                    <div className="flex justify-center mt-2 w-full">
                      <AppHandledBorderedButton
                        size="lg"
                        radius="none"
                        type="submit"
                      >
                        Submit
                      </AppHandledBorderedButton>
                    </div>
                  </form>
                </div>
                <div className="flex justify-center items-center">
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
                      className="absolute inset-0 o object-contain"
                    />
                    {/* {deskList.map(desk => (
                      <DeskItem
                        key={desk?.clientId || desk?.deskId}
                        desk={desk}
                      />
                    ))} */}
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
