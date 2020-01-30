import React, { FC } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/ErrorOutlineOutlined';
import DangerIcon from '@material-ui/icons/ErrorOutlined';
import { green } from '@material-ui/core/colors';
import { orange } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

interface Props {
  variant: string;
  message: string;
  open: boolean;
  handleClose(): void;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
}

const useStyles = makeStyles((theme: Theme) => ({
  successAvatarIcon: {
    fontSize: 50,
    color: green[500]
  },
  warnigAvatarIcon: {
    fontSize: 50,
    color: orange[500]
  },
  dangerAvatarIcon: {
    fontSize: 50,
    color: red[500]
  },
  cancelButton: {
    marginRight: theme.spacing(1)
  },
  okButton: {
    backgroundColor: '#EF965A',
    '&:hover': {
      backgroundColor: orange[700]
    }
  },
  dialogActions: {
    marginBottom: theme.spacing(2)
  }
}));

export const StandardConfirmationDialog: FC<Props> = props => {
  const classes = useStyles();
  const { variant, message, open, handleClose, onConfirm } = props;

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Grid container justify='center' alignItems='center'>
          {variant === 'success' && <SuccessIcon className={classes.successAvatarIcon} />}
          {variant === 'warning' && <WarningIcon className={classes.warnigAvatarIcon} />}
          {variant === 'danger' && <DangerIcon className={classes.dangerAvatarIcon} />}
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Typography variant='h6'>{message}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Grid container justify='center' alignItems='center'>
          <Button variant='contained' className={classes.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' color='primary' className={classes.okButton} onClick={onConfirm}>
            Ok
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
