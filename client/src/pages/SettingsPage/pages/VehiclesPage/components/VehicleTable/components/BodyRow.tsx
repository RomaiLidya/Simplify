import React, { FC, useState, Fragment } from 'react';
import { format } from 'date-fns';
import { FormControlLabel, IconButton, makeStyles, Switch, TableRow, Theme, Tooltip, Typography, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import NewIcon from '@material-ui/icons/FiberNewOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Skeleton from 'react-loading-skeleton';

import axios from 'axios';
import { GET_DELETE_VEHICLE, GET_ACTIVATE_VEHICLE_URL, GET_DEACTIVATE_VEHICLE_URL } from 'constants/url';
import BodyCell from 'components/BodyCell';
import { StandardConfirmationDialog } from 'components/AppDialog';

interface Props {
  isLoadingData: boolean;
  vehicle: VehiclesModel;
  openEditVehicle: boolean;
  updateVehicle: (updatedVehicleProperties: Partial<VehiclesModel>, vehicleIndex?: number) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  index: number;
  deleteIndividualVehicle: (vehicleIndex: number) => void;
  onEditVehicle: React.MouseEventHandler;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  newIcon: {
    color: green[500],
    fontSize: 30
  },
  actionIcon: {
    fontSize: 20
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(2)
  }
}));

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: green[500]
    },
    '&$checked + $track': {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const {
    isLoadingData,
    vehicle,
    openEditVehicle,
    updateVehicle,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    index,
    deleteIndividualVehicle,
    onEditVehicle
  } = props;
  const { id, model, carplateNumber, coeExpiryDate, vehicleStatus, displayName, new: isNew } = vehicle;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const actionWrapper = async (action: () => Promise<void>, actionStatus: string) => {
    setProcessing(true);

    try {
      await action();
      handleSetMessageSuccess(`Successfully ${actionStatus} a vehicle`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
    } catch (err) {
      handleSetMessageError(`Failed to ${actionStatus} a vehicle`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setProcessing(false);
  };

  const deleteVehicle: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_VEHICLE(id));
    }, 'delete');
    deleteIndividualVehicle(index);
  };

  const deactivateVehicle: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.post(GET_DEACTIVATE_VEHICLE_URL(id));
    }, 'deactivate');
    updateVehicle({ vehicleStatus: false }, index);
  };

  const activateVehicle: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.post(GET_ACTIVATE_VEHICLE_URL(id));
    }, 'activate');
    updateVehicle({ vehicleStatus: true }, index);
  };

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='14%' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <div className={classes.tableCellInner}>
              <div className={classes.nameTextCell}>
                <Typography variant='body1'>{carplateNumber}</Typography>
              </div>
              {isNew && (
                <div>
                  <NewIcon className={classes.newIcon} />
                </div>
              )}
            </div>
          )}
        </BodyCell>
        <BodyCell cellWidth='20%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : model}
        </BodyCell>
        <BodyCell cellWidth='18%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : format(new Date(coeExpiryDate), 'dd/MM/yyyy')}
        </BodyCell>
        <BodyCell cellWidth='20%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : displayName}
        </BodyCell>
        <BodyCell cellWidth='15%' pL='10px' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={vehicleStatus ? true : false}
                  disabled={openEditVehicle}
                  onChange={vehicleStatus ? deactivateVehicle : activateVehicle}
                />
              }
              label={vehicleStatus ? 'Active' : 'Not Active'}
            />
          )}
        </BodyCell>
        <BodyCell cellWidth='15%' pL='120px' isComponent={true}>
          {isLoadingData ? null : (
            <Fragment>
              <Tooltip title={'Edit'} placement='top'>
                <IconButton size='small' onClick={onEditVehicle} disabled={isProcessing}>
                  <EditIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Delete'} placement='top'>
                <IconButton size='small' onClick={event => setOpenDialog(true)} disabled={isProcessing}>
                  <DeleteIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
            </Fragment>
          )}
        </BodyCell>
      </TableRow>
      <StandardConfirmationDialog
        variant={'warning'}
        message={'Are you sure you want to delete this?'}
        open={openDialog}
        handleClose={handleCloseDialog}
        onConfirm={deleteVehicle}
      />
    </Fragment>
  );
};

export default BodyRow;
