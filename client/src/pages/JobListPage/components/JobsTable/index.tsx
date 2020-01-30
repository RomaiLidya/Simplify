import React, { FC, Fragment, useState, useEffect } from 'react';

import axios from 'axios';

import { GET_DELETE_JOBS } from 'constants/url';
import { StandardConfirmationDialog } from 'components/AppDialog';
import { createStyles, makeStyles, Table, TableBody, TableHead } from '@material-ui/core';

import BodyRow from './components/BodyRow';
import HeaderRow from 'components/HeaderRow';
import TablePagination from 'components/TablePagination';
import ToolBar from './components/ToolBar';
 
interface Props {
  isLoadingData: boolean;//  
  jobs: JobsDetailModel[];//
  count: number;//
  currentPage: number;//
  rowsPerPage: number;//
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;//
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;//
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  filterBy: string;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  vehicles: Select[];//
  employes: Select[];//
  columnFilter: ColumnFilter[];
  setColumnFilter: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  checked: number[];
  setChecked: React.Dispatch<React.SetStateAction<number[]>>;
  setDelete: React.Dispatch<React.SetStateAction<boolean>>//;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;//
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;//
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  handleViewJob: (jobIndex: number) => React.MouseEventHandler;//
  
}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      overflowX: 'auto'
    }
  })
);

const JobsTable: FC<Props> = props => {
  const classes = useStyles();

  const {
    isLoadingData,
    jobs,
    count,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    vehicles,
    employes,
    setDelete,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    handleViewJob
   
  } = props;
  

  const { checked, setChecked } = props;
  const { query, setQuery } = props;
  const { filterBy, setFilterBy } = props;
  const { startDate, setStartDate } = props;
  const { endDate, setEndDate } = props;
  const { columnFilter, setColumnFilter } = props;

  const dummyJob: JobsDetailModel = {
    
    jobId: 0,
    clientId: 0,
    clientName: '',
    serviceAddress: '',
    startTime: new Date(),
    endTime: new Date(),
    Datee: new Date(),
    vehicleNo: 0,
    carplateNumber: '',
    displayName: '',
    contractId: 0,
    userProfileId: 0,
    vehicleId :0,

    Type: ''
     };

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoadingData) {
      timeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);
    }

    setShowSkeleton(false);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoadingData]);


 

  const checkAll = () => {
    const newBulkChecked = [...checked];
    const countChecked = newBulkChecked.length;
    if (count > rowsPerPage) {
      if (countChecked !== rowsPerPage) {
        newBulkChecked.splice(0, countChecked);
        jobs.map(job => newBulkChecked.push(job.jobId));
      } else {
        newBulkChecked.splice(0, count);
      }
    } else {
      if (countChecked !== count) {
        newBulkChecked.splice(0, countChecked);
        jobs.map(job => newBulkChecked.push(job.jobId));
      } else {
        newBulkChecked.splice(0, count);
      }
    }
    setChecked(newBulkChecked);
  };
 

  const individualCheck = (id: number) => {
    const newChecked = [...checked];
    // count element in object selected filter for check already exist or not
    const countElement = newChecked.filter(newCheckedValue => newCheckedValue === id).length;
    if (countElement === 0) {
      newChecked.push(id);
    } else {
      // check index of element and remove object by index
      const checkedFilterIndex = newChecked.map(newCheckedValue => newCheckedValue).indexOf(id);
      newChecked.splice(checkedFilterIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const actionWrapper = async (action: () => Promise<void>, actionMessage: string) => {
    setProcessing(true);

    try {
      await action();
      handleCloseDialog();
      setDelete(true);
      handleSetMessageSuccess(`Successfully ${actionMessage}`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
    } catch (err) {
      handleCloseDialog();
      handleSetMessageError(`Failed to ${actionMessage}`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setProcessing(false);
  };

  const deleteContract = async (selectedId: number) => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_JOBS([selectedId]));
    }, 'delete jobs');
  };

  const bulkDeleteContract: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_JOBS(checked));
    }, 'bulk delete jobs');

    setChecked([]);
  };

  // headerNameWithPaddings['headerName:pL:pR:pT:pB']
  return (
    <Fragment>
      <ToolBar
        isProcessing={isProcessing}
        query={query}
        setQuery={setQuery}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
       vehicles={vehicles}
       employes={employes}
        columnFilter={columnFilter}
        setColumnFilter={setColumnFilter}
        checked={checked}
        setOpenDialog={setOpenDialog}
        setMessage={setMessage}
      />
      <div className={classes.tableWrapper}>
        <Table>
          <TableHead>
            <HeaderRow
              headers={[
                { label: 'CheckBox', pR: '10px', pT: '7px', verticalAlign: 'top', isCheckBox: true, checked, rowsPerPage, handleCheckAll: checkAll },
                { label: 'Job ID', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Client Name', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Service Address', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Start Time - End Time', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Vehicle No', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Employee', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Type', pL: '10px', pR: '10px', verticalAlign: 'top' },
                { label: 'Action', pL: '10px', verticalAlign: 'top' }
              ]}
            />
          </TableHead>
          <TableBody>
          {console.log('showSkeleton', showSkeleton)}
          {console.log('jobs', jobs)}
{/*         
            {showSkeleton
              && ( jobs.map((job, index) => (
                  <BodyRow
                    isLoadingData={isLoadingData}
                    setSelectedId={setSelectedId}
                    key={job.id}
                    job={dummyJob}
                    checked={checked}
                    handleIndividualCheck={individualCheck}
                   />
                )))} */} 

{showSkeleton
              ? [1, 2, 3, 4, 5].map((value, index) => (
                  <BodyRow
                    isLoadingData={isLoadingData}
                    setSelectedId={setSelectedId}
                    key={value}
                    job={dummyJob}
                    checked={checked}
                    handleIndividualCheck={individualCheck}
                    onViewJob={handleViewJob(index)}
                  />
                ))
              : jobs.map((job, index) => (
                  <BodyRow
                    isLoadingData={isLoadingData}
                    setSelectedId={setSelectedId}
                    key={job.jobId}
                    job={job}
                    checked={checked}
                    handleIndividualCheck={individualCheck}
                    onViewJob={handleViewJob(index)}
                  />
                ))}    
          
          
          </TableBody> 
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            count={count}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Table>
      </div>
      <StandardConfirmationDialog
        variant={'warning'}
        message={message}
        open={openDialog}
        handleClose={handleCloseDialog}
        onConfirm={checked.length === 0 ? event => selectedId && deleteContract(selectedId) : bulkDeleteContract}
      />
    </Fragment>
  );
};

export default JobsTable;
