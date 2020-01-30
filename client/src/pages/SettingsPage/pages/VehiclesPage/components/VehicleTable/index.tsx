import React, { FC, useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Table, TableBody, TableHead } from '@material-ui/core';
import axios, { CancelTokenSource } from 'axios';

import CreateEditVehicleForm from './components/CreateEditVehicleForm';

import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';
import { VEHICLE_BASE_URL, GET_EDIT_VEHICLE_URL } from 'constants/url';

interface Props {
  isLoadingData: boolean;
  vehicles: VehiclesModel[];
  activeUsers: ActiveUser[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  openCreateVehicle: boolean;
  handleCancelCreateVehicle: () => void;
  openEditVehicle: boolean;
  vehicle?: VehiclesModel;
  currentEditingVehicleIndex: number;
  handleOpenEditVehicle: (vehicleIndex: number) => React.MouseEventHandler;
  handleCancelEditVehicle: () => void;
  addNewVehicle(vehicle: VehiclesModel): void;
  updateIndividualVehicle: (updatedVehicleProperties: Partial<VehiclesModel>, vehicleIndex?: number) => void;
  deleteIndividualVehicle: (vehicleIndex: number) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;

}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      overflowX: 'auto'
    }
  })
);

const VehicleTable: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    isLoadingData,
    vehicles,
    activeUsers,
    count,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    openCreateVehicle,
    handleCancelCreateVehicle,
    openEditVehicle,
    vehicle,
    currentEditingVehicleIndex,
    handleOpenEditVehicle,
    handleCancelEditVehicle,
    addNewVehicle,
    updateIndividualVehicle,
    deleteIndividualVehicle,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError   
  } = props;

  const dummyVehicle: VehiclesModel = {
    id: 0,
    model: '',
    carplateNumber: '',
    coeExpiryDate: new Date(),
    vehicleStatus: false,
    employeeInCharge: 0
  };

  const [isLoading, setLoading] = useState<boolean>(false);

  const [model, setModel] = useState<string>('');
  const [carplateNumber, setCarplateNumber] = useState<string>('');
  const [coeExpiryDate, setCoeExpiryDate] = useState<Date | null>(new Date());
  const [vehicleStatus, setVehicleStatus] = useState<boolean>(false);
  const [employeeInCharge, setEmployeeInCharge] = useState<number>(0);

  const [carplateNumberError, setCarplateNumberError] = useState<string>('');

  const resetInputFormValues = () => {
    setModel('');
    setCarplateNumber('');
    setCoeExpiryDate(new Date());
    setVehicleStatus(false);
    setEmployeeInCharge(0);
  };

  const resetEditFormValues = useCallback(() => {
    if (!vehicle) {
      return;
    }

    const { model, carplateNumber, coeExpiryDate, vehicleStatus, employeeInCharge } = vehicle;

    setModel(model);
    setCarplateNumber(carplateNumber);
    setCoeExpiryDate(coeExpiryDate);
    setVehicleStatus(vehicleStatus);
    setEmployeeInCharge(employeeInCharge === null ? 0 : employeeInCharge);
  }, [vehicle]);

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  useEffect(() => {
    if (!openEditVehicle) {
      let timeout: NodeJS.Timeout;

      if (isLoadingData) {
        timeout = setTimeout(() => {
          setShowSkeleton(true);
        }, 500);
      }

      setShowSkeleton(false);
      resetInputFormValues();
      clearFormErrors();

      return () => {
        clearTimeout(timeout);
      };
    } else {
      resetEditFormValues();
      clearFormErrors();
    }
  }, [openEditVehicle, isLoadingData, resetEditFormValues]);

  const handleCloseCreateVehicle = () => {
    handleCancelCreateVehicle();
    resetInputFormValues();
    clearFormErrors();
  };

  const handleCloseEditVehicle = () => {
    handleCancelEditVehicle();
    resetInputFormValues();
    clearFormErrors();
  };

  const clearFormErrors = () => {
    setCarplateNumberError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!carplateNumber || !carplateNumber.trim()) {
      setCarplateNumberError('Empty');
      ret = false;
    }

    return ret;
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();

      let employeeId;
      if (employeeInCharge === 0) {
        employeeId = undefined;
      } else {
        employeeId = employeeInCharge;
      }

      if (!openEditVehicle) {
        const response = await axios.post(
          `${VEHICLE_BASE_URL}`,
          {
            model,
            carplateNumber,
            coeExpiryDate,
            vehicleStatus,
            employeeId
          },
          { cancelToken: cancelTokenSource.token }
        );
        addNewVehicle(response.data);
        handleSetMessageSuccess('Successfully added new vehicle');
      } else {
        const response = await axios.put(
          `${GET_EDIT_VEHICLE_URL(vehicle!.id)}`,
          {
            model,
            carplateNumber,
            coeExpiryDate,
            vehicleStatus,
            employeeId
          },
          { cancelToken: cancelTokenSource.token }
        );
        updateIndividualVehicle(response.data);
        handleSetMessageSuccess('Successfully edited a vehicle');
      }
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      !openEditVehicle ? handleCloseCreateVehicle() : handleCloseEditVehicle();
    } catch (err) {
      const { errorCode } = err.data;
      if (!openEditVehicle) {
        if (errorCode === 9) {
          setCarplateNumberError('Vehicle number is duplicated.');
        } else {
          handleSetMessageError('Failed to add a new vehicle');
        }
      } else {
        if (errorCode === 9) {
          setCarplateNumberError('Vehicle number is duplicated.');
        } else {
          handleSetMessageError('Failed to edit a vehicle');
        }
      }
      if (errorCode !== 9) {
        setSnackbarVarient('error');
        setOpenSnackbar(true);
        console.log(`err:${err}`);
        console.log(`errorCode:${errorCode}`);
      }
    }

    setLoading(false);
  };

  // headerNameWithPaddings['headerName:pL:pR:pT:pB']
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Vehicle Number', pR: '10px', verticalAlign: 'top' },
              { label: 'Type & Make', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Coe Expiry Date', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Employee In Charge', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Status', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Action', pL: '120px', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {openCreateVehicle && (
            <CreateEditVehicleForm
              activeUsers={activeUsers}
              model={model}
              setModel={setModel}
              carplateNumber={carplateNumber}
              setCarplateNumber={setCarplateNumber}
              carplateNumberError={carplateNumberError}
              coeExpiryDate={coeExpiryDate}
              setCoeExpiryDate={setCoeExpiryDate}
              vehicleStatus={vehicleStatus}
              setVehicleStatus={setVehicleStatus}
              employeeInCharge={employeeInCharge}
              setEmployeeInCharge={setEmployeeInCharge}
              isSubmitting={isLoading}
              onSubmit={handleOnSubmit}
              onCancel={handleCloseCreateVehicle}
              primaryButtonLabel={'Save'} 
            />
          )}
          {showSkeleton
            ? [1, 2, 3, 4, 5, 6].map(index => (
                <BodyRow
                  index={index}
                  key={index}
                  vehicle={dummyVehicle}
                  setOpenSnackbar={setOpenSnackbar}
                  setSnackbarVarient={setSnackbarVarient}
                  handleSetMessageSuccess={handleSetMessageSuccess}
                  handleSetMessageError={handleSetMessageError}
                  deleteIndividualVehicle={deleteIndividualVehicle}
                  onEditVehicle={handleOpenEditVehicle(index)}
                  openEditVehicle={openEditVehicle}
                  updateVehicle={updateIndividualVehicle}
                  isLoadingData={isLoadingData}
                />
              ))
            : vehicles.map((vehicle, index) =>
                openEditVehicle && currentEditingVehicleIndex === index ? (
                  <CreateEditVehicleForm
                    activeUsers={activeUsers}
                    key={vehicle.id}
                    model={model}
                    setModel={setModel}
                    carplateNumber={carplateNumber}
                    setCarplateNumber={setCarplateNumber}
                    carplateNumberError={carplateNumberError}
                    coeExpiryDate={coeExpiryDate}
                    setCoeExpiryDate={setCoeExpiryDate}
                    vehicleStatus={vehicleStatus}
                    setVehicleStatus={setVehicleStatus}
                    employeeInCharge={employeeInCharge}
                    setEmployeeInCharge={setEmployeeInCharge}
                    isSubmitting={isLoading}
                    onSubmit={handleOnSubmit}
                    onCancel={handleCloseEditVehicle}
                    primaryButtonLabel={'Save'}
                    customBackground={'#F4F9FC'}
                  />
                ) : (
                  <BodyRow
                    index={index}
                    key={vehicle.id}
                    vehicle={vehicle}
                    setOpenSnackbar={setOpenSnackbar}
                    setSnackbarVarient={setSnackbarVarient}
                    handleSetMessageSuccess={handleSetMessageSuccess}
                    handleSetMessageError={handleSetMessageError}
                    deleteIndividualVehicle={deleteIndividualVehicle}
                    onEditVehicle={handleOpenEditVehicle(index)}
                    openEditVehicle={openEditVehicle}
                    updateVehicle={updateIndividualVehicle}
                    isLoadingData={isLoadingData}
                  />
                )
              )}
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
  );
};

export default VehicleTable;
