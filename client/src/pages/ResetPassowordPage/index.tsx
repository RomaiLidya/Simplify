import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, InputAdornment, IconButton, makeStyles, Theme, Paper, Typography, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import LoadingButton from 'components/LoadingButton';
import { useTheme } from '@material-ui/styles';
import logo from 'images/simplify_logo2C.png';
import axios from 'axios';

import { RESET_PASSWORD_URL } from 'constants/url';
import useRouter from 'hooks/useRouter';
import ActionSnackBar from 'components/ActionSnackbar';

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  root: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3, 5)
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  logoContainer: {
    textAlign: 'center'
  },
  logo: {
    width: '50%'
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  linkButton: {
    textAlign: 'center',
    padding: theme.spacing(1)
  }
}));

const ResetPasswordPage: React.FC = () => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  const { history } = useRouter();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isEmptyFieldError, setEmptyFieldError] = useState<boolean>(false);
  const [isDifferentPasswordError, setDifferentPasswordError] = useState<boolean>(false);
  const [isShowPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');

  const params = new URLSearchParams(window.location.search).get('t');

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validateResetForm = (): boolean => {
    if (!password && !confirmPassword) {
      setEmptyFieldError(true);
      return false;
    }

    if (!password && !confirmPassword) {
      setEmptyFieldError(true);
      return false;
    }

    if (password !== confirmPassword) {
      setDifferentPasswordError(true);
      return false;
    }

    return true;
  };

  const onSubmitHandler: React.FormEventHandler = async event => {
    event.preventDefault();
    setEmptyFieldError(false);

    if (validateResetForm()) {
      resetPassword();
    }
  };

  const resetPassword = async () => {
    setLoading(true);

    try {
      await axios.post(RESET_PASSWORD_URL, { newPassword: password, jwtParam: params });

      history.push('/');
    } catch (err) {
      setOpenSnackbar(true);
      setSnackbarVarient('error');
    }

    setLoading(false);
  };

  const getHelperText = (): string => {
    if (isEmptyFieldError) {
      return 'Please enter your credentials';
    }

    if (isDifferentPasswordError) {
      return 'Password and confirm password is different';
    }

    return '';
  };

  return (
    <Container component='main' maxWidth='xs'>
      <ActionSnackBar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? 'Update is successful' : 'Link expired, please request link for reset password again.'}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
      <Paper className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.logoContainer}>
            <img src={logo} alt='' className={classes.logo} />
          </div>
          <Typography component='h3' variant='h5'>
            Reset Password
          </Typography>
          <form className={classes.form} onSubmit={onSubmitHandler} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type={isShowPassword ? 'text' : 'password'}
              id='password'
              autoComplete='current-password'
              error={isEmptyFieldError || isDifferentPasswordError}
              helperText={getHelperText()}
              onChange={event => setPassword(event.target.value)}
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' aria-label='toggle password visibility' onClick={event => setShowPassword(!isShowPassword)}>
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label='Confirm Password'
              type={isShowPassword ? 'text' : 'password'}
              id='confirmPassword'
              autoComplete='current-password'
              error={isEmptyFieldError || isDifferentPasswordError}
              helperText={getHelperText()}
              onChange={event => setConfirmPassword(event.target.value)}
              value={confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' aria-label='toggle password visibility' onClick={event => setShowPassword(!isShowPassword)}>
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <LoadingButton
              delay={0}
              isLoading={isLoading}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              style={{ margin: theme.spacing(2, 0, 2) }}
            >
              Reset Password
            </LoadingButton>
            <Grid container>
              <Grid item xs className={classes.linkButton}>
                <Link to='/' style={{ textDecoration: 'none' }}>
                  Back to login page?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
