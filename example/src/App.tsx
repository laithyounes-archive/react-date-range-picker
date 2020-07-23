import React from 'react'

import { DateRangePicker } from 'react-date-range-picker'
import {
  addDays,
  addMonths
} from "date-fns";
import 'react-date-range-picker/dist/index.css'


export default function DateRangePickerStory() {
  const date = new Date();
  return (
    <DateRangePicker
      open={true}
      definedRanges={[
        {
          label: "Last 1 Day",
          startDate: addDays(date, -1),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 3 Days",
          startDate: addDays(date, -3),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 7 Days",
          startDate: addDays(date, -7),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 14 Days",
          startDate: addDays(date, -14),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 30 Days",
          startDate: addDays(date, -30),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 90 Days",
          startDate: addDays(date, -90),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 180 Days",
          startDate: addDays(date, -180),
          endDate: addDays(date, -1)
        },
        {
          label: "Last 365 Days",
          startDate: addMonths(date, -12),
          endDate: addDays(date, -1)
        }
      ]}
      maxDate={addDays(new Date(), -1)}
      past={true}
      // initialDateRange={[addDays(new Date(), -1), addDays(new Date(), -3)]}
      onChange={(dateRange) => console.log(dateRange)}
    />
  )
};

