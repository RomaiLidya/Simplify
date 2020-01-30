import React, { FC, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Button, ClickAwayListener, Grid, MenuItem, TextField, Theme } from '@material-ui/core';
import { Option } from 'components/PositionedPopper';

interface Props {
  setOpenPopper: React.Dispatch<React.SetStateAction<boolean>>;
  options: Option[];
  filterBy?: string;
  setFilterBy?: React.Dispatch<React.SetStateAction<string>>;
  startDate?: Date | null;
  setStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate?: Date | null;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  clearButton: {
    color: '#89BED3',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#53A0BE'
    },
    padding: theme.spacing(0)
  },
  textFieldFont: {
    fontSize: '12px',
    height: 18
  }
}));

const ClearButton = withStyles({
  label: {
    textTransform: 'capitalize',
    marginLeft: 25
  }
})(Button);

const DateRangePicker: FC<Props> = props => {
  const classes = useStyles(props);
  const { setOpenPopper, options } = props;
  const { filterBy, setFilterBy } = props;
  const { startDate, setStartDate } = props;
  const { endDate, setEndDate } = props;

  const [selectedFilterBy, setSelectedFilterBy] = useState<string>(filterBy === undefined ? '' : filterBy);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDate === undefined ? new Date() : startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate === undefined ? new Date() : endDate);
  const [disabledDate, setDisabledDate] = useState(filterBy === undefined || filterBy === '' ? true : false);

  const handleFilterByChange = (event: any) => {
    setSelectedFilterBy(event.target.value);
    if (event.target.value === '') {
      setDisabledDate(true);
    } else {
      setDisabledDate(false);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
  };

  const handleClickClearButton = () => {
    setSelectedFilterBy('');
    setSelectedStartDate(new Date());
    setSelectedEndDate(new Date());
  };

  const handleCloseCalendarPopper = () => {
    setOpenPopper(false);
  };

  const handleDoneCalendarPopper = () => {
    setFilterBy && setFilterBy(selectedFilterBy);
    setStartDate && setStartDate(selectedStartDate);
    setEndDate && setEndDate(selectedEndDate);
    handleCloseCalendarPopper();
  };

  return (
    <ClickAwayListener onClickAway={handleCloseCalendarPopper}>
      <div>
        <Grid container direction='row' justify='flex-end' alignItems='flex-start'>
          <ClearButton size='small' className={classes.clearButton} onClick={handleClickClearButton} disableRipple>
            Clear
          </ClearButton>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <TextField
              select
              margin='dense'
              fullWidth
              id='option'
              label='Choose'
              value={selectedFilterBy}
              onChange={event => handleFilterByChange(event)}
              variant='outlined'
              autoComplete='off'
              InputProps={{
                classes: {
                  input: classes.textFieldFont
                }
              }}
              InputLabelProps={{
                className: classes.textFieldFont,
                shrink: selectedFilterBy === '' ? false : true
              }}
            >
              <MenuItem key={'None'} value=''>
                <em>None</em>
              </MenuItem>
              {options.map(option => (
                <MenuItem key={option.key} value={option.key}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                fullWidth
                autoOk
                allowKeyboardControl
                disabled={disabledDate}
                margin='dense'
                id='startDate'
                value={selectedStartDate}
                variant='inline'
                inputVariant='outlined'
                format='dd/MM/yyyy'
                onChange={handleStartDateChange}
                InputProps={{
                  classes: {
                    input: classes.textFieldFont
                  }
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                fullWidth
                autoOk
                allowKeyboardControl
                disabled={disabledDate}
                margin='dense'
                id='endDate'
                value={selectedEndDate}
                variant='inline'
                inputVariant='outlined'
                format='dd/MM/yyyy'
                onChange={handleEndDateChange}
                InputProps={{
                  classes: {
                    input: classes.textFieldFont
                  }
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant='contained' color='primary' onClick={handleDoneCalendarPopper}>
              Done
            </Button>
          </Grid>
        </Grid>
      </div>
    </ClickAwayListener>
  );
};

export default DateRangePicker;
