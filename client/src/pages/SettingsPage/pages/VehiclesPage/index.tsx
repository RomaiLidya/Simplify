import React, { FC, Fragment, useState, useEffect } from 'react';
import { Button, Grid, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import axios, { CancelTokenSource } from 'axios';

import SearchInput from 'components/SearchInput';
import useDebounce from 'hooks/useDebounce';
import ActionSnackbar from 'components/ActionSnackbar';
import VehicleTable from './components/VehicleTable';

import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import { GET_ACTIVE_USERS_URL, VEHICLE_BASE_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));

const VehiclesPage: FC = () => {
  useCurrentPageTitleUpdater('Vehicles');

  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingVehicle, setSearchingVehicle] = useState<boolean>(false);
  const [isSearchVehicleError, setSearchVehicleError] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<VehiclesModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCreateVehicle, setOpenCreateVehicle] = useState<boolean>(false);
  const [openEditVehicle, setOpenEditVehicle] = useState<boolean>(false);
  const [currentEditingVehicleIndex, setCurrentEditingVehicleIndex] = useState<number>(0);

  // Loading all the employee to populate the select components
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getAllUsers = async () => {
      try {
        const response = await axios.get(GET_ACTIVE_USERS_URL, { cancelToken: cancelTokenSource.token });
        setActiveUsers(response.data.activeUsers);
      } catch (err) {
        console.log(err);
      }
    };

    getAllUsers();

    return () => {
      // Canceling the request if component is unmounted
      cancelTokenSource.cancel();
    };
  }, []);

  // Search Vehicle whenever rowsPerPage, currentPage, queryString changes
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

    const searchVehicle = async () => {
      setSearchingVehicle(true);
      setSearchVehicleError(false);

      try {
        const url = `${VEHICLE_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setVehicles(data.vehicles);
      } catch (err) {
        setSearchVehicleError(true);
      }

      setSearchingVehicle(false);
    };

    searchVehicle();

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

  const debouncedSearchTerm = useDebounce(query, 1000);
  // Load client data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleOpenCreateVehicle = () => {
    setOpenEditVehicle(false);
    setOpenCreateVehicle(true);
  };

  const handleCancelCreateVehicle = () => {
    setOpenCreateVehicle(false);
  };

  const handleOpenEditVehicle = (vehicleIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingVehicleIndex(vehicleIndex);
    setOpenCreateVehicle(false);
    setOpenEditVehicle(true);
  };

  const handleCancelEditVehicle = () => {
    setOpenEditVehicle(false);
  };

  const addNewVehicle = (vehicle: VehiclesModel) => {
    vehicle.new = true;
    vehicles.unshift(vehicle);
    setVehicles([...vehicles]);
    setCount(c => c + 1);
  };

  const updateIndividualVehicle = (updatedVehicleProperties: Partial<VehiclesModel>, vehicleIndex?: number) => {
    let currentEditingIndex: number;
    if (vehicleIndex === undefined) {
      currentEditingIndex = currentEditingVehicleIndex;
    } else {
      currentEditingIndex = vehicleIndex;
    }
    setVehicles(
      vehicles!.map((vehicle, index) => {
        if (index !== currentEditingIndex) {
          return vehicle;
        }

        return Object.assign({}, vehicle, updatedVehicleProperties);
      })
    );
  };

  const deleteIndividualVehicle = (vehicleIndex: number) => {
    vehicles.splice(vehicleIndex, 1);
    setVehicles([...vehicles]);
    setCount(c => c - 1);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };

  return (
    <Fragment>
      <Grid container justify='space-between'>
        <SearchInput
          withBorder
          withTransition={false}
          width={150}
          placeHolder='Search Vehicle...'
          iconColor='#989898'
          tableSearchValue={query}
          setTableSearchValue={setQuery}
        />
        <Button
          color='primary'
          size='medium'
          variant='outlined'
          className={classes.addButton}
          onClick={() => {
            handleOpenCreateVehicle();
          }}
        >
          <AddIcon className={classes.extendedIcon} />
          Add Vehicle
        </Button>
      </Grid>
      <VehicleTable
        isLoadingData={isSearchingVehicle}
        vehicles={vehicles}
        count={count}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        openCreateVehicle={openCreateVehicle}
        handleCancelCreateVehicle={handleCancelCreateVehicle}
        addNewVehicle={addNewVehicle}
        deleteIndividualVehicle={deleteIndividualVehicle}
        openEditVehicle={openEditVehicle}
        vehicle={vehicles[currentEditingVehicleIndex]}
        activeUsers={activeUsers}
        currentEditingVehicleIndex={currentEditingVehicleIndex}
        handleOpenEditVehicle={handleOpenEditVehicle}
        handleCancelEditVehicle={handleCancelEditVehicle}
        updateIndividualVehicle={updateIndividualVehicle}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleSetMessageSuccess={handleSetMessageSuccess}
        handleSetMessageError={handleSetMessageError}
      />
      <ActionSnackbar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? messageSuccess : messageError}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
    </Fragment>
  );
};

export default VehiclesPage;
