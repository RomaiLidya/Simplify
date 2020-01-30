import React, { FC, useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableFooter, TableRow, TablePagination } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';

interface Props {
  isLoadingData: boolean;
  jobs: JobsModel[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  handleViewJob: (jobIndex: number) => React.MouseEventHandler;
}

const JobTable: FC<Props> = props => {
  const {
    isLoadingData,
    jobs,
    count,
    currentPage,
    rowsPerPage,
    setOpenSnackbar,
    setSnackbarVarient,
    handleChangeRowsPerPage,
    handleChangePage,
    handleViewJob
  } = props;

  const dummyJob: JobsModel = {
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
  };

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

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

  return (
    <Table>
      <TableHead>
        <HeaderRow
          headers={[
            { label: 'Job ID', pR: '10px', verticalAlign: 'top' },
            { label: 'Job Progress', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Service Name', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Start Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'End Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Job Type', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Invoice No', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Amount', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Job Status', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Action', pL: '10px', verticalAlign: 'top' }
          ]}
        />
      </TableHead>
      <TableBody>
        {showSkeleton
          ? [1, 2, 3, 4, 5].map(index => (
              <BodyRow
                key={index}
                jobs={dummyJob}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewJob={handleViewJob(index)}
              />
            ))
          : jobs.map((job, index) => (
              <BodyRow
                key={job.id}
                jobs={job}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewJob={handleViewJob(job.id)}
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
  );
};

export default JobTable;
