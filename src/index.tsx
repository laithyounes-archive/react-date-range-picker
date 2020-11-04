import * as React from 'react'
import {
  addMonths,
  isSameDay,
  isWithinRange,
  isAfter,
  isBefore,
  isSameMonth,
  addYears,
  max,
  min
} from 'date-fns'
import { Theme } from '@material-ui/core'
import { DateRange, NavigationAction, DefinedRange } from './types'
import Menu from './components/Menu'
import { defaultRanges } from './defaults'
import { parseOptionalDate } from './utils'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const defaultTheme = createMuiTheme({})

type Marker = symbol

export const MARKERS: { [key: string]: Marker } = {
  FIRST_MONTH: Symbol('firstMonth'),
  SECOND_MONTH: Symbol('secondMonth')
}

const getValidatedMonths = (range: DateRange, minDate: Date, maxDate: Date) => {
  const { startDate, endDate } = range
  if (startDate && endDate) {
    const newStart = max(startDate, minDate)
    const newEnd = min(endDate, maxDate)

    return [
      newStart,
      isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd
    ]
  } else {
    return [startDate, endDate]
  }
}

interface DateRangePickerProps {
  open: boolean
  initialDateRange?: DateRange
  definedRanges?: DefinedRange[]
  minDate?: Date | string
  maxDate?: Date | string
  onChange: (dateRange: DateRange) => void
  past?: Boolean
  theme?: Theme
  elevation?: number
  dateInput?: Boolean
}

const DateRangePickerImpl: React.FunctionComponent<DateRangePickerProps> = (
  props
) => {
  const today = new Date()

  const {
    open,
    onChange,
    initialDateRange,
    minDate,
    maxDate,
    definedRanges = defaultRanges,
    past,
    theme = defaultTheme,
    elevation,
    dateInput
  } = props

  const minDateValid = parseOptionalDate(minDate, addYears(today, -10))
  const maxDateValid = parseOptionalDate(maxDate, addYears(today, 10))
  const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(
    initialDateRange || {},
    minDateValid,
    maxDateValid
  )

  // console.log("rendering DateRangePicker");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    ...initialDateRange
  })
  const [hoverDay, setHoverDay] = React.useState<Date>()
  const [firstMonth, setFirstMonth] = React.useState<Date>(
    intialFirstMonth || (past ? addMonths(today, -1) : today)
  )
  const [secondMonth, setSecondMonth] = React.useState<Date>(
    initialSecondMonth || past
      ? addMonths(today, 1) > new Date()
        ? today
        : addMonths(today, 1)
      : addMonths(firstMonth, 1)
  )

  const { startDate, endDate } = dateRange

  // handlers
  const setFirstMonthValidated = (date: Date) => {
    if (isBefore(date, secondMonth)) {
      setFirstMonth(date)
    }
  }

  const setSecondMonthValidated = (date: Date) => {
    if (isAfter(date, firstMonth)) {
      setSecondMonth(date)
    }
  }

  const setDateRangeValidated = (range: DateRange) => {
    let { startDate: newStart, endDate: newEnd } = range
    if (newStart && newEnd) {
      range.startDate = newStart = max(newStart, minDateValid)
      range.endDate = newEnd = min(newEnd, maxDateValid)
      setDateRange(range)
      onChange(range)
      setFirstMonth(newStart)
      setSecondMonth(
        isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd
      )
    }
  }

  const onDayClick = (day: Date) => {
    if (startDate && !endDate && !isBefore(day, startDate)) {
      const newRange = { startDate, endDate: day }
      onChange(newRange)
      setDateRange(newRange)
    } else {
      setDateRange({ startDate: day, endDate: undefined })
    }
    setHoverDay(day)
  }

  const onSingleDayClick = (day: Date, isFirst: Boolean) => {
    if (isFirst) {
      setDateRange({ startDate: day, endDate: endDate })
    } else {
      setDateRange({ startDate: startDate, endDate: day })
    }
  }

  const onMonthNavigate = (marker: Marker, action: NavigationAction) => {
    if (marker == MARKERS.FIRST_MONTH) {
      const firstNew = addMonths(firstMonth, action)
      setFirstMonth(firstNew)
    } else {
      const secondNew = addMonths(secondMonth, action)
      setSecondMonth(secondNew)
    }
  }

  const onDayHover = (date: Date) => {
    if (startDate && !endDate) {
      if (!hoverDay || !isSameDay(date, hoverDay)) {
        setHoverDay(date)
      }
    }
  }

  // helpers
  const inHoverRange = (day: Date) => {
    return (startDate &&
      !endDate &&
      hoverDay &&
      isAfter(hoverDay, startDate) &&
      isWithinRange(day, startDate, hoverDay)) as boolean
  }

  const helpers = {
    inHoverRange
  }

  const handlers = {
    onDayClick,
    onDayHover,
    onMonthNavigate
  }

  return open ? (
    <ThemeProvider theme={theme}>
      <Menu
        onSingleDayClick={onSingleDayClick}
        dateInput={dateInput}
        elevation={elevation}
        dateRange={dateRange}
        minDate={minDateValid}
        maxDate={maxDateValid}
        ranges={definedRanges}
        firstMonth={firstMonth}
        secondMonth={secondMonth}
        setFirstMonth={setFirstMonthValidated}
        setSecondMonth={setSecondMonthValidated}
        setDateRange={setDateRangeValidated}
        helpers={helpers}
        handlers={handlers}
      />
    </ThemeProvider>
  ) : null
}

export type DateRangeType = DateRange
export type DefinedRangeType = DefinedRange

export const DateRangePicker = DateRangePickerImpl
