import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, makeStyles, Theme, Avatar, Paper, Typography, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LoadingButton from 'components/LoadingButton';
import { useTheme } from '@material-ui/styles';
import axios from 'axios';

import { FORGOT_PASSWORD_URL } from 'constants/url';
import useRouter from 'hooks/useRouter';

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
  linkButton: {
    textAlign: 'center',
    padding: theme.spacing(1)
  }
}));

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  const { history } = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isEmptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const onSubmitHandler: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!email) {
      setEmptyEmail(true);

      return;
    }

    resetPassword();
  };

  const resetPassword = async () => {
    setLoading(true);
    setError(false);

    try {
      await axios.post(FORGOT_PASSWORD_URL, { username: email });

      history.push('/');
    } catch (err) {
      setError(true);
    }

    setLoading(false);
  };

  const getHelperText = (): string => {
    if (isEmptyEmail) {
      return 'Please enter your email.';
    }

    if (isError) {
      return 'User does not exist.';
    }

    return '';
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.root}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Reset Password
          </Typography>
          <form className={classes.form} onSubmit={onSubmitHandler} noValidate>
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
              value={email}
              onChange={event => setEmail(event.target.value)}
              error={isEmptyEmail || isError}
              helperText={getHelperText()}
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

export default ForgotPasswordPage;
