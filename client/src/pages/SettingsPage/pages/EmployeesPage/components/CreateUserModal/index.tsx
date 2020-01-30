import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Theme, Typography, Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

import axios, { CancelTokenSource } from 'axios';
import CloseIcon from '@material-ui/icons/Close';

import { isValidEmail } from '../../../../../../utils';
import { USER_BASE_URL } from '../../../../../../constants/url';
import CreateUserForm from './components/CreateUserForm';
 
interface Props {
  open: boolean;
  roles: Role[];
  addNewUser(user: UserDetailsModel): void;
  handleCancel(): void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
}
  
const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 4
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})); 

const CreateUserModal: React.FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const { open, roles, addNewUser, handleCancel, setOpenSnackbar, setSnackbarVarient } = props;

  const [isLoading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);

  const [emailError, setEmailError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [contactNumberError, setContactNumberError] = useState<string>('');
  const [roleIdError, setRoleIdError] = useState<string>('');

  
 
  const handleClose = () => {
    handleCancel();
    clearFormValue();
    clearFormErrors();
  };

  const clearFormValue = () => {
    setEmail('');
    setName('');
    setContactNumber('');
    setSelectedRoleId(0);
  };

  const clearFormErrors = () => {
    setEmailError('');
    setNameError('');
    setContactNumberError('');
    setRoleIdError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!email || !email.trim()) {
      setEmailError('Please enter email');
      ret = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter an valid email');
      ret = false;
    }

    if (!name || !name.trim()) {
      setNameError('Please enter display name');
      ret = false;
    }

    if (!contactNumber || !contactNumber.trim()) {
      setContactNumberError('Please enter contact number');
      ret = false;
    }

    if (!selectedRoleId) {
      setRoleIdError('Please select role');
      ret = false;
    }

    return ret;
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      const response = await axios.post(
        `${USER_BASE_URL}`,
        {
          displayName: name,
          email,
          contactNumber,
          roleId: selectedRoleId
        },
        { cancelToken: cancelTokenSource.token }
      );
      addNewUser(response.data);
      setOpenSnackbar(true);
      setSnackbarVarient('success');
      handleClose();
    } catch (err) {
      console.log(err);
      const { errorCode } = err.data;

      if (errorCode === 5) {
        setEmailError('User is duplicated.');
      } else if (errorCode === 55) {
        setEmailError('Exceeded license usage');
      }
    }

    setLoading(false);
  };
  
  return (
    <Modal aria-labelledby='modal-title' open={open} disableBackdropClick={true}>
      <Grid container item xs={8} sm={8} md={8} lg={5} xl={5} spacing={3} direction='column' className={classes.paper}>
        <Typography variant='h4' id='modal-title' color='primary'>
          Create User
        </Typography>
        <IconButton size='small' className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <CreateUserForm
          okLabel='Add'
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          name={name}
          setName={setName}
          nameError={nameError}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          contactNumberError={contactNumberError}
          selectedRoleId={selectedRoleId}
          setSelectedRoleId={setSelectedRoleId}
          roleIdError={roleIdError}
          roles={roles}
          isSubmitting={isLoading}
          onSubmit={handleOnSubmit}
          onCancel={handleClose} 
        />
      </Grid>
    </Modal>
  );
};

export default CreateUserModal;
  