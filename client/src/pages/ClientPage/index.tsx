import React, { FC, useState, useEffect, Fragment } from 'react';
import clsx from 'clsx';
import { Button, Container, Divider, Grid, IconButton, makeStyles, Paper, Theme, Typography, Tooltip } from '@material-ui/core';

import { PopperPlacementType } from '@material-ui/core/Popper';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import useRouter from 'hooks/useRouter';
import useDebounce from 'hooks/useDebounce';
import axios, { CancelTokenSource } from 'axios';
import PositionedPopper from 'components/PositionedPopper';
import SearchInput from 'components/SearchInput';
import ClientTable from './components/ClientTable';
import CreateClientModal from './components/CreateClientModal/';
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

const ClientPage: FC = () => {
  const classes = useStyles();

  const { history } = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingClient, setSearchingClient] = useState<boolean>(false);
  const [isSearchClientError, setSearchClientError] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientDetailsModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCrateClientModal, setOpenCrateClientModal] = useState<boolean>(false);
  const [currentEditingClientIndex, setCurrentEditingClientIndex] = useState<number>(0);

  const [openCheckboxMenusPopper, setOpenCheckboxMenusPopper] = useState(false);
  const [anchorElCheckboxMenusPopper, setAnchorElCheckboxMenusPopper] = useState<HTMLElement | null>(null);
  const [placementCheckboxMenusPopper, setPlacementCheckboxMenusPopper] = useState<PopperPlacementType>();

  const [checked, setChecked] = useState<number[]>([]);

  const countChecked = checked.length;

  // Search Client whenever rowsPerPage, currentPage, queryString
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

        const searchClient = async () => {
      setSearchingClient(true);
      setSearchClientError(false);

      try {
        const url = `${CLIENT_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setClients(data.clients);
      } catch (err) {
        setSearchClientError(true);
      }

      setSearchingClient(false);
      setChecked([]);
    };

    searchClient();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString]);

  const updateIndividualUser = (userIndex: number) => {};

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  const handleSearch = (searchQuery: string) => {
    performActionAndRevertPage(setQueryString, searchQuery);
  };

  const debouncedSearchTerm = useDebounce(query, 500);
  // Load client data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleOpenCreateClient = () => {
    setOpenCrateClientModal(true);
  };

  const handleCloseCreateClient = () => {
    setOpenCrateClientModal(false);
  };

  const handleViewClient = (clientId: number): React.MouseEventHandler => () => {
    history.push({ pathname: `/clients/${clientId}`, state: { selectedTab: 0 } });
  };

  const handleViewContract = (clientId: number): React.MouseEventHandler => () => {
    history.push({ pathname: `/clients/${clientId}`, state: { selectedTab: 1 } });
  };

  const handleViewJob = (clientId: number): React.MouseEventHandler => () => {
    history.push({ pathname: `/clients/${clientId}`, state: { selectedTab: 2 } });
  };
  
  const renderLeftHeader = () => {
    return countChecked !== 0 ? (
      <Typography variant='h4' color='primary'>
        {`${countChecked} selected`}
      </Typography>
    ) : (
      <div>
        <Typography variant='h4' color='primary'>
          Client List Overview
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
          <SearchInput
            withBorder
            withTransition={false}
            width={150}
            placeHolder='Search Clients...'
            iconColor='#989898'
            tableSearchValue={query}
            setTableSearchValue={setQuery}
          />
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
            Clients List
          </Typography>
        </Grid>
        <Grid item sm={6} className={classes.addGrid}>
          <Button color='primary' size='medium' variant='contained' className={classes.addButton} onClick={handleOpenCreateClient}>
            <PersonAddIcon className={classes.extendedIcon} />
            Add Client
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
        <ClientTable
          isLoadingData={isSearchingClient}
          clients={clients}
          count={count}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleChangePage={(event, page) => setCurrentPage(page)}
          handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
          handleViewClient={handleViewClient}
          handleViewContract={handleViewContract}
          handleViewJob={handleViewJob}
          checked={checked}
          setChecked={setChecked}
        />
      </Paper>
      <CreateClientModal
        open={openCrateClientModal}
        client={clients[currentEditingClientIndex]}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleCancel={handleCloseCreateClient}
      />
    </Container>
  );
};

export default ClientPage;
