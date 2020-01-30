import React, { FC, useState } from 'react';
import { Button, createStyles, Divider, Grid, makeStyles, Paper, TextField, Theme, Typography } from '@material-ui/core';

import NumberFormatCustom from 'components/NumberFormatCustom';

interface Props {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  // unitNumber: string;
  // setUnitNumber: React.Dispatch<React.SetStateAction<string>>;
  // postalCode: string;
  // setPostalCode: React.Dispatch<React.SetStateAction<string>>;
  contactNumber: string;
  setContactNumber: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  addressError: string;
  // postalCodeError: string;
  contactNumberError: string;
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
}  

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightPaper: {
      padding: theme.spacing(2),
      textAlign: 'justify',
      marginBottom: theme.spacing(3)
    },
    dividerStyle: {
      marginTop: theme.spacing(1.5)
    },
    textFieldFont: {
      fontSize: '13px',
      height: 18
    }
  })
);

const RightContent: FC<Props> = props => {
  const classes = useStyles();

  const { name, setName, nameError } = props;
  const { address, setAddress, addressError } = props;
  // const { unitNumber, setUnitNumber } = props;
  // const { postalCode, setPostalCode, postalCodeError } = props;
  const { contactNumber, setContactNumber, contactNumberError } = props;

  const { onSubmit } = props;

  return (
    <Paper className={classes.rightPaper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography color='primary' variant='body2' display='block' gutterBottom>
            Profile Info
          </Typography>
          <Typography color='textSecondary' variant='caption' display='block' gutterBottom>
            You can edit your profile information here
          </Typography>
          <Divider className={classes.dividerStyle} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin='dense'
            required
            fullWidth
            id='companyName'
            label='Company Name'
            error={nameError !== ''}
            helperText={nameError}
            value={name}
            onChange={event => setName(event.target.value)}
            variant='outlined'
            autoComplete='off'
            multiline
            rowsMax='4'
            InputProps={{
              classes: {
                input: classes.textFieldFont
              }
            }}
            InputLabelProps={{
              className: classes.textFieldFont
            }}
          />
          <TextField
            margin='dense'
            required
            fullWidth
            id='contactNumber'
            label='Contact Number'
            error={contactNumberError !== ''}
            helperText={contactNumberError}
            value={contactNumber}
            onChange={event => setContactNumber(event.target.value)}
            variant='outlined'
            autoComplete='off'
            InputProps={{
              classes: {
                input: classes.textFieldFont
              },
              inputComponent: NumberFormatCustom as any,
              inputProps: {
                format: '###############'
              }
            }}
            InputLabelProps={{
              className: classes.textFieldFont
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin='dense'
            required
            fullWidth
            id='companyAddress'
            label='Company Address'
            error={addressError !== ''}
            helperText={addressError}
            value={address}
            onChange={event => setAddress(event.target.value)}
            variant='outlined'
            autoComplete='off'
            multiline
            rowsMax='4'
            InputProps={{
              classes: {
                input: classes.textFieldFont
              }
            }}
            InputLabelProps={{
              className: classes.textFieldFont
            }}
          />
          {/* <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                margin='dense'
                fullWidth
                id='unitNumber'
                label='Unit Number'
                value={unitNumber}
                onChange={event => setUnitNumber(event.target.value)}
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
            </Grid> */}
            {/* <Grid item xs={6}>
              <TextField
                margin='dense'
                required
                fullWidth
                id='postalCode'
                label='Postal Code'
                error={postalCodeError !== ''}
                helperText={postalCodeError}
                value={postalCode}
                onChange={event => setPostalCode(event.target.value)}
                variant='outlined'
                autoComplete='off'
                InputProps={{
                  classes: {
                    input: classes.textFieldFont
                  },
                  inputComponent: NumberFormatCustom as any,
                  inputProps: {
                    format: '##########'
                  }
                }}
                InputLabelProps={{
                  className: classes.textFieldFont
                }}
              />
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.dividerStyle} />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction='row' justify='flex-end' alignItems='flex-end'>
            <Button onClick={onSubmit} variant='contained' color='secondary'>
              Save
            </Button>
          </Grid>
        </Grid>
      {/* </Grid> */}
    </Paper>
  );
};

export default RightContent;
