import React,{useState} from 'react';
import { Grid, TextField, Switch,Typography, Theme, Divider, FormControl, FormControlLabel, RadioGroup, Radio,  withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
interface Props {
  name: string;
  address: string;
  item: string;
  total: number;

  cardHolderName : string;
  expire: string;
  creditCardNumber: string;
  securityCode: string;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setItem: React.Dispatch<React.SetStateAction<string>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;

  setCardHolderName: React.Dispatch<React.SetStateAction<string>>;
  setExpire: React.Dispatch<React.SetStateAction<string>>;
  setCreditCardNumber: React.Dispatch<React.SetStateAction<string>>;
  setSecurityCode: React.Dispatch<React.SetStateAction<string>>;
  
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
    textTransform: 'uppercase',
    marginTop: theme.spacing(5)
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
  const { name, setName, item, setItem, address, setAddress, total, setTotal, securityCode, setSecurityCode, expire, setExpire, creditCardNumber, setCreditCardNumber,} = props;
  const { isSubmitting } = props;
 return (
    <form noValidate>
      <Typography variant='h5' id='form-title' className={classes.formTitle}>
       Billing Informations
        <Divider className={classes.divider} />
      </Typography>
    
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} >
          <Typography variant='body2'> Customer Name</Typography>
        </Grid>
        <Grid item xs={12} sm={6} >
          <Typography variant='body2'> Item</Typography>
        </Grid>
        <Grid item xs={12} sm={6} >
          <Typography variant='body2'> Billing Address</Typography>
        </Grid>
        <Grid item xs={12} sm={6} >
          <Typography variant='body2'> Total</Typography>
        </Grid>
           </Grid>
 
   <Typography variant='h5' id='form-title' className={classes.formTitle}>
   Payment Information
        <Divider className={classes.divider} />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} >
      <Typography> Card Holder Name*</Typography>
        <TextField
       
        fullWidth
        label='Yourname'
        variant='outlined'
      
        />
        </Grid>
        <Grid item xs={12} sm={6} >
        <Typography> Credit Card  Number*</Typography>
        <TextField
          fullWidth
          id='1234 1234 1234 1234'
          label='1234 1234 1234 1234'
          variant='outlined'
         
        />
        </Grid>
        <Grid item xs={12} sm={6} >
        <Typography> Expire Date*</Typography>
        <TextField
         required
         fullWidth
         id='companyAddress'
         label='MM/YY'
         variant='outlined'
         autoComplete='off'
         multiline
         rowsMax='4'
        />
        </Grid>
        <Grid item xs={12} sm={6} >
        <Typography> Security Code*</Typography>
        <TextField
        fullWidth
        id='companyAddress'
        label='CVC'
        variant='outlined'
        autoComplete='off'
        multiline
        rowsMax='4'
        />
        </Grid>
           </Grid>
    </form>
  );
};

export default PaymentDetail;
