import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Modal,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  withStyles,
  IconButton
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';

import axios, { CancelTokenSource } from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import PaymentDetail from './PaymentDetail';
import PurchaseComplete from './PurchaseComplete';
import PlanForm from './PlanForm';
interface Props {
  open: boolean;
  client?: ClientDetailsModel;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleCancel: React.MouseEventHandler;
}

const NextButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: '#EF965A',
    '&:hover': {
      backgroundColor: orange[700]
    }
  }
}))(Button);

const SaveButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: '#EF965A',
    '&:hover': {
      backgroundColor: orange[700]
    }
  }
}))(Button);

const DialogButton = withStyles(theme => ({
  root: {
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  }
}))(DialogActions);

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
  headerModalText: {
    textAlign: 'center',
    color: '#53A0BE'
  },
  nextButton: {
    color: '#FFFFFF'
  },
  backButton: {
    marginRight: theme.spacing(3)
  },
  instructions: {
    marginTop: theme.spacing(1)
  },
  contentGrid: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#53a0be',
    padding: theme.spacing(8),
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8)
  },
  cancelButton: {
    marginRight: theme.spacing(3)
  },
  controlDiv: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

const CreateClientModal: React.FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const { client, open, handleCancel, setOpenSnackbar, setSnackbarVarient } = props;

  const [activeStep, setActiveStep] = React.useState(0);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [companyType, setCompanyType] = useState<string>('Residential');
  const [remarks, setRemarks] = useState<string>('');
  const [billingAddress, setBillingAddress] = useState<string>('');
  const [billingUnit, setBillingUnit] = useState<string>('');
  const [billingPostal, setBillingPostal] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [secondaryContactPerson, setSecondaryContactPerson] = useState<string>('');
  const [secondaryContactNumber, setSecondaryContactNumber] = useState<string>('');
  const [secondaryContactEmail, setSecondaryContactEmail] = useState<string>('');
  const [serviceAddress, setServiceAddress] = useState<ServiceAddressModel[]>([]);
  const [isSubmitting, setIsSubmitting]= useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [securityCode, setSecurityCode] = useState<string>('');
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [creditCardNumber, setCreditCardNumber] = useState<string>('');
  const [expire, setExpire] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');

  const resetFormValues = useCallback(() => {
    if (!client) {
      return;
    }
    setName('');
    setCompanyType('Residential');
    setRemarks('');
    setBillingAddress('');
    setBillingUnit('');
    setBillingPostal('');
    setContactPerson('');
    setContactNumber('');
    setContactEmail('');
    setSecondaryContactPerson('');
    setSecondaryContactNumber('');
    setSecondaryContactEmail('');
    setServiceAddress([]);
    setActiveStep(0);
  }, [client]);

  // This to ensure the form value and errors are reset/cleared when selectedUser changes
  // resetFormValues will be modified everytime user changes, due to useCallback
  useEffect(() => {
    resetFormValues();
    clearFormErrors();
  }, [resetFormValues]);

  const clearFormErrors = () => {
    setNameError('');
  };

  // This is to ensure that the form vale and erors are reset/cleared when user canceled the editing
  const handleOnClose = (event: any) => {
    handleCancel(event);
    resetFormValues();
    clearFormErrors();
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!name || !name.trim()) {
      setNameError('Please enter company name');
      ret = false;
    }

    return ret;
  };

  const getSteps = () => {
    return ['Select Plan', 'PaymentDetails', 'Purchase Complete'];
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <PaymentDetail
          name={name}
          setName={setName}
          address={address}
          setAddress={setAddress}
          item={item}
          setItem={setItem}
          total={total}
          setTotal={setTotal}
          securityCode={securityCode}
          setSecurityCode={setSecurityCode}
          cardHolderName={cardHolderName}
          setCardHolderName={setCardHolderName}
          setCreditCardNumber={setCreditCardNumber}
          creditCardNumber={creditCardNumber}
          expire={ expire}
          setExpire={setExpire}
          isSubmitting={isSubmitting}
        />
        );
      case 1:
        return (
          <PurchaseComplete            
            isSubmitting={isLoading}
          />
        );
      case 2:
        return (
          <PlanForm
           open={open}
          />
        );
      // default:
      //   return (
      //     <SummaryForm
      //       name={name}
      //       companyType={companyType}
      //       remarks={remarks}
      //       billingAddress={billingAddress}
      //       billingUnit={billingUnit}
      //       billingPostal={billingPostal}
      //       contactPerson={contactPerson}
      //       contactNumber={contactNumber}
      //       contactEmail={contactEmail}
      //       secondaryContactPerson={secondaryContactPerson}
      //       secondaryContactNumber={secondaryContactNumber}
      //       secondaryContactEmail={secondaryContactEmail}
      //     />
      //   );
    }
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    resetFormValues();
  };

  return (
    <Dialog open={open} scroll='body' fullWidth={true} maxWidth='md'>
      <DialogTitle>
        <Typography variant='h4' id='modal-title' className={classes.headerModalText}>
          Add New Client
        </Typography>
        <IconButton size='small' className={classes.closeButton} onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        <div>
          <div>
            <Grid className={classes.contentGrid}>
              <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            </Grid>
          </div>
        </div>
      </DialogContent>
      <DialogButton>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Grid container item justify='center' xs={12} sm={12} md={12} lg={12} xl={12} className={classes.controlDiv}>
                <Button onClick={handleReset} variant='contained' color='primary' className={classes.backButton}>
                  Reset
                </Button>
                <Button variant='contained' className={classes.backButton} onClick={handleBack}>
                  Back
                </Button>
                <SaveButton variant='contained' className={classes.nextButton}>
                  Save
                </SaveButton>
              </Grid>
            </div>
          ) : (
            <div>
              <Grid container item justify='center' xs={12} sm={12} md={12} lg={12} xl={12} className={classes.controlDiv}>
                {activeStep !== 0 ? (
                  <Button variant='contained' className={classes.backButton} onClick={handleBack}>
                    Back
                  </Button>
                ) : (
                  <Button variant='contained' className={classes.cancelButton} onClick={handleOnClose}>
                    Cancel
                  </Button>
                )}
                <NextButton variant='contained' color='primary' className={classes.nextButton} onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Nextp'}
                </NextButton>
              </Grid>
            </div>
          )}
        </div>
      </DialogButton>
    </Dialog>
  );
};

export default CreateClientModal;
