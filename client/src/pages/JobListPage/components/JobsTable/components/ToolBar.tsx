import React, { FC, Fragment, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Grid, IconButton, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import { PopperPlacementType } from '@material-ui/core/Popper';

import CalendarIcon from '@material-ui/icons/EventNote';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import PositionedPopper from 'components/PositionedPopper';
import SearchInput from 'components/SearchInput';

interface Props {
  isProcessing: boolean;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  filterBy: string;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  vehicles: Select[];
  employes: Select[];
  columnFilter: ColumnFilter[];
  setColumnFilter: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  checked: number[];
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  headerFlex: {
    display: 'flex'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1.5)
  },
  toolbarTable: {
    backgroundColor: '#E7F4F8',
    paddingBottom: theme.spacing(0.9)
  },
  headerColor: {
    color: '#53A0BE'
  },
  icon: {
    fontSize: 20
  },
  leftHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  rightHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(1.5)
  }
}));
const ToolBar: FC<Props> = props => {
  const classes = useStyles();

  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState<HTMLElement | null>(null);
  const [placementCalendarPopper, setPlacementCalendarPopper] = useState<PopperPlacementType>();

  const [openCheckboxMenusPopper, setOpenCheckboxMenusPopper] = useState(false);
  const [anchorElCheckboxMenusPopper, setAnchorElCheckboxMenusPopper] = useState<HTMLElement | null>(null);
  const [placementCheckboxMenusPopper, setPlacementCheckboxMenusPopper] = useState<PopperPlacementType>();

  const { isProcessing, vehicles, employes, checked, setOpenDialog, setMessage } = props;
  const { query, setQuery } = props;
  const { filterBy, setFilterBy } = props;
  const { startDate, setStartDate } = props;
  const { endDate, setEndDate } = props;
  const { columnFilter, setColumnFilter } = props;

  const countChecked = checked.length;

  const handleCalendarFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenCalendarPopper(!openCalendarPopper);
    setAnchorElCalendarPopper(event.currentTarget);
    setPlacementCalendarPopper('bottom-end');
  };

  const handleMenuListClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenCheckboxMenusPopper(!openCheckboxMenusPopper);
    setAnchorElCheckboxMenusPopper(event.currentTarget);
    setPlacementCheckboxMenusPopper('bottom-end');
  };

  const openBulkDeleteDialog = () => {
    setOpenDialog(true);
    setMessage('Are you sure you want to bulk delete this?');
  };

  const renderHeaderLabel = () => {
    if (filterBy) {
      if (filterBy === 'startTime' && startDate && endDate) {
        return (
          <Typography variant='h6' color='primary'>
            (by start date {format(new Date(startDate), 'dd/MM/yyyy')} - {format(new Date(endDate), 'dd/MM/yyyy')})
          </Typography>
        );
      } else if (filterBy === 'endTime' && startDate && endDate) {
        return (
          <Typography variant='h6' color='primary'>
            (by end date {format(new Date(startDate), 'dd/MM/yyyy')} - {format(new Date(endDate), 'dd/MM/yyyy')})
          </Typography>
        );
      }
    }
  };

  const renderLeftHeader = () => {
    return (
      <div className={classes.headerFlex}>
        <div className={classes.otherTextCell}>
          {countChecked !== 0 ? (
            <Typography variant='h5' color='primary' className={classes.headerColor}>
              {`${countChecked} selected`}
            </Typography>
          ) : (
            <div>
              <Typography variant='h5' color='primary'>
                Job List Overview
              </Typography>
              {renderHeaderLabel()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRightHeader = () => {
    if (countChecked !== 0) {
      return (
        <Tooltip title='Delete' placement='top'>
          <IconButton size='small' onClick={openBulkDeleteDialog} disabled={isProcessing}></IconButton>
        </Tooltip>
      );
    } else {
      return (
        <Fragment>
          <SearchInput
            withBorder
            withTransition={false}
            width={150}
            placeHolder='Search Job...'
            iconColor='#989898'
            tableSearchValue={query}
            setTableSearchValue={setQuery}
          />
          <PositionedPopper
            openPopper={openCalendarPopper}
            setOpenPopper={setOpenCalendarPopper}
            anchorEl={anchorElCalendarPopper}
            placement={placementCalendarPopper}
            containerWidth={200}
            fadeTransition={350}
            popperComponent='dateRangePicker'
            options={[
              { key: 'startTime', label: 'Today' },
              { key: 'endTime', label: 'Tomorrow' },
              { key: 'endTime', label: 'This Week' },
              { key: 'endTime', label: 'This Month' },
              { key: 'endTime', label: 'Custom Date' }
            ]}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <PositionedPopper
            openPopper={openCheckboxMenusPopper}
            setOpenPopper={setOpenCheckboxMenusPopper}
            anchorEl={anchorElCheckboxMenusPopper}
            placement={placementCheckboxMenusPopper}
            containerWidth={300}
            fadeTransition={350}
            popperComponent='checkBoxMenus'
            options={[{ key: 'vehicleId', label: 'Vehicle', checkBoxList: vehicles }, { key: 'employeId', label: 'Employe', checkBoxList: employes }]}
            columnFilter={columnFilter}
            setColumnFilter={setColumnFilter}
          />
          <Tooltip title='Calendar filter' placement='top'>
            <IconButton size='small' onClick={event => handleCalendarFilterClick(event)}>
              <CalendarIcon className={classes.icon} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Column filter' placement='top'>
            <IconButton size='small' onClick={event => handleMenuListClick(event)}>
              <FilterIcon className={classes.icon} />
            </IconButton>
          </Tooltip>
        </Fragment>
      );
    }
  };

  console.log(' renderRightHeader', renderRightHeader);

  let isChecked;
  if (countChecked === 0) {
    isChecked = false;
  } else {
    isChecked = true;
  }

  return (
    <Grid container spacing={2} className={clsx({ [classes.toolbarTable]: isChecked })}>
      <Grid item xs={6}>
        <Grid container direction='row' justify='flex-start' alignItems='center' className={classes.leftHeader}>
          {renderLeftHeader()}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container direction='row' justify='flex-end' alignItems='center' className={classes.rightHeader}>
          {renderRightHeader()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ToolBar;
