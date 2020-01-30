import React, { FC, useState, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';

import { Button, IconButton, Theme, Modal, Grid, Paper, TextField, Typography, withStyles } from '@material-ui/core';
import { GET_EDIT_INVOICE_URL } from '../../../constants/url';
import { makeStyles } from '@material-ui/styles';

import CloseIcon from '@material-ui/icons/Close';

interface Props {
  open: boolean;
  contract?: ContractsModel;
  handleCancel(): void;
  updateIndividualInvoice: (updatedContractProperties: Partial<ContractsModel>) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 4,
    maxWidth: 400
  },
  headerFlex: {
    display: 'flex'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  textFieldFont: {
    fontSize: '13px',
    height: 18
  },
  cancelButton: {
    marginRight: theme.spacing(1)
  },
  addButton: {
    color: '#FFFFFF'
  },
  closeButton: {
    marginRight: theme.spacing(-1)
  },
  icon: {
    fontSize: 20
  }
}));

const InvoiceForm: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    open,
    contract,
    handleCancel,
    updateIndividualInvoice,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError
  } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [invoiceNo, setInvoiceNo] = useState<string>('');

  const resetFormValues = useCallback(() => {
    if (!contract) {
      return;
    }

    const { invoiceNo } = contract;

    if (invoiceNo) {
      setInvoiceNo(invoiceNo);
    } else {
      setInvoiceNo('');
    }
  }, [contract]);

  // resetFormValues will be modified everytime user changes, due to useCallback
  useEffect(() => {
    resetFormValues();
  }, [resetFormValues]);

  // This is to ensure that the form value and erors are reset/cleared when user canceled the editing
  const handleOnClose = () => {
    resetFormValues();
    handleCancel();
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      const response = await axios.put(
        `${GET_EDIT_INVOICE_URL(contract!.id)}`,
        {
          invoiceNo
        },
        { cancelToken: cancelTokenSource.token }
      );
      updateIndividualInvoice(response.data);
      handleSetMessageSuccess(`Successfully edit invoice number`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      handleCancel();
    } catch (err) {
      console.log(err);
      handleSetMessageError(`Failed to edit invoice number`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setLoading(false);
  };

  return (
    <Modal aria-labelledby='modal-title' open={open} disableBackdropClick={true}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-start' alignItems='center'>
              <div className={classes.headerFlex}>
                <div className={classes.otherTextCell}>
                  <Typography variant='h5' color='primary'>
                    Edit Invoice Number
                  </Typography>
                </div>
              </div> 
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-end' alignItems='center'>
              <IconButton size='small' onClick={handleOnClose} className={classes.closeButton}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <form noValidate onSubmit={handleOnSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin='dense'
                fullWidth
                id='invoiceNo'
                label='Invoice Number'
                value={invoiceNo}
                onChange={event => setInvoiceNo(event.target.value)}
                variant='outlined'
                autoComplete='off'
                InputProps={{
                  classes: {
                    input: classes.textFieldFont
                  }
                }}
                InputLabelProps={{
                  className: classes.textFieldFont
                }}
              />
            </Grid>
            <Grid container item justify='flex-end'>
              <Button variant='contained' className={classes.cancelButton} onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='secondary' disabled={isLoading}>
                Edit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};

export default InvoiceForm;
