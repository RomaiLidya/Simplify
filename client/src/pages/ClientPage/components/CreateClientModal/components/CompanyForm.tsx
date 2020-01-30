import React, { useState } from 'react';
import { Grid, TextField, Switch, Typography, Theme, Divider, FormControl, FormControlLabel, RadioGroup, Radio, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
interface Props {
  name: string;
  companyType: string;
  remarks: string;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setCompanyType: React.Dispatch<React.SetStateAction<string>>;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;

  isSubmitting: boolean;
}

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: green[500]
    },
    '&$checked + $track': {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

const useStyles = makeStyles((theme: Theme) => ({
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
  gridClass: {
    paddingRight: theme.spacing(4)
  }
}));

const CompanyForm: React.FC<Props> = props => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClickOpenGST = () => {
    setOpenDialog(true);
  };

  const handleClickOpenSMS = () => {
    setOpenDialog(true);
  };
  const { name, setName, nameError, companyType, setCompanyType } = props;

  const handleChange = (event: any) => {
    setCompanyType(event.target.value);
  };

  return (
    <form noValidate>
      <Typography variant='h5' id='form-title' className={classes.formTitle}>
        Company Details
        <Divider className={classes.divider} />
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={6} sm={6} md={6} lg={6} xl={6} className={classes.gridClass}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='name'
            label='Company Name'
            error={nameError !== ''}
            helperText={nameError}
            value={name}
            onChange={event => setName(event.target.value)}
            autoComplete='off'
          />
          <Typography variant='h6' className={classes.radioTypo}>
            Company Type
          </Typography>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='clientType' name='clientType' value={companyType} onChange={handleChange} row>
              <FormControlLabel value='Residential' control={<Radio color='primary' />} label='Residential' labelPlacement='end' />
              <FormControlLabel value='Commercial' control={<Radio color='primary' />} label='Commercial' labelPlacement='end' />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid xs={6} spacing={8}>
          <Typography variant='h6'>SMS</Typography>
          <FormControlLabel control={<GreenSwitch onChange={handleClickOpenSMS} />} label='Disable' />
          <Typography variant='h6'>GST</Typography>
          <FormControlLabel control={<GreenSwitch onChange={handleClickOpenGST} />} label='Enable' />
        </Grid>
      </Grid>
    </form>
  );
};

export default CompanyForm;
