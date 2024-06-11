/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RangeCalendar, TimeInput, TimeInputValue } from '@nextui-org/react';
import type { DateValue } from '@react-types/calendar';
import type { RangeValue } from '@react-types/shared';
import {
  today,
  parseAbsoluteToLocal,
  getLocalTimeZone
} from '@internationalized/date';

import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';

interface FormValues {
  startDate: any;
  startTime: any;
  endDate: any;
  endTime: any;
}

function DateList(): React.ReactElement {
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
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {}
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* <Divider className="my-4 w-full" /> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 mt-4 w-full"
      >
        <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-4 w-full">
          <RangeCalendar
            aria-label="Date (Controlled)"
            value={date}
            onChange={setDate}
            color="warning"
            visibleMonths={1}
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
          <AppHandledBorderedButton size="lg" radius="none" type="submit">
            Submit
          </AppHandledBorderedButton>
        </div>
      </form>
    </div>
  );
}

export default DateList;
