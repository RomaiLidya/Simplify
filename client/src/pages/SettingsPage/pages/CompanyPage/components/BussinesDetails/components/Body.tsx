import React, { FC, useState, Fragment } from 'react';
import { TableRow, Menu,makeStyles, Theme, Button, Switch, FormControlLabel, withStyles, TextField, MenuItem } from '@material-ui/core';
import {  green, red } from '@material-ui/core/colors';
// import EditIcon from '@material-ui/icons/Edit';
// import UnlockIcon from '@material-ui/icons/LockOpen';
// import NewIcon from '@material-ui/icons/FiberNew';
// import Skeleton from 'react-loading-skeleton';
// import axios from 'axios';

// import { GET_UNLOCK_USER_URL, GET_DEACTIVATE_USER_URL, GET_ACTIVATE_USER_URL } from 'constants/url';
import BodyCell from 'components/BodyCell';
import AvTimerIcon from '@material-ui/icons/AvTimer';

interface Props {
  isLoadingData: boolean;
}


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
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
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  },
}));

const Body: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData } = props;

  


  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='10%' isComponent={true}>
          Bussines Currency:
        </BodyCell>
        <BodyCell cellWidth='10%'>
          <TextField select margin='dense' fullWidth id='qualification' label='Select Currency' variant='outlined' autoComplete='off'>
         
            <MenuItem >AFN - Afghan Afghani</MenuItem>
            <MenuItem >ALL - Albanian Lek</MenuItem>
            <MenuItem >DZD - Algerian Dinar</MenuItem>
            <MenuItem >USD - US Dollar</MenuItem>
            <MenuItem >EUR - Euro</MenuItem>
            <MenuItem >AOA - Angolan Kwanza</MenuItem>
            <MenuItem >XCD - East Caribbean Dollar</MenuItem>
            <MenuItem >XCD - East Caribbean Dollar</MenuItem>
            
            <MenuItem >ARS - Argentine Peso</MenuItem>
            <MenuItem >AMD - Armenian Dram</MenuItem>
            <MenuItem >AWG - Aruban Florin</MenuItem>
            <MenuItem >AUD - Australian Dollar</MenuItem>

            <MenuItem >AZN - Azerbaijan Manat</MenuItem>
            <MenuItem >BSD - Bahamian Dollar</MenuItem>
            <MenuItem >BHD - Bahraini Dinar</MenuItem>
            <MenuItem >INR - Indian Rupee</MenuItem>

            <MenuItem >SGD - Singapore Dollar</MenuItem>
            <MenuItem >THB - Thai Baht</MenuItem>
            <MenuItem >MYR - Malaysian Ringgit</MenuItem>
            <MenuItem >PHP - Philippine Peso</MenuItem>
            

          </TextField>
        </BodyCell>
        <BodyCell cellWidth='10%' isComponent={true}>
          Operating House:
        </BodyCell>
        <BodyCell cellWidth='1%' pL='5px' pR='5px' isComponent={true}>
        <form className={classes.root} noValidate autoComplete="off" >
        {/* <AvTimerIcon className={classes.extendedIcon} /> */}
        <TextField id="standard-basic" label="Start Time" /></form>
        </BodyCell>
        </TableRow>

      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='10%' isComponent={true}>
          Region Timezone:
        </BodyCell>
        <BodyCell cellWidth='10%'>
        <TextField select margin='dense' fullWidth id='qualification' label='Select Timezone' variant='outlined' autoComplete='off'>
            <MenuItem ><em>2 hours before Job (default)</em></MenuItem>
            <MenuItem ><em>1 day before Job at 1200hrs</em></MenuItem>
            <MenuItem ><em>2 days before Job at 1200hrs</em></MenuItem>
            <MenuItem ><em>3 days before Job at 1200hrs</em></MenuItem>
          </TextField>
        </BodyCell>
        <BodyCell cellWidth='10%' isComponent={true}>
          
        </BodyCell>
        <BodyCell cellWidth='1%' pL='10px' pR='10px' isComponent={true}>
        <form className={classes.root} noValidate autoComplete="off" >
        
        <TextField id="standard-basic" label="End Time" /></form>
        </BodyCell>
        
      </TableRow>
      <TableRow>
        <BodyCell cellWidth='1%'>
          <Button variant='contained' color='secondary'>
            Update
          </Button>
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default Body;
