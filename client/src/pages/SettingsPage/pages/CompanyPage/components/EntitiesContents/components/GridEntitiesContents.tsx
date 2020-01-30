import React, { FC, Fragment, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { makeStyles, Tooltip, Grid, Theme, IconButton, Typography, Paper, TableCell } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import useRouter from 'hooks/useRouter';
import Skeleton from 'react-loading-skeleton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';
import { StandardConfirmationDialog } from 'components/AppDialog';
import { GET_DELETE_ENTITY } from 'constants/url';
import axios from 'axios';

interface Props {
  isLoadingData: boolean;
  entity: EntitiesModel;
  index: number;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  deleteIndividualEntity: (entityIndex: number) => void;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onEditEntity: React.MouseEventHandler;
}
const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  actionIcon: {
    fontSize: 20,
    alignItems: 'left'
  },
  tableRowChecked: {
    height: 64,
    backgroundColor: '#F4F4F4'
  },
  newIcon: {
    color: green[500],
    fontSize: 30,
    marginTop: theme.spacing(0.8)
  },
  paperSpace: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  chip: {
    borderRadius: 7
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  editIconForEmptyInvoice: {
    marginLeft: theme.spacing(5.5)
  },
  wrapper: {
    position: 'relative'
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  icon: {
    fontSize: 20
  },
  checkBox: {
    '&&:hover': {
      backgroundColor: 'transparent'
    }
  },
  checkBoxSize: {
    fontSize: '16px'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  menuAvatar: {
    backgroundColor: '#ffffff',
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px',
    color: '#707070'
  },
  menuList: {
    minHeight: 30
  },
  formTitle: {
    textTransform: 'uppercase'
  }
}));

const GridEntitiesContents: FC<Props> = props => {
  const classes = useStyles();
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const {
    isLoadingData,
    entity,
    index,
    handleSetMessageSuccess,
    handleSetMessageError,
    setOpenSnackbar,
    deleteIndividualEntity,
    setSnackbarVarient,
    onEditEntity
  } = props;
  const { id, name, address, contactNumber, new: isNew } = entity;
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const actionWrapper = async (action: () => Promise<void>, actionStatus: string) => {
    setProcessing(true);

    try {
      await action();
      handleSetMessageSuccess(`Successfully ${actionStatus} a entity`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
    } catch (err) {
      handleSetMessageError(`Failed to ${actionStatus} a entity`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setProcessing(false);
  };

  const deleteEntity: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_ENTITY(id));
    }, 'delete');
    deleteIndividualEntity(index);
  };

  return (
    <Paper>
      <Fragment>
        <Tooltip title={'Edit'} placement='top'>
          <IconButton size='small' onClick={onEditEntity} disabled={isProcessing}>
            <EditIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>{' '}
        <IconButton size='small'>
          <DeleteIcon className={classes.actionIcon} onClick={event => setOpenDialog(true)} />
        </IconButton>
      </Fragment>
      <Typography color='primary' variant='body1' display='block' gutterBottom>
        Company Name
      </Typography>
      <Grid container spacing={2} className={classes.paperSpace}>
        <Grid item xs={12} sm={6}>
          <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
            {' '}
            Nama:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
              {name || <Skeleton width={100} />}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
            {' '}
            Address
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
              {address || <Skeleton width={100} />}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
            {' '}
            Contact Number
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
              {contactNumber || <Skeleton width={100} />}
            </Typography>
          )}
        </Grid>
      </Grid>

      <StandardConfirmationDialog
        variant={'warning'}
        message={'Are you sure you want to delete this?'}
        open={openDialog}
        handleClose={handleCloseDialog}
        onConfirm={deleteEntity}
      />
    </Paper>
  );
};

export default GridEntitiesContents;
