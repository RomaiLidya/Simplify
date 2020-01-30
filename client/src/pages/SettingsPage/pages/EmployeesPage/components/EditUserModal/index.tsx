import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Theme, Modal, Grid, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import EditUserForm from './components/EditUserForm';
import { isValidEmail } from '../../../../../../utils';
import axios, { CancelTokenSource } from 'axios';
import { GET_EDIT_USER_URL } from '../../../../../../constants/url';
 
interface Props {
  user?: UserDetailsModel;
  roles: Role[];
  open: boolean;
  handleCancel(): void;
  updateIndividualUser: (updatedUserProperties: Partial<UserDetailsModel>) => void;
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

const EditUserModal: React.FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const { user, open, roles, handleCancel, updateIndividualUser, setOpenSnackbar, setSnackbarVarient } = props;

  const [isLoading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);

  const [emailError, setEmailError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [contactNumberError, setContactNumberError] = useState<string>('');
  const [roleIdError, setRoleIdError] = useState<string>('');

  const resetFormValues = useCallback(() => {
    if (!user) {
      return;
    }

    const { email, displayName, contactNumber, roleId } = user;

    setEmail(email);
    setName(displayName);
    setContactNumber(contactNumber);
    setSelectedRoleId(roleId);
  }, [user]);

  // This to ensure the form value and errors are reset/cleared when selectedUser changes
  // resetFormValues will be modified everytime user changes, due to useCallback
  useEffect(() => {
    resetFormValues();
    clearFormErrors();
  }, [resetFormValues]);

  const clearFormErrors = () => {
    setEmailError('');
    setNameError('');
    setContactNumberError('');
    setRoleIdError('');
  };

  // This is to ensure that the form vale and erors are reset/cleared when user canceled the editing
  const handleOnClose = () => {
    resetFormValues();
    clearFormErrors();
    handleCancel();
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
      const response = await axios.put(
        `${GET_EDIT_USER_URL(user!.id)}`,
        {
          displayName: name,
          email,
          contactNumber,
          roleId: selectedRoleId
        },
        { cancelToken: cancelTokenSource.token }
      );
      updateIndividualUser(response.data);
      setOpenSnackbar(true);
      setSnackbarVarient('success');
      handleCancel();
    } catch (err) {
      console.log(err);
      const { errorCode } = err.data;

      if (errorCode === 5) {
        setEmailError('User is duplicated.');
      }
    }

    setLoading(false);
  };

  return (
    <Modal aria-labelledby='modal-title' open={open} disableBackdropClick={true}>
      <Grid container item xs={8} sm={8} md={8} lg={5} xl={5} spacing={3} direction='column' className={classes.paper}>
        <Typography variant='h4' id='modal-title' color='primary'>
          Edit User
        </Typography>
        <IconButton size='small' className={classes.closeButton} onClick={handleOnClose}>
          <CloseIcon/>
        </IconButton>
        <EditUserForm
          okLabel='Edit'
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
          onCancel={handleOnClose}
        />
      </Grid>
    </Modal>
  );
};

export default EditUserModal;
