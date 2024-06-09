/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Card,
  Divider,
  DatePicker,
  Input,
  CardBody,
  DateValue
} from '@nextui-org/react';
import { format, addDays } from 'date-fns';
import { parseDate } from '@internationalized/date';
import AppHandledDatePicker from '@/components/forms/date/app-handled-date-picker';
import { selectPlaceholderText } from '@/utils/constants/texts';
import { t } from 'i18next';
import AppHandledTimePicker from '@/components/forms/time/app-handled-time-picker';
import AppHandledSelect from '@/components/forms/select/handled-select';

interface FormValues {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  room: any;
}

function DateList(): React.ReactElement {
  const generateDates = (): string[] => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(today, i), 'EEE dd.MM')
    );
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);

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
      <div className="flex flex-wrap justify-center gap-3 mb-4 w-full">
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
      </div>

      <Divider className="my-4 w-full" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 mt-4 w-full"
      >
        <AppHandledSelect
          className="w-80"
          isInvalid={Boolean(errors.room?.message)}
          // selectProps={{
          //   id: 'room',
          //   isLoading: !roomInformationList?.data,
          //   isDisabled: !roomInformationList?.data
          // }}
          name="room"
          options={[]}
          label={selectPlaceholderText(t('room'))}
          control={control}
          errors={errors}
        />
        <div className="flex sm:flex-row flex-col gap-4 mb-4 w-full">
          <div className="border-gray-300 sm:pr-4 sm:border-r w-full sm:w-1/2">
            <div className="mb-4 w-full">
              <AppHandledDatePicker
                variant="flat"
                name="startDate"
                selectProps={{
                  id: 'startDate'
                }}
                control={control}
                label={selectPlaceholderText(t('startDate'))}
                className="app-select text-base sm:text-xl"
                errors={errors}
              />
            </div>
            <div className="w-full">
              <AppHandledTimePicker
                name="startTime"
                variant="flat"
                selectProps={{
                  id: 'startTime'
                }}
                control={control}
                label={selectPlaceholderText(t('startTime'))}
                className="app-select text-base sm:text-xl"
                errors={errors}
              />
            </div>
          </div>
          <div className="sm:pl-4 w-full sm:w-1/2">
            <div className="mb-4 w-full">
              <AppHandledDatePicker
                variant="flat"
                name="endDate"
                selectProps={{
                  id: 'endDate'
                }}
                control={control}
                label={selectPlaceholderText(t('endDate'))}
                className="app-select text-base sm:text-xl"
                errors={errors}
              />
            </div>
            <div className="w-full">
              <AppHandledTimePicker
                name="endtime"
                variant="flat"
                selectProps={{
                  id: 'endtime'
                }}
                control={control}
                label={selectPlaceholderText(t('endtime'))}
                className="app-select text-base sm:text-xl"
                errors={errors}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2 w-full">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 shadow px-6 py-2 rounded-md text-white"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DateList;
