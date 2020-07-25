import React from 'react'
import {
  Paper,
  Grid,
  Typography,
  Divider,
  createStyles,
  WithStyles,
  Theme,
  withStyles,
  Input
} from '@material-ui/core'
import { format, differenceInCalendarMonths } from 'date-fns'
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt'
import Month from './Month'
import DefinedRanges from './DefinedRanges'
import { DateRange, DefinedRange, Setter, NavigationAction } from '../types'
import { MARKERS } from '..'
import { inDateRange } from '../utils'
const InputMask = require('react-input-mask')
const moment = require('moment')

const styles = (theme: Theme) =>
  createStyles({
    rootContainer: {
      width: 'fit-content'
    },
    header: {
      padding: '20px 70px'
    },
    headerItem: {
      flex: 1,
      textAlign: 'center'
    },
    divider: {
      borderLeft: `1px solid ${theme.palette.action.hover}`
    }
  })

interface MenuProps extends WithStyles<typeof styles> {
  dateRange: DateRange
  ranges: DefinedRange[]
  minDate: Date
  maxDate: Date
  firstMonth: Date
  secondMonth: Date
  elevation?: number
  dateInput?: Boolean
  setFirstMonth: Setter<Date>
  setSecondMonth: Setter<Date>
  setDateRange: Setter<DateRange>
  helpers: {
    inHoverRange: (day: Date) => boolean
  }
  handlers: {
    onDayClick: (day: Date) => void
    onDayHover: (day: Date) => void
    onMonthNavigate: (marker: symbol, action: NavigationAction) => void
  }
}

const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const {
    classes,
    ranges,
    dateRange,
    minDate,
    maxDate,
    firstMonth,
    setFirstMonth,
    secondMonth,
    setSecondMonth,
    setDateRange,
    helpers,
    handlers,
    elevation = 5,
    dateInput = false
  } = props
  const { startDate, endDate } = dateRange
  const [fromError, setFromError] = React.useState(false)
  const canNavigateCloser =
    differenceInCalendarMonths(secondMonth, firstMonth) >= 2
  function InputMaskCustom(props: any) {
    return (
      <InputMask
        style={{ textAlign: 'center' }}
        mask='99 / 99 / 9999'
        maskPlaceholder={' '}
        alwaysShowMask={false}
        {...props}
      />
    )
  }
  const commonProps = { dateRange, minDate, maxDate, helpers, handlers }
  function handleDateInput(dateInput: string, start: boolean) {
    if (moment(dateInput, 'DD/MM/YYYY').isValid()) {
      if (
        !inDateRange(
          { startDate: minDate, endDate: endDate },
          moment(dateInput, 'DD/MM/YYYY').format()
        )
      ) {
        return setFromError(true)
      }
      setDateRange(
        start
          ? {
              endDate,
              startDate: moment(dateInput, 'DD/MM/YYYY').format()
            }
          : {
              startDate,
              endDate: moment(dateInput, 'DD/MM/YYYY').format()
            }
      )
    }
  }
  function isCursorDone(position: any) {
    return position === 5 || position === 10 || position === 14
  }
  return (
    <Paper className={classes.rootContainer} elevation={elevation} square>
      <Grid container direction='row' wrap='nowrap'>
        <Grid>
          <Grid container className={classes.header} alignItems='center'>
            <Grid item className={classes.headerItem}>
              {dateInput ? (
                <Input
                  defaultValue={
                    startDate ? format(startDate, 'DD/MM/YYYY') : 'Start Date'
                  }
                  onChange={(e) =>
                    isCursorDone(e.target.selectionEnd) &&
                    handleDateInput(e.target.value, true)
                  }
                  type='tel'
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      const target = e.currentTarget as HTMLInputElement
                      handleDateInput(target.value, true)
                    }
                  }}
                  onBlur={(e) => handleDateInput(e.target.value, true)}
                  error={fromError}
                  inputComponent={InputMaskCustom}
                />
              ) : (
                <Typography variant='subtitle1'>
                  {startDate
                    ? format(startDate, 'MMMM DD, YYYY')
                    : 'Start Date'}
                </Typography>
              )}
            </Grid>
            <Grid item className={classes.headerItem}>
              <ArrowRightAlt color='action' />
            </Grid>
            <Grid item className={classes.headerItem}>
              {dateInput ? (
                <Input
                  defaultValue={
                    endDate ? format(endDate, 'DD/MM/YYYY') : 'End Date'
                  }
                  type='tel'
                  onChange={(e) =>
                    isCursorDone(e.target.selectionEnd) &&
                    handleDateInput(e.target.value, false)
                  }
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      const target = e.currentTarget as HTMLInputElement
                      handleDateInput(target.value, false)
                    }
                  }}
                  onBlur={(e) => handleDateInput(e.target.value, false)}
                  inputComponent={InputMaskCustom}
                />
              ) : (
                <Typography variant='subtitle1'>
                  {endDate ? format(endDate, 'MMMM DD, YYYY') : 'Start Date'}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Divider />
          <Grid container direction='row' justify='center' wrap='nowrap'>
            <Month
              {...commonProps}
              value={firstMonth}
              setValue={setFirstMonth}
              navState={[true, canNavigateCloser]}
              marker={MARKERS.FIRST_MONTH}
            />
            <div className={classes.divider} />
            <Month
              {...commonProps}
              value={secondMonth}
              setValue={setSecondMonth}
              navState={[canNavigateCloser, true]}
              marker={MARKERS.SECOND_MONTH}
            />
          </Grid>
        </Grid>
        <div className={classes.divider} />
        <Grid>
          <DefinedRanges
            selectedRange={dateRange}
            ranges={ranges}
            setRange={setDateRange}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default withStyles(styles)(Menu)
