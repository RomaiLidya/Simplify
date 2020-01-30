import React, { FC, useState, Fragment, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Grid, Theme} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import ActionSnackbar from 'components/ActionSnackbar';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';

import { ENTITY_BASE_URL } from 'constants/url';

 
interface Props {
  open: boolean;
  addNewEntity(entity: EntitiesModel): void;
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

const ProfileDetails:React.FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;
  const [isLoading, setLoading] = useState<boolean>(false);
  const { open, addNewEntity, handleCancel, setOpenSnackbar, setSnackbarVarient } = props;
  const [entity, setEntity] = useState<EntitiesModel[]>([]);
  // const [messageSuccess, setMessageSuccess] = useState<string>('');
  // const [messageError, setMessageError] = useState<string>('');

  // const [entity, setEntity] = useState<ServiceItemTemplatesModel[]>([]);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  // const [unitNumber, setUnitNumber] = useState<string>('');
  // const [postalCode, setPostalCode] = useState<string>('');
  const [logo, setLogo] = useState<string>('');
  const [logoView, setLogoView] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');
  // const [postalCodeError, setPostalCodeError] = useState<string>('');
  const [logoError, setLogoError] = useState<string>('');
  const [contactNumberError, setContactNumberError] = useState<string>('');
  
  const handleClose = () => {
    handleCancel();
    clearFormValue();
    clearFormErrors();
  };

  const clearFormValue = () => {
    setAddress('');
    setName('');
    setContactNumber('');
   
  };

  const clearFormErrors = () => {
    setNameError('');
    setAddressError('');
    // setPostalCodeError('');
    setLogoError('');
    setContactNumberError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!name || !name.trim()) {
      setNameError('Please enter company name');
      ret = false;
    }

    if (!address || !address.trim()) {
      setAddressError('Please enter company address');
      ret = false;
    }

    // if (!postalCode || !postalCode.trim()) {
    //   setPostalCodeError('Please enter postal code');
    //   ret = false;
    // }

    if (!logoView || !logoView.trim()) {
      setLogoError('Please choose company logo');
      ret = false;
    }

    if (!contactNumber || !contactNumber.trim()) {
      setContactNumberError('Please enter contact number');
      ret = false;
    }

    return ret;
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // const handleSetMessageSuccess = (message: string) => {
  //   setMessageSuccess(message);
  // };

  // const handleSetMessageError = (message: string) => {
  //   setMessageError(message);
  // };

  const handleOnSubmit: React.FormEventHandler = async event => {
    // event.preventDefault();

    // if (!validateForm()) {
    //   return;
    // }

    // setLoading(true);

    // try {
    //   cancelTokenSource = axios.CancelToken.source();
    //   const formData = new FormData();

    //   formData.append('name', name);
    //   formData.append('address', address);
    //   formData.append('unitNumber', unitNumber);
    //   formData.append('postalCode', postalCode);
    //   formData.append('contactNumber', contactNumber);
    //   formData.append('file', logo);

    //   const config = {
    //     headers: {
    //       'content-type': 'multipart/form-data'
    //     }
    //   };
    //   const response = await axios.post(`${ENTITY_BASE_URL}`, formData, config);
    //   setEntity(response.data);
    //   handleSetMessageSuccess('Successfully added new entity');
    // } catch (err) {
    //   handleSetMessageError('Failed to add a new enity');
    //   setSnackbarVarient('error');
    //   setOpenSnackbar(true);
    //   console.log(`err:${err}`);
    //   const { errorCode } = err.data;

    //   console.log(`errorCode:${errorCode}`);
    // }

    // setLoading(false);
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      const response = await axios.post(
        `${ENTITY_BASE_URL}`,
        {
          name,
          address,
          logo,
          contactNumber
       
        },
        { cancelToken: cancelTokenSource.token }
      );
      addNewEntity(response.data);
      setOpenSnackbar(true);
      setSnackbarVarient('success');
      handleClose();
    } catch (err) {
      console.log(err);
      const { errorCode } = err.data;

      if (errorCode === 5) {
        setNameError('User is duplicated.');
      } else if (errorCode === 55) {
        setNameError('Exceeded license usage');
      }
    }

    setLoading(false);
  };

  return (
    <form noValidate onSubmit={handleOnSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <LeftContent logo={logo} setLogo={setLogo} logoView={logoView} setLogoView={setLogoView} logoError={logoError} isSubmitting={isLoading} />
        </Grid>
        <Grid item xs={9}>
          <RightContent
            name={name}
            setName={setName}
            address={address}
            setAddress={setAddress}
            // unitNumber={unitNumber}
            // setUnitNumber={setUnitNumber}
            // postalCode={postalCode}
            // setPostalCode={setPostalCode}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            nameError={nameError}
            addressError={addressError}
            // postalCodeError={postalCodeError}
            contactNumberError={contactNumberError}
            isSubmitting={isLoading}
            onSubmit={handleOnSubmit}
          />
        </Grid>
      </Grid>
      {/* <ActionSnackbar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? messageSuccess : messageError}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      /> */}
    </form>
  );
};

export default ProfileDetails;
