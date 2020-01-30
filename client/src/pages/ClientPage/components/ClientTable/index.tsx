import React, { FC, useState, useEffect } from 'react';
import { Table, TableBody, TableHead } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';

interface Props {
  isLoadingData: boolean;
  clients: ClientDetailsModel[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  handleViewClient: (clientIndex: number) => React.MouseEventHandler;
  handleViewContract: (clientIndex: number) => React.MouseEventHandler;
  handleViewJob: (clientIndex: number) => React.MouseEventHandler;
  checked: number[];
  setChecked: React.Dispatch<React.SetStateAction<number[]>>;
}

const ClientTable: FC<Props> = props => {
  const {
    isLoadingData,
    clients,
    count,
    currentPage,
    rowsPerPage,
    setOpenSnackbar,
    setSnackbarVarient,
    handleChangeRowsPerPage,
    handleChangePage,
    handleViewClient,
    handleViewContract,
    handleViewJob,
    checked,
    setChecked
  } = props;

  const dummyClient: ClientDetailsModel = {
    id: 0,
    name: '',
    contactPerson: '',
    contactNumber: '',
    contactEmail: '',
    country: '',
    billingAddress: ''
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

  const checkAll = () => {
    const newBulkChecked = [...checked];
    const countChecked = newBulkChecked.length;
    if (count > rowsPerPage) {
      if (countChecked !== rowsPerPage) {
        newBulkChecked.splice(0, countChecked);
        clients.map(client => newBulkChecked.push(client.id));
      } else {
        newBulkChecked.splice(0, count);
      }
    } else {
      if (countChecked !== count) {
        newBulkChecked.splice(0, countChecked);
        clients.map(client => newBulkChecked.push(client.id));
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

  return (
    <Table>
      <TableHead>
        <HeaderRow
          headers={[
            { label: 'CheckBox', pR: '10px', pT: '16px', verticalAlign: 'top', isCheckBox: true, checked, rowsPerPage, handleCheckAll: checkAll },
            { label: 'Client Name', verticalAlign: 'top' },
            { label: 'Service Address', verticalAlign: 'top' },
            { label: 'Contact Person', verticalAlign: 'top' },
            { label: 'Active Contracts', verticalAlign: 'top' },
            { label: 'Amount', verticalAlign: 'top' },
            { label: 'Action', verticalAlign: 'top' }
          ]}
        />
      </TableHead>
      <TableBody>
        {showSkeleton
          ? [1, 2, 3, 4, 5].map(index => (
              <BodyRow
                key={index}
                clients={dummyClient}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewClient={handleViewClient(index)}
                onViewContract={handleViewContract(index)}
                onViewJob={handleViewJob(index)}
                checked={checked}
                handleIndividualCheck={individualCheck}
              />
            ))
          : clients.map((client, index) => (
              <BodyRow
                key={client.id}
                clients={client}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewClient={handleViewClient(client.id)}
                onViewContract={handleViewContract(client.id)}
                onViewJob={handleViewJob(client.id)}
                checked={checked}
                handleIndividualCheck={individualCheck}
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

export default ClientTable;
