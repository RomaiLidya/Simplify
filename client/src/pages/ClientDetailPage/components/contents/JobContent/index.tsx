import React, { FC, useState, useEffect } from 'react';
import { Divider, Grid, IconButton, makeStyles, Paper, Theme, Typography } from '@material-ui/core';

import { PopperPlacementType } from '@material-ui/core/Popper';
import CalendarIcon from '@material-ui/icons/EventNote';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useRouter from 'hooks/useRouter';
import useDebounce from 'hooks/useDebounce';
import axios, { CancelTokenSource } from 'axios';
import SearchInput from 'components/SearchInput';
import PositionedPopper from 'components/PositionedPopper';
import JobTable from './components/JobTable';

const useStyles = makeStyles((theme: Theme) => ({
  divider: {
    marginBottom: theme.spacing(4)
  },
  paper: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    margin: 'auto',
    marginTop: 30
  },
  addGrid: {
    textAlign: 'end'
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  },
  headerColumn: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  icon: {
    fontSize: 20
  }
}));

const JobContent: FC = () => {
  const classes = useStyles();
  const { history } = useRouter();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingJob, setSearchingJob] = useState<boolean>(false);
  const [isSearchJobError, setSearchJobError] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobsModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState<HTMLInputElement | null>(null);
  const [placementCalendarPopper, setPlacementCalendarPopper] = useState<PopperPlacementType>();
  const [filterBy, setFilterBy] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [openMenuListPopper, setOpenMenuListPopper] = useState(false);
  const [anchorElMenuListPopper, setAnchorElMenuListPopper] = useState<HTMLInputElement | null>(null);
  const [placementMenuListPopper, setPlacementMenuListPopper] = useState<PopperPlacementType>();

  // Search Job whenever rowsPerPage, currentPage, queryString
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchJob = async () => {
      setSearchingJob(true);
      setSearchJobError(false);

      try {
        //dummy data
        const data = [
          {
            id: 1,
            completed: 1,
            totalJob: 3,
            serviceName: 'General Maintanance',
            startDate: new Date(),
            endDate: new Date(),
            jobType: 'Contract',
            invoiceNo: 'INV0010',
            amount: 220,
            jobStatus: 'Assigned'
          },
          {
            id: 2,
            completed: 2,
            totalJob: 4,
            serviceName: 'General Maintanance',
            startDate: new Date(),
            endDate: new Date(),
            jobType: 'Ad-Hoc',
            invoiceNo: 'INV0011',
            amount: 1220,
            jobStatus: 'Unassigned'
          }
        ];
        setCount(1);
        setJobs(data);
      } catch (err) {
        setSearchJobError(true);
      }

      setSearchingJob(false);
    };

    searchJob();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString]);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  const handleSearch = (searchQuery: string) => {
    performActionAndRevertPage(setQueryString, searchQuery);
  };

  const debouncedSearchTerm = useDebounce(query, 500);
  // Load client data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleViewJob = (clientId: number): React.MouseEventHandler => () => {
    history.push(`/clients/${clientId}`);
  };

  const handleCalendarFilterClick = (event: any) => {
    setOpenCalendarPopper(!openCalendarPopper);
    setAnchorElCalendarPopper(event.currentTarget);
    setPlacementCalendarPopper('bottom-end');
  };

  const handleMenuListClick = (event: any) => {
    setOpenMenuListPopper(!openMenuListPopper);
    setAnchorElMenuListPopper(event.currentTarget);
    setPlacementMenuListPopper('bottom-end');
  };

  return (
    <Grid item xs>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-start' alignItems='center' className={classes.headerColumn}>
              <Typography variant='h4' color='primary'>
                Job Overview
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-end' alignItems='center' className={classes.headerColumn}>
              <SearchInput
                withBorder
                withTransition={false}
                width={150}
                placeHolder='Search Job...'
                iconColor='#989898'
                tableSearchValue={query}
                setTableSearchValue={setQuery}
              />
              {/* <PositionedPopper
                openPopper={openCalendarPopper}
                setOpenPopper={setOpenCalendarPopper}
                anchorEl={anchorElCalendarPopper}
                placement={placementCalendarPopper}
                containerWidth={200}
                fadeTransition={350}
                popperComponent='dateRangePicker'
                options={[{ key: 'StartDate', label: 'Start Date' }, { key: 'EndDate', label: 'End Date' }]}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              /> */}
              <PositionedPopper
                openPopper={openMenuListPopper}
                setOpenPopper={setOpenMenuListPopper}
                anchorEl={anchorElMenuListPopper}
                placement={placementMenuListPopper}
                containerWidth={150}
                fadeTransition={350}
                popperComponent='menus'
                options={[{ key: 'Option1', label: 'Option 1' }, { key: 'Option2', label: 'Option 2' }]}
              />
              <IconButton size='small' onClick={event => handleCalendarFilterClick(event)}>
                <CalendarIcon className={classes.icon} />
              </IconButton>
              <IconButton size='small' onClick={event => handleMenuListClick(event)}>
                <MoreVertIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <JobTable
          isLoadingData={false}
          jobs={jobs}
          count={count}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleChangePage={(event, page) => setCurrentPage(page)}
          handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
          handleViewJob={handleViewJob}
        />
      </Paper>
    </Grid>
  );
};

export default JobContent;
