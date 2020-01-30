import React, { FC, useState, useEffect, Fragment } from 'react';
import clsx from 'clsx';
import { Button, Container, Divider, Grid, IconButton, makeStyles, Paper, Theme, Typography, Tooltip } from '@material-ui/core';
import useRouter from 'hooks/useRouter';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import useDebounce from 'hooks/useDebounce';
import axios, { CancelTokenSource } from 'axios';
import { CLIENT_BASE_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },

  divider: {
    marginBottom: theme.spacing(4)
  },
  paper: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    margin: 'auto'
  },
  addGrid: {
    textAlign: 'end'
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  },
  headerColumn: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  icon: {
    fontSize: 25
  }
}));

const VehiclesSchedulePage: FC = () => {
  const classes = useStyles();
  const { history } = useRouter();
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [vehicleId] = useState<number>(1);
  const [isSearchingClient, setSearchingClient] = useState<boolean>(false);
  const [isSearchClientError, setSearchClientError] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientDetailsModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCrateClientModal, setOpenCrateClientModal] = useState<boolean>(false);

  const [checked, setChecked] = useState<number[]>([]);

  const countChecked = checked.length;

  const handleViewVehicles = (vehicleId: number): React.MouseEventHandler => () => {
    history.push({ pathname: `/vehicleschedule/${vehicleId}` });
  };

  const renderLeftHeader = () => {
    return countChecked !== 0 ? (
      <Typography variant='h4' color='primary'>
        {`${countChecked} selected`}
      </Typography>
    ) : (
      <div>
        <Typography variant='h4' color='primary'>
          Vehicles List Overview
        </Typography>
      </div>
    );
  };

  const renderRightHeader = () => {
    if (countChecked !== 0) {
      return (
        <IconButton size='small'>
          <DeleteIcon className={classes.icon} />
        </IconButton>
      );
    } else {
      return (
        <Fragment>
          <Tooltip title='Filter'>
            <IconButton size='small'>
              <FilterIcon className={classes.icon} />
            </IconButton>
          </Tooltip>
        </Fragment>
      );
    }
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <Typography variant='h4' color='primary'>
            Vehicles Schedule
          </Typography>
        </Grid>
        <Grid item sm={6} className={classes.addGrid}>
          <Button color='primary' size='medium' variant='contained' className={classes.addButton} onClick={handleViewVehicles(vehicleId)}>
            <AirportShuttleIcon className={classes.extendedIcon} />
            View Vehicles
          </Button>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-start' alignItems='center' className={classes.headerColumn}>
              {renderLeftHeader()}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-end' alignItems='center' className={classes.headerColumn}>
              {renderRightHeader()}
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Divider />
      </Paper>
    </Container>
  );
};

export default VehiclesSchedulePage;
