import React, { FC, useState, Fragment } from 'react';
import { TableRow, Menu,makeStyles, Theme, Button, Switch, FormControlLabel, withStyles, TextField, MenuItem } from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
// import EditIcon from '@material-ui/icons/Edit';
// import UnlockIcon from '@material-ui/icons/LockOpen';
// import NewIcon from '@material-ui/icons/FiberNew';
// import Skeleton from 'react-loading-skeleton';
// import axios from 'axios';

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

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData } = props;

  


  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='10%' isComponent={true}>
          Enable Job Reminders:
        </BodyCell>
        <BodyCell cellWidth='10%'>
          <TextField select margin='dense' fullWidth id='qualification' label='Enable Job Reminders' variant='outlined' autoComplete='off'>
          
            <MenuItem >2 hours before Job (default)</MenuItem>
            <MenuItem >1 day before Job at 1200hrs</MenuItem>
            <MenuItem >2 days before Job at 1200hrs</MenuItem>
            <MenuItem >3 days before Job at 1200hrs</MenuItem>
            
          </TextField>
        </BodyCell>
        <BodyCell cellWidth='10%' isComponent={true}>
          Notification On Job Assignment:
        </BodyCell>
        <BodyCell cellWidth='1%' pL='10px' pR='10px' isComponent={true}>
          <FormControlLabel control={<GreenSwitch />} label='SMS' />
        </BodyCell>
        <BodyCell cellWidth='1%' pL='10px' pR='10px' isComponent={true}>
          <FormControlLabel control={<GreenSwitch />} label='E-Mail' />
        </BodyCell>
      </TableRow>

      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='10%' isComponent={true}>
          Enable UnAssigned Job Reminders:
        </BodyCell>
        <BodyCell cellWidth='10%'>
        <TextField select margin='dense' fullWidth id='qualification' label='Enable UnAssigned Job Reminders' variant='outlined' autoComplete='off'>
            <MenuItem ><em>2 hours before Job (default)</em></MenuItem>
            <MenuItem ><em>1 day before Job at 1200hrs</em></MenuItem>
            <MenuItem ><em>2 days before Job at 1200hrs</em></MenuItem>
            <MenuItem ><em>3 days before Job at 1200hrs</em></MenuItem>
          </TextField>
        </BodyCell>
        <BodyCell cellWidth='10%' isComponent={true}>
          Notification On Job Reschedule:
        </BodyCell>
        <BodyCell cellWidth='1%' pL='10px' pR='10px' isComponent={true}>
          <FormControlLabel control={<GreenSwitch />} label='SMS' />
        </BodyCell>
        <BodyCell cellWidth='1%' pL='10px' pR='10px' isComponent={true}>
          <FormControlLabel control={<GreenSwitch />} label='E-Mail' />
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

export default BodyRow;
