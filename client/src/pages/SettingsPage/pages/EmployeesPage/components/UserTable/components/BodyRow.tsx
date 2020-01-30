import React, { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import {
  TableRow,
  makeStyles,
  TableCell,
  Theme,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel,
  withStyles
} from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/Edit';
import UnlockIcon from '@material-ui/icons/LockOpen';
import NewIcon from '@material-ui/icons/FiberNew';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

import { GET_UNLOCK_USER_URL, GET_DEACTIVATE_USER_URL, GET_ACTIVATE_USER_URL } from 'constants/url';
import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  user: UserDetailsModel;
  updateUser: (updatedUserProperties: Partial<UserDetailsModel>) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onEditUser: React.MouseEventHandler;
}

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

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  roleText: {
    color: grey[500]
  },
  circle: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: green[500],
    marginRight: theme.spacing(1),
    content: "''"
  },
  redCircle: {
    backgroundColor: red[500]
  },
  actionCell: {
    '& > :nth-child(n+2)': {
      marginLeft: theme.spacing(1)
    }
  },
  wrapper: {
    position: 'relative'
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1,
    top: -4,
    left: -4
  },
  newIcon: {
    color: green[500]
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, user, updateUser, setOpenSnackbar, setSnackbarVarient, onEditUser } = props;
  const { id, role, displayName, contactNumber, email, active, lock, new: isNew } = user;

  const [isProcessing, setProcessing] = useState<boolean>(false);

  const actionWrapper = async (action: () => Promise<void>) => {
    setProcessing(true);

    try {
      await action();
      setOpenSnackbar(true);
      setSnackbarVarient('success');
    } catch (err) {
      setOpenSnackbar(true);
      setSnackbarVarient('error');
    }

    setProcessing(false);
  };

  const unlockUser: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.post(GET_UNLOCK_USER_URL(id));
      updateUser({ lock: false });
    });
  };

  const deactivateUser: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DEACTIVATE_USER_URL(id));
      updateUser({ active: false });
    });
  };

  const activateUser: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.post(GET_ACTIVATE_USER_URL(id));
      updateUser({ active: true });
    });
  };

  return (
    <TableRow className={classes.tableRow}>
      <TableCell>
        <div className={classes.tableCellInner}>
          <div className={classes.wrapper}>
            {isProcessing && <CircularProgress size={44} thickness={4} className={classes.fabProgress} />}
            {isLoadingData ? (
              <Skeleton circle={true} height={50} width={50} />
            ) : (
              <Avatar className={classes.avatar}>{displayName[0].toUpperCase()}</Avatar>
            )}
          </div>
          <div className={classes.nameTextCell}>
            <Typography variant='body1'>{displayName || <Skeleton width={100} />}</Typography>
            <Typography variant='subtitle2' className={classes.roleText}>
              {role || <Skeleton width={100} />}
            </Typography>
          </div>
          {isNew && (
            <div>
              <NewIcon fontSize='large' className={classes.newIcon} />
            </div>
          )}
        </div>
      </TableCell>
      <BodyCell>{<NumberFormat value={contactNumber} displayType={'text'} prefix={'+'} /> || <Skeleton width={100} height={25} />}</BodyCell>
      <BodyCell>{email || <Skeleton width={100} height={25} />}</BodyCell>
      <BodyCell cellWidth='15%' pL='10px' pR='10px'>
        <div className={classes.tableCellInner}>
          {isLoadingData ? (
            <Skeleton width={100} height={25} />
          ) : (
            <React.Fragment>
              <FormControlLabel
                control={
                  <GreenSwitch checked={active ? true : false} onChange={active ? deactivateUser : activateUser} value='checkedB' color='primary' />
                }
                label={active ? 'Active' : 'Inactive'}
              />
            </React.Fragment>
          )}
        </div>
      </BodyCell>
      <TableCell>
        {isLoadingData ? null : (
          <React.Fragment>
            {lock && (
              <Tooltip title={'Unlock'} placement='top'>
                <IconButton size='small' onClick={unlockUser} disabled={isProcessing}>
                  <UnlockIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={'Edit'} placement='top'>
              <IconButton size='small' onClick={onEditUser} disabled={isProcessing}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BodyRow;
