import React from 'react';
import { Snackbar, makeStyles, Theme, SnackbarContent, IconButton } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

interface Props {
  variant?: 'success' | 'error';
  message: string;
  open: boolean;
  handleClose(): void;
  Icon: React.ComponentType<SvgIconProps>;
}

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const ActionSnackBar: React.FC<Props> = props => {
  const classes = useStyles();
  const { variant, message, open, handleClose, Icon } = props;
  const isSuccessVariant = variant === 'success';

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={isSuccessVariant ? classes.success : classes.error}
        aria-describedby='client-snackbar'
        message={
          <span id='client-snackbar' className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key='close' aria-label='Close' color='inherit' onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
};

export default ActionSnackBar;
