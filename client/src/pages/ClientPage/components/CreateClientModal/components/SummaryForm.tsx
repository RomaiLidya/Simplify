import React from 'react';
import { Grid, Typography, Theme, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface Props {
  name: string;
  companyType: string;
  remarks: string;
  billingAddress: string;
  billingUnit: string;
  billingPostal: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  secondaryContactEmail: string;
}

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
  },
  formTitle: {
    textTransform: 'uppercase'
  },
  radioTypo: {
    marginTop: theme.spacing(2),
    textTransform: 'uppercase'
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  dividerContent: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  gridClass: {
    paddingRight: theme.spacing(4)
  },
  secondGridClass: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}));

const SummaryForm: React.FC<Props> = props => {
  const classes = useStyles();

  const {
    name,
    companyType,
    remarks,
    billingAddress,
    billingUnit,
    billingPostal,
    contactPerson,
    contactNumber,
    contactEmail,
    secondaryContactPerson,
    secondaryContactNumber,
    secondaryContactEmail
  } = props;

  return (
    <Grid container spacing={1}>
      <Grid xs={6} sm={6} md={6} lg={6} xl={6} className={classes.gridClass}>
        <Typography variant='h5' className={classes.formTitle}>
          Company Details
          <Divider className={classes.divider} />
        </Typography>
        <Typography variant='h6'>Name : {name}</Typography>
        <Typography variant='h6'>Type : {companyType}</Typography>
      </Grid>
      <Grid xs={6} sm={6} md={6} lg={6} xl={6} className={classes.gridClass}>
        <Typography variant='h5' className={classes.formTitle}>
          Company Contact
          <Divider className={classes.divider} />
        </Typography>
        <Typography variant='h6'>Contact Person : {contactPerson}</Typography>
        <Typography variant='h6'>Contact Number : {contactNumber}</Typography>
        <Typography variant='h6'>Contact Email : {contactEmail}</Typography>
        {secondaryContactPerson !== '' ? (
          <div>
            <Typography variant='h6'>Secondary Contact Person : {secondaryContactPerson}</Typography>
            <Typography variant='h6'>Secondary Contact Number : {secondaryContactNumber}</Typography>
            <Typography variant='h6'>Secondary Contact Email : {secondaryContactEmail}</Typography>
          </div>
        ) : (
          ''
        )}
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} xl={12} className={classes.secondGridClass}>
        <Typography variant='h5' className={classes.formTitle}>
          Location & Billing Address
          <Divider className={classes.divider} />
        </Typography>
        <Typography variant='h6'>
          Billing Address : {billingAddress}, {billingUnit}
        </Typography>
        <Typography variant='h6'>Postal Code : {billingPostal}</Typography>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} xl={12} className={classes.secondGridClass}>
        <Typography variant='h5' className={classes.formTitle}>
          Remarks
          <Divider className={classes.divider} />
        </Typography>
        <Typography variant='h6'>Remarks : {remarks}</Typography>
      </Grid>
    </Grid>
  );
};

export default SummaryForm;
