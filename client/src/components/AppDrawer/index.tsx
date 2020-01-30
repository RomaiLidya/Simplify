import { Divider, Drawer, IconButton, List, Theme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import JobsIcon from '@material-ui/icons/BusinessCenter';
import ContractsIcon from '@material-ui/icons/LibraryBooks';
import VehicleScheduleIcon from '@material-ui/icons/AirportShuttle';
import ClientsIcon from '@material-ui/icons/SupervisorAccount';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FC } from 'react';
import logo from '../../images/simplify_logoC.png';
import DrawerItem from './components/DrawerItem';

interface Props {
  openDrawer: boolean;
  handleDrawerClose(): void;
}

const { REACT_APP_DRAWER_WIDTH = '240' } = process.env;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: +REACT_APP_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  logoContainer: {
    textAlign: 'center'
  },
  logo: {
    width: '50%',
    margin: `0px ${theme.spacing(8)}px`
  }
}));

const AppDrawer: FC<Props> = props => {
  const classes = useStyles();
  const { openDrawer, handleDrawerClose } = props;

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: clsx(classes.drawerPaper, !openDrawer && classes.drawerPaperClose)
      }}
      open={openDrawer}
    >
      <div className={classes.toolbarIcon}>
        <div className={classes.logoContainer}>
          <img src={logo} alt='' className={classes.logo} />
        </div>

        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <DrawerItem Icon={JobsIcon} path='/jobs' label='Job List' />
        <DrawerItem Icon={ContractsIcon} path='/contracts' label='Contract List' />
        <DrawerItem Icon={VehicleScheduleIcon} path='/vehicleschedule' label='Vehicle Schedule' />
        <DrawerItem Icon={ClientsIcon} path='/clients' label='Clients' />
        
        <Divider />
        <DrawerItem Icon={SettingsIcon} path='/settings' label='Settings' />
      </List>
    </Drawer>
  );
};

export default AppDrawer;
