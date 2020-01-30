import React, { FC, useState, Fragment } from 'react';
import NumberFormat from 'react-number-format';
import { IconButton, makeStyles, TableRow, Theme, Tooltip, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import NewIcon from '@material-ui/icons/FiberNewOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Skeleton from 'react-loading-skeleton';

import axios from 'axios';
import { GET_DELETE_SERVICE_ITEM_TEMPLATE } from 'constants/url';
import BodyCell from 'components/BodyCell';
import { StandardConfirmationDialog } from 'components/AppDialog';

interface Props {
  isLoadingData: boolean;
  serviceItemTemplate: ServiceItemTemplatesModel;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  index: number;
  deleteIndividualServiceItemTemplate: (serviceItemTemplateIndex: number) => void;
  onEditServiceItemTemplate: React.MouseEventHandler;
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

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const {
    isLoadingData,
    serviceItemTemplate,
    setSnackbarVarient,
    setOpenSnackbar,
    handleSetMessageSuccess,
    handleSetMessageError,
    index,
    deleteIndividualServiceItemTemplate,
    onEditServiceItemTemplate
  } = props;
  const { id, name, description, unitPrice, new: isNew } = serviceItemTemplate;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const actionWrapper = async (action: () => Promise<void>) => {
    setProcessing(true);

    try {
      await action();
      handleSetMessageSuccess('Successfully deleted a service item');
      setSnackbarVarient('success');
      setOpenSnackbar(true);
    } catch (err) {
      handleSetMessageError('Failed to delete a service item');
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setProcessing(false);
  };

  const deleteServiceItemTemplate: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_SERVICE_ITEM_TEMPLATE(id));
    });
    deleteIndividualServiceItemTemplate(index);
  };

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='30%' isComponent={true}>
          <div className={classes.tableCellInner}>
            <div className={classes.nameTextCell}>
              <Typography variant='body1'>{isLoadingData ? <Skeleton width={150} /> : name}</Typography>
            </div>
            {isNew && (
              <div>
                <NewIcon className={classes.newIcon} />
              </div>
            )}
          </div>
        </BodyCell>
        <BodyCell cellWidth='30%'>{isLoadingData ? <Skeleton width={100} /> : description}</BodyCell>
        <BodyCell cellWidth='20%'>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <NumberFormat value={unitPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
          )}
        </BodyCell>
        <BodyCell cellWidth='20%' pL='110px' isComponent={true}>
          {isLoadingData ? null : (
            <Fragment>
              <Tooltip title={'Edit'} placement='top'>
                <IconButton size='small' onClick={onEditServiceItemTemplate} disabled={isProcessing}>
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
        onConfirm={deleteServiceItemTemplate}
      />
    </Fragment>
  );
};

export default BodyRow;
