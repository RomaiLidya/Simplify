import React, { useState } from 'react';
import { Grid, InputAdornment, IconButton, TextField, MenuItem, Button, Theme, withStyles } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface Props {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  selectedRoleId: number;

  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  setContactNumber: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRoleId: React.Dispatch<React.SetStateAction<number>>;

  emailError: string;
  nameError: string;
  passwordError: string;
  contactNumberError: string;
  roleIdError: string;

  roles: Role[];
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
  onCancel: React.MouseEventHandler;
}

const UpdateButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: '#EF965A',
    '&:hover': {
      backgroundColor: orange[700]
    }
  }
}))(Button);

const useStyles = makeStyles((theme: Theme) => ({
  controlDiv: {
    '& > :nth-child(n+2)': {
      marginLeft: theme.spacing(2)
    }
  },
  updateButton: {
    color: '#FFFFFF'
  }
}));

const EditProfileForm: React.FC<Props> = props => {
  const classes = useStyles();

  const { email, setEmail, emailError } = props;
  const { name, setName, nameError } = props;
  const { password, setPassword, passwordError } = props;
  const { confirmPassword, setConfirmPassword } = props;
  const { contactNumber, setContactNumber, contactNumberError } = props;
  const { selectedRoleId, setSelectedRoleId, roleIdError } = props;
  const { roles, isSubmitting, onSubmit, onCancel } = props;

  const [isShowPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form noValidate onSubmit={onSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            error={emailError !== ''}
            helperText={emailError}
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='name'
            label='Name'
            error={nameError !== ''}
            helperText={nameError}
            value={name}
            onChange={event => setName(event.target.value)}
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
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
            error={passwordError !== ''}
            helperText={passwordError}
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
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
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
            error={passwordError !== ''}
            helperText={passwordError}
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
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='contactNumber'
            label='Contact Number'
            error={contactNumberError !== ''}
            helperText={contactNumberError}
            value={contactNumber}
            onChange={event => setContactNumber(event.target.value)}
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            disabled
            variant='outlined'
            select
            margin='normal'
            required
            fullWidth
            id='role'
            label='Role'
            error={roleIdError !== ''}
            helperText={roleIdError}
            value={selectedRoleId}
            onChange={event => setSelectedRoleId(+event.target.value)}
            autoComplete='off'
          >
            {roles.map(role => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid container item justify='center' xs={12} sm={12} md={12} lg={12} xl={12} className={classes.controlDiv}>
          <Button variant='contained' onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <UpdateButton type='submit' variant='contained' color='primary' className={classes.updateButton} disabled={isSubmitting}>
            Update
          </UpdateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditProfileForm;
