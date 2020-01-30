import React, { FC, useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableFooter, TableRow, TablePagination } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';

interface Props {
  isLoadingData: boolean;
  users: UserDetailsModel[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  updateIndividualUser: (userIndex: number) => (updatedUserProperties: Partial<UserDetailsModel>) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  handleOpenEditUser: (userIndex: number) => React.MouseEventHandler;
}

const UserTable: FC<Props> = props => {
  const {
    isLoadingData,
    users,
    count,
    currentPage,
    rowsPerPage,
    updateIndividualUser,
    setOpenSnackbar,
    setSnackbarVarient,
    handleChangeRowsPerPage,
    handleChangePage,
    handleOpenEditUser
  } = props;

  const dummyUser: UserDetailsModel = {
    id: 0,
    roleId: 0,
    role: '',
    displayName: '',
    email: '',
    contactNumber: '',
    active: false,
    lock: false
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
            { label: 'Name', verticalAlign: 'top' },
            { label: 'Contact Number', verticalAlign: 'top' },
            { label: 'Email', verticalAlign: 'top' },
            { label: 'Status', verticalAlign: 'top' },
            { label: 'Action', verticalAlign: 'top' }
          ]}
        />
      </TableHead>
      <TableBody>
        {showSkeleton
          ? [1, 2, 3, 4, 5].map(index => (
              <BodyRow
                key={index}
                user={dummyUser}
                updateUser={updateIndividualUser(index)}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                onEditUser={handleOpenEditUser(index)}
                isLoadingData={showSkeleton}
              />
            ))
          : users.map((user, index) => (
              <BodyRow
                key={user.id}
                user={user}
                updateUser={updateIndividualUser(index)}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                onEditUser={handleOpenEditUser(index)}
                isLoadingData={showSkeleton}
              />
            ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            colSpan={5}
            count={count}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            SelectProps={{
              inputProps: { 'aria-label': 'Rows per page' },
              native: true
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default UserTable;
