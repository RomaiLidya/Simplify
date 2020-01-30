import React, { FC, useState, useContext, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import clsx from 'clsx';
import useDebounce from 'hooks/useDebounce';
import { Container, Divider, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { CurrentPageContext } from 'contexts/CurrentPageContext';
import { format } from 'date-fns';
import { JOB_BASE_URL } from 'constants/url';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import useRouter from 'hooks/useRouter';
import ActionSnackbar from 'components/ActionSnackbar';
import CustomizedTabs from 'components/CustomizedTabs';

import JobsTable from './components/JobsTable';

import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  spacing: {
    marginLeft: theme.spacing(1)
  },
  divider: {
    marginBottom: theme.spacing(2)
  },
  paper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: 'auto'
  }
}));

const JobListPage: FC = () => {
  const classes = useStyles();
  const { history } = useRouter();
  const { currentPageTitle } = useContext(CurrentPageContext);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingJob, setSearchingJob] = useState<boolean>(false);
  const [isSearchJobError, setSearchJobError] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobsDetailModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [filterBy, setFilterBy] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [vehicles, setVehicles] = useState<Select[]>([]);
  const [employes, setEmployes] = useState<Select[]>([]);
  const [columnFilter, setColumnFilter] = useState<ColumnFilter[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [isDelete, setDelete] = useState<boolean>(false);

  const [openEditInvoice, setOpenEditInvoice] = useState<boolean>(false);
  const [currentEditingInvoiceIndex, setCurrentEditingInvoiceIndex] = useState<number>(0);

  // Search Contract whenever rowsPerPage, currentPage, queryString, contract, and filterby changes
  const fetchData = useCallback(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      if (selectedTab) {
        params.append('c', selectedTab.toString());
      }

      if (filterBy) {
        if (startDate || endDate) {
          params.append('fb', filterBy.toString());
          params.append('sd', startDate !== null ? format(new Date(startDate), 'yyyy-MM-dd').toString() : '');
          params.append('ed', endDate !== null ? format(new Date(endDate), 'yyyy-MM-dd').toString() : '');
        }
      }

      if (columnFilter.length !== 0) {
        columnFilter.map(value => {
          if (value.columnName === 'vehicleId') {
            return params.append('vi', value.columnValue.toString());
          } else {
            return params.append('i', value.columnValue.toString());
          }
        });
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchJob = async () => {
      setSearchingJob(true);
      setSearchJobError(false);

      try {
        const url = `${JOB_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
       
        console.log('Data', data);

        setJobs(data.jobs);
        setEmployes(data.employes);
        setVehicles(data.vehicles);
        
      } catch (err) {
        setSearchJobError(true);
      }

      setSearchingJob(false);
      setChecked([]);
      setDelete(false);
    };

    searchJob();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString, selectedTab, filterBy, startDate, endDate, columnFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  // Load Job data if search not empty and populate on search list
  const handleSearch = useCallback((searchQuery: string) => {
    performActionAndRevertPage(setQueryString, searchQuery);
  }, []);

  const debouncedSearchTerm = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  // Load contract data if contract data has been deleted
  useEffect(() => {
    if (isDelete) {
      fetchData();
    }
  }, [isDelete, fetchData]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };
  const handleViewJob = (jobId: number): React.MouseEventHandler => () => {
    history.push({ pathname: `/jobs/${jobId}`, state: { selectedTab: 0 } });
  };
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const detailDate = format(new Date(), 'cccc, dd MMMM yyyy').toString();
  const renderGreeting = () => {
    const now = format(new Date(), 'aa').toString();
    if (now === 'AM') {
      return 'Good Morning,';
    } else if (now === 'PM') {
      return 'Good Afternoon,';
    }
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
       <Typography variant='h4' color='primary' display='inline'>
        {renderGreeting()} Admin
      </Typography>
      <Typography variant='body1' color='primary' display='inline' className={classes.spacing}>
        {detailDate}
      </Typography>
      <Divider className={classes.divider} />
      <CustomizedTabs
        tabs={[{ id: 0, name: 'Unassigned' }, { id: 1, name: 'Assigned' }, { id: 2, name: 'Completed' }, { id: 3, name: 'Overdue' }, { id: 4, name: 'All' }]}
        selectedTabId={selectedTab}
        onSelect={(tabId: number) => performActionAndRevertPage(setSelectedTab, tabId)}
      />
      <Paper className={classes.paper}>
        <JobsTable
          isLoadingData={isSearchingJob} 
          jobs={jobs} 
          count={count}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          handleChangePage={(event, page) => setCurrentPage(page)}
          handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
          vehicles={vehicles}
          employes={employes}
          setDelete={setDelete}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleSetMessageSuccess={handleSetMessageSuccess}
          handleSetMessageError={handleSetMessageError}
          handleViewJob={handleViewJob}
          query={query}
  setQuery={setQuery}
  filterBy={filterBy}
  setFilterBy={setFilterBy}
  startDate={startDate}
  setStartDate={setStartDate}
  endDate={endDate}
  setEndDate={setEndDate}
  columnFilter={columnFilter}
  setColumnFilter={setColumnFilter}
  checked={checked}
  setChecked={setChecked}
  
        />
       
        <ActionSnackbar
          variant={snackbarVarient}
          message={snackbarVarient === 'success' ? messageSuccess : messageError}
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
        />
      </Paper>
    </Container>
  );
};

export default JobListPage;
