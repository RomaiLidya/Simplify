import { Container, Grid, InputAdornment, IconButton, Paper, TextField, Theme } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/styles';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingButton from 'components/LoadingButton';
import useAuthentication from 'hooks/useAuthenticationAPI';
import logo from 'images/simplify_logo2C.png';

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
  linkButton: {
    textAlign: 'center',
    padding: theme.spacing(1)
  }
}));

const LoginPage: FC = () => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const [{ isLoading, isAuthenticationError }, login] = useAuthentication();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmptyFieldError, setEmptyFieldError] = useState<boolean>(false);
  const [isShowPassword, setShowPassword] = useState<boolean>(false);

  const validateLoginForm = (): boolean => {
    if (!email || !password) {
      setEmptyFieldError(true);
      return false;
    }

    return true;
  };

  const onSubmitHandler: React.FormEventHandler = async event => {
    event.preventDefault();
    setEmptyFieldError(false);

    if (validateLoginForm()) {
      login({ username: email, password });
    }
  };

  const getPasswordFieldHelperText = (): string => {
    if (isEmptyFieldError) {
      return 'Please enter your credentials';
    }

    if (isAuthenticationError) {
      return 'Your credentials is incorrect.';
    }

    return '';
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.logoContainer}>
            <img src={logo} alt='' className={classes.logo} />
          </div>
          <form className={classes.form} noValidate onSubmit={onSubmitHandler}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              error={isEmptyFieldError || isAuthenticationError}
              onChange={event => setEmail(event.target.value)}
              value={email}
            />
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
              error={isEmptyFieldError || isAuthenticationError}
              helperText={getPasswordFieldHelperText()}
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
            <LoadingButton
              delay={0}
              isLoading={isLoading}
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              style={{ margin: theme.spacing(2, 0, 2) }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs className={classes.linkButton}>
                <Link to='/forgotpassword' style={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default LoginPage;
