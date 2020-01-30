import React, { useState } from 'react';
import { Grid, TextField, Typography, Fab, Theme, Tooltip, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';

interface Props {
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  secondaryContactEmail: string;

  setContactPerson: React.Dispatch<React.SetStateAction<string>>;
  setContactNumber: React.Dispatch<React.SetStateAction<string>>;
  setContactEmail: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryContactPerson: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryContactNumber: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryContactEmail: React.Dispatch<React.SetStateAction<string>>;

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
  secondGridClass: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  fab: {
    marginLeft: 0,
    marginTop: theme.spacing(3)
  },
  fabAlign: {
    textAlign: 'left'
  }
}));

const ContactForm: React.FC<Props> = props => {
  const classes = useStyles();

  const {
    contactPerson,
    contactNumber,
    contactEmail,
    secondaryContactPerson,
    secondaryContactNumber,
    secondaryContactEmail,
    setContactPerson,
    setContactNumber,
    setContactEmail,
    setSecondaryContactPerson,
    setSecondaryContactNumber,
    setSecondaryContactEmail
  } = props;
  const { isSubmitting } = props;
  const [secondaryContact, setSecondaryContact] = useState<boolean>(false);

  const handleAddSecondaryContact = () => {
    setSecondaryContact(true);
  };

  return (
    <form noValidate>
      <Grid container spacing={1}>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} className={classes.gridClass}>
          <Typography variant='h5' id='form-title' className={classes.formTitle}>
            Contact Details
            <Divider className={classes.divider} />
          </Typography>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='contactPersonName1'
            label='Contact Person Name 01'
            value={contactPerson}
            onChange={event => setContactPerson(event.target.value)}
            autoComplete='off'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='contactEmail1'
            label='Email Address 01'
            value={contactEmail}
            onChange={event => setContactEmail(event.target.value)}
            autoComplete='off'
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='contactNumber1'
            label='Phone Number 01'
            value={contactNumber}
            onChange={event => setContactNumber(event.target.value)}
            autoComplete='off'
          />
        </Grid>
      </Grid>
      {secondaryContact === true ? (
        <Grid container spacing={1}>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} className={classes.secondGridClass}>
            <Typography variant='h5' id='form-title' className={classes.formTitle}>
              Secondary Contact Details
              <Divider className={classes.divider} />
            </Typography>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='contactPersonName2'
              label='Contact Person Name 02'
              value={secondaryContactPerson}
              onChange={event => setSecondaryContactPerson(event.target.value)}
              autoComplete='off'
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='contactEmail2'
              label='Email Address 02'
              value={secondaryContactEmail}
              onChange={event => setSecondaryContactEmail(event.target.value)}
              autoComplete='off'
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='contactNumber2'
              label='Phone Number 02'
              value={secondaryContactNumber}
              onChange={event => setSecondaryContactNumber(event.target.value)}
              autoComplete='off'
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1}>
          <Grid item xs className={classes.fabAlign}>
            <Tooltip title='Add Secondary Contact' placement='right'>
              <Fab onClick={handleAddSecondaryContact} size='small' color='primary' aria-label='Add' className={classes.fab}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

export default ContactForm;
