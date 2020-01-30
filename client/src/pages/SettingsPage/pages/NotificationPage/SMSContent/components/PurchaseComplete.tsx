import React,{useState} from 'react';
import { Grid, TextField, Switch,Typography, Theme, Divider, FormControl, FormControlLabel, RadioGroup, Radio,  withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
interface Props {
   
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
    
    textAlign: 'center'
  },
  headerModalText: {
    textAlign: 'center',
    color: '#53A0BE'
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

const PaymentDetail: React.FC<Props> = props => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  
  const handleClickOpenGST = () => {
    setOpenDialog(true);
  };

  const handleClickOpenSMS = () => {
    setOpenDialog(true);
  };
    const { isSubmitting } = props;
 return (
    <form noValidate>
      <Typography variant='h4' id='modal-title' className={classes.headerModalText}> 
      Purchase Successful
      
        
      </Typography>
      <Typography variant='body1' id='modal-title' className={classes.formTitle}> 
   Thank you for your purchase ! Please Check Your Email
           
      </Typography>
     
          
    </form>
  );
};

export default PaymentDetail;
