import React, { FC, useState, Fragment } from 'react';
import { TableRow, Menu,makeStyles, Theme, Button, Switch, FormControlLabel, withStyles, TextField, MenuItem } from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
import SMSContentDialog  from './components/SMSContentDialog';
import useRouter from 'hooks/useRouter';

import { GET_UNLOCK_USER_URL, GET_DEACTIVATE_USER_URL, GET_ACTIVATE_USER_URL } from 'constants/url';
import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
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
  tableRow: {
    height: 64
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'left'
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'left'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  roleText: {
    color: grey[500]
  },
  circle: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: green[500],
    marginRight: theme.spacing(1),
    content: "''"
  },
  redCircle: {
    backgroundColor: red[500]
  },
  actionCell: {
    '& > :nth-child(n+2)': {
      marginLeft: theme.spacing(1)
    }
  },
  wrapper: {
    position: 'relative'
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1,
    top: -4,
    left: -4
  },
  newIcon: {
    color: green[500]
  }
})); 

const SMSContent: FC<Props> = props => {
  const { history } = useRouter();
  const classes = useStyles();
  const { isLoadingData } = props;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openPurchasePlan, setOpenPurchasePlan] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  
    
  const handleClosePurchasePlan = () => {
    setOpenPurchasePlan(false);
  };
 
  const handleOpenCreateClient = () => {
    setOpenPurchasePlan(true);
  };

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
       
        <FormControlLabel onChange={handleOpenCreateClient} control={<GreenSwitch />} label='DISABLE' />
      </TableRow>

      <SMSContentDialog
        open={openPurchasePlan}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleCancel={handleClosePurchasePlan}
      />
          </Fragment>
  );
};

export default SMSContent;
