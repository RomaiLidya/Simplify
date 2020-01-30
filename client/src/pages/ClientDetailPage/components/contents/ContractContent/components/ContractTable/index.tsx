import React, { FC, useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableFooter, TableRow, TablePagination } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';

interface Props {
  isLoadingData: boolean;
  contracts: ContractsModel[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  handleViewContract: (contractIndex: number) => React.MouseEventHandler;
}

const ContractTable: FC<Props> = props => {
  const {
    isLoadingData,
    contracts,
    count,
    currentPage,
    rowsPerPage,
    setOpenSnackbar,
    setSnackbarVarient,
    handleChangeRowsPerPage,
    handleChangePage,
    handleViewContract
  } = props;

  const dummyContract: ContractsModel = {
    id: 0,
    contractId: 'CT0010',
    clientId: 0,
    clientName: 'Noid Digital',
    contractTitle: 'General Maintanance',
    startDate: new Date(),
    endDate: new Date(),
    createdDate: new Date(),
    invoiceNo: 'INV0010',
    amount: 220,
    entityId: 0,
    entity: 'Company name Entity 01',
    completed: 1,
    totalJob: 3
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
            { label: 'Contract ID', pR: '10px', verticalAlign: 'top' },
            { label: 'Client Name', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Contract Title', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Start Date - End Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Created Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Invoice No', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Amount', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Entity', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Job Progress', pL: '10px', pR: '10px', verticalAlign: 'top' },
            { label: 'Action', pL: '10px', verticalAlign: 'top' }
          ]}
        />
      </TableHead>
      <TableBody>
        {showSkeleton
          ? [1, 2, 3, 4, 5].map(index => (
              <BodyRow
                key={index}
                contracts={dummyContract}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewContract={handleViewContract(index)}
              />
            ))
          : contracts.map((contract, index) => (
              <BodyRow
                key={contract.id}
                contracts={contract}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                isLoadingData={showSkeleton}
                onViewContract={handleViewContract(contract.id)}
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

export default ContractTable;
