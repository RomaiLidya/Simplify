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
  IconButton,
  Card,
  CardContent,
  Container,
  CardHeader,
  CardActions
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import axios, { CancelTokenSource } from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import PaymentDetail from './PaymentDetail';
// import PlanForm from './PlanForm';

interface Props {
  open: boolean;
  
}


const tiers = [
  {
    title: 'Basic Plan',
    price: '50',
    description: ['1000 SMS'],
    buttonText: 'Select',
    buttonVariant: 'outlined'
  },
  {
    title: 'Bussines Plan',
    price: '100',
    description: ['2000 SMS'],
    buttonText: 'Select',
    buttonVariant: 'outlined'
  },
  {
    title: 'Enterprise Plan',
    price: '250',
    description: ['5000 SMS'],
    buttonText: 'Select',
    buttonVariant: 'outlined'
  }
];


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
    borderRadius: 9,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#EF965A',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2),
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
  },
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: '#EF965A'
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
    }
}));

const PlanForm: React.FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

 const [activeStep, setActiveStep] = React.useState(0);

  const [isLoading, setLoading] = useState<boolean>(false);


  const getSteps = () => {
    return ['Select Plan', 'Payment Details', 'Complete'];
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };


  return (
      
      <DialogContent>
        <div>
          <div>
            <Grid className={classes.contentGrid}>
              {/* <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography> */}
              {/* {getStepContent(0)} */}
              <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end' >
          {tiers.map(tier => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /month
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map(line => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>   {/* <Button color='secondary' fullWidth>{tier.buttonText}  </Button> */}
                  <Button variant='outlined' color='secondary'  fullWidth  onClick={handleNext}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Select'} 
                        </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
            </Grid>
          </div>
        </div>
        
      </DialogContent>

    
  );
};

export default PlanForm;
