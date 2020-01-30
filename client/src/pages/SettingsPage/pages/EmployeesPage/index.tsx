import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios, { CancelTokenSource } from 'axios';

import useDebounce from 'hooks/useDebounce';
import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import { Container, Grid, Button, makeStyles, Theme } from '@material-ui/core';
import SearchInput from 'components/SearchInput';
import UserTable from './components/UserTable';
import ActionSnackbar from 'components/ActionSnackbar';
import { ROLE_BASE_URL, USER_BASE_URL } from 'constants/url';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import CustomizedTabs from 'components/CustomizedTabs';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingBottom: theme.spacing(4),
    paddingLeft: 0,
    paddingRight: 0
  },
  contentContainer: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  tableRoot: {
    width: '100%',
    overflowX: 'auto'
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));

const EmployeesPage: FC = () => {
  useCurrentPageTitleUpdater('Employees');

  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');

  const [roles, setRoles] = useState<Role[]>([]);
  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingUser, setSearchingUser] = useState<boolean>(false);
  const [isSearchUserError, setSearchUserError] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetailsModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false);
  const [openEditUserModal, setOpenEditUserModal] = useState<boolean>(false);
  const [currentEditingUserIndex, setCurrentEditingUserIndex] = useState<number>(0);

  // Loading all the roles to populate the tabs once
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getAllRoles = async () => {
      try {
        const response = await axios.get(ROLE_BASE_URL, { cancelToken: cancelTokenSource.token });
        setRoles(response.data.roles);
      } catch (err) {
        console.log(err);
      }
    };

    getAllRoles();

    return () => {
      // Canceling the request if component is unmounted
      cancelTokenSource.cancel();
    };
  }, []);

  // Search User whenever rowsPerPage, currentPage, queryString, selectedRole changes
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      if (selectedRole) {
        params.append('role', selectedRole.toString());
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchUser = async () => {
      setSearchingUser(true);
      setSearchUserError(false);

      try {
        const url = `${USER_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setUsers(data.users);
      } catch (err) {
        setSearchUserError(true);
      }

      setSearchingUser(false);
    };

    searchUser();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString, selectedRole]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const addNewUser = (user: UserDetailsModel) => {
    user.new = true;
    users.unshift(user);
    setUsers([...users]);
    setCount(c => c + 1);
  };

  const updateIndividualUser = (userIndex: number) => {
    return (updatedUserProperties: Partial<UserDetailsModel>) => {
      setUsers(
        users!.map((user, index) => {
          if (index !== userIndex) {
            return user;
          }

          return Object.assign({}, user, updatedUserProperties);
        })
      );
    };
  };

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

  const handleOpenEditUser = (userIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingUserIndex(userIndex);
    setOpenEditUserModal(true);
  };

  const handleCancelCreateUser = () => {
    setOpenCreateUserModal(false);
  };

  const handleCancelEditUser = () => {
    setOpenEditUserModal(false);
  };

  // Should not render until role response came back
  return roles.length === 0 ? null : (
    <Container maxWidth='lg' className={clsx(classes.root, classes.contentContainer)}>
      <Grid container justify='space-between'>
        <CustomizedTabs
          tabs={[{ id: 0, name: 'All' }]}
          tabsByModel={roles}
          selectedTabId={selectedRole}
          onSelect={(tabId: number) => performActionAndRevertPage(setSelectedRole, tabId)}
        />
      </Grid>
      <Grid container justify='space-between'>
        <SearchInput
          withBorder
          withTransition={false}
          width={150}
          placeHolder='Search Employee...'
          iconColor='#989898'
          tableSearchValue={query}
          setTableSearchValue={setQuery}
        />
        <Button color='primary' size='medium' variant='contained' className={classes.addButton}>
          <PersonAddIcon className={classes.extendedIcon} />
          Add Employee
        </Button>
      </Grid>
      <UserTable
        isLoadingData={isSearchingUser}
        users={users}
        count={count}
        updateIndividualUser={updateIndividualUser}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        handleOpenEditUser={handleOpenEditUser}
      />
      <ActionSnackbar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? 'Operation is successful' : 'Operation failed'}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
      <CreateUserModal
        open={openCreateUserModal}
        roles={roles}
        handleCancel={handleCancelCreateUser}
        addNewUser={addNewUser}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
      />
      <EditUserModal
        open={openEditUserModal}
        roles={roles}
        user={users[currentEditingUserIndex]}
        handleCancel={handleCancelEditUser}
        updateIndividualUser={updateIndividualUser(currentEditingUserIndex)}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
      />
    </Container>
  );
};

export default EmployeesPage;
