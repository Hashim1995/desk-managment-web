/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import { selectOption } from '@/models/common';
import i18next from 'i18next';

/**
 * Gender options for selection.
 */
const genderOptions: selectOption[] = [
  {
    value: 1,
    label: i18next.t('male')
  },
  {
    value: 2,
    label: i18next.t('female')
  }
];





/**
 * Creates an array of objects representing days of the month.
 * Each object contains a value and label representing the day.
 * @returns {Array<{ value: string, label: string }>} The array of days.
 */
function createDaysArray(): Array<{ value: string; label: string }> {
  const daysArray = [];
  for (let day = 1; day <= 31; day++) {
    daysArray.push({ value: day?.toString(), label: day.toString() });
  }
  return daysArray;
}

/**
 * Creates an array of years between the specified start and end years.
 * @param startYear The start year of the array. Default is 1940.
 * @param endYear The end year of the array. Default is 2023.
 * @returns {Array<{ value: string, label: string }>} The array of days.
 */
function createYearsArray(
  startYear = 2010,
  endYear = 2050
): Array<{ value: string; label: string }> {
  const yearsArray = [];
  for (let year = startYear; year <= endYear; year++) {
    yearsArray.push({ value: year?.toString(), label: `${year}` });
  }
  return yearsArray;
}

/**
 * Retrieves an array of months with their corresponding values.
 * @returns {Array<{ value: string, label: string }>} The array of days.
 */
function getMonthsArray(): Array<{ value: string; label: string }> {
  const months: string[] = i18next.t('months', { returnObjects: true });

  return months.map((month, index) => ({
    value: (index + 1)?.toString(),
    label: month
  }));
}

const monthsList = getMonthsArray();
const daysList = createDaysArray();
const yearsList = createYearsArray();

export {
  genderOptions,
  daysList,
  yearsList,
  monthsList,
};
