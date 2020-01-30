import React from 'react';
import { Grid, TextField, MenuItem, Button, Theme, withStyles } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
 
interface Props {
  okLabel: 'Add' | 'Edit';

  email: string;
  name: string;
  contactNumber: string;
  selectedRoleId: number;

  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setContactNumber: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRoleId: React.Dispatch<React.SetStateAction<number>>;

  emailError: string;
  nameError: string;
  contactNumberError: string;
  roleIdError: string;

  roles: Role[];
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
  onCancel: React.MouseEventHandler;
}

const AddButton = withStyles(theme => ({
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
  cancelButton: {
    marginRight: theme.spacing(1)
  },
  addButton: {
    color: '#FFFFFF'
  }
}));

const CreateUserForm: React.FC<Props> = props => {
  const classes = useStyles();

  const { email, setEmail, emailError } = props;
  const { name, setName, nameError } = props;
  const { contactNumber, setContactNumber, contactNumberError } = props;
  const { selectedRoleId, setSelectedRoleId, roleIdError } = props;
  const { roles, isSubmitting, onSubmit, onCancel, okLabel } = props;

  return (
    <form noValidate onSubmit={onSubmit}>
      <Grid container spacing={1}>
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
        <Grid container item justify='flex-end' xs={12} sm={12} md={12} lg={12} xl={12} className={classes.controlDiv}>
          <Button variant='contained' className={classes.cancelButton} onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <AddButton type='submit' variant='contained' color='primary' className={classes.addButton} disabled={isSubmitting}>
            {okLabel}
          </AddButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateUserForm;
