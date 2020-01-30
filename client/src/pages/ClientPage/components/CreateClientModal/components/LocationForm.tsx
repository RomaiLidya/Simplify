import React from 'react';
import { Checkbox, Fab, Grid, TextField, Typography, Theme, Tooltip, Divider, FormControlLabel, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

interface Props {
  billingAddress: string;
  billingUnit: string;
  billingPostal: string;
  serviceAddress: ServiceAddressModel[];
  setBillingAddress: React.Dispatch<React.SetStateAction<string>>;
  setBillingUnit: React.Dispatch<React.SetStateAction<string>>;
  setBillingPostal: React.Dispatch<React.SetStateAction<string>>;
  setServiceAddress: React.Dispatch<React.SetStateAction<ServiceAddressModel[]>>;

  isSubmitting: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  formTitle: {
    textTransform: 'uppercase'
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  gridClass: {
    paddingRight: theme.spacing(4)
  },
  nextGridClass: {
    display: 'flex',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  nextGridClassUnit: {
    paddingRight: theme.spacing(2)
  },
  fab: {
    marginLeft: 0,
    marginTop: theme.spacing(3)
  },
  fabAlign: {
    textAlign: 'left'
  },
  icon: {
    fontSize: 25
  }
}));

const LocationForm: React.FC<Props> = props => {
  const classes = useStyles();

  const {
    billingAddress,
    setBillingAddress,
    billingUnit,
    setBillingUnit,
    billingPostal,
    setBillingPostal,
    serviceAddress,
    setServiceAddress
  } = props;
  const { isSubmitting } = props;

  const handleAddSubServiceAddress = () => {
    const serviceAddressArray: ServiceAddressModel = {
      id: 0,
      contactPerson: '',
      contactNumber: '',
      secondaryContactPerson: '',
      secondaryContactNumber: '',
      country: '',
      address: '',
      postalCode: '',
      ClientId: 0,
      new: true
    };
    const subServiceAddress = [...serviceAddress];
    subServiceAddress.push(serviceAddressArray);
    setServiceAddress(subServiceAddress);
  };

  const handleRemoveSubServiceAddress = (i: number): React.MouseEventHandler => () => {
    const subServiceAddress = [...serviceAddress];
    subServiceAddress.splice(i, 1);
    setServiceAddress(subServiceAddress);
  };

  return (
    <form noValidate>
      <Grid container spacing={1}>
        <Grid xs={6} sm={6} md={6} lg={6} xl={6} className={classes.gridClass}>
          <Typography variant='h5' id='form-title' className={classes.formTitle}>
            Location
            <Divider className={classes.divider} />
          </Typography>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='address'
            label='Address'
            value={billingAddress}
            onChange={event => setBillingAddress(event.target.value)}
            autoComplete='off'
          />
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='unit'
                label='Unit No'
                value={billingUnit}
                onChange={event => setBillingUnit(event.target.value)}
                autoComplete='off'
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='postalCode'
                label='Postal Code'
                value={billingPostal}
                onChange={event => setBillingPostal(event.target.value)}
                autoComplete='off'
              />
            </Grid>
            {serviceAddress.map((nextServiceAddress, i) => (
              <Grid container key={`${i}`} spacing={1} className={classes.nextGridClass}>
                <Grid container direction='row' justify='flex-end' alignItems='center'>
                  <Tooltip title='Delete'>
                    <IconButton size='small' onClick={handleRemoveSubServiceAddress(i)}>
                      <DeleteIcon className={classes.icon} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='address'
                    label={`Address ${i + 1}`}
                    value={nextServiceAddress.address}
                    onChange={event => setBillingAddress(event.target.value)}
                    autoComplete='off'
                  />
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} xl={6} className={classes.nextGridClassUnit}>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='unit'
                    label={`Unit No. ${i + 1}`}
                    value={billingUnit}
                    onChange={event => setBillingUnit(event.target.value)}
                    autoComplete='off'
                  />
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='unit'
                    label={`Postal Code ${i + 1}`}
                    value={billingUnit}
                    onChange={event => setBillingUnit(event.target.value)}
                    autoComplete='off'
                  />
                </Grid>
              </Grid>
            ))}
            <Tooltip title='Add Service Address' placement='right'>
              <Fab size='small' color='primary' aria-label='Add' className={classes.fab} onClick={handleAddSubServiceAddress}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography variant='h5' id='form-title' className={classes.formTitle}>
            Billing
            <Divider className={classes.divider} />
          </Typography>
          <FormControlLabel control={<Checkbox checked={false} value='checkedA' color='primary' />} label='Same As First Service Address' />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='address'
            label='Address'
            value={billingAddress}
            onChange={event => setBillingAddress(event.target.value)}
            autoComplete='off'
          />
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='unit'
                label='Unit No'
                value={billingUnit}
                onChange={event => setBillingUnit(event.target.value)}
                autoComplete='off'
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='postalCode'
                label='Postal Code'
                value={billingPostal}
                onChange={event => setBillingPostal(event.target.value)}
                autoComplete='off'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default LocationForm;
