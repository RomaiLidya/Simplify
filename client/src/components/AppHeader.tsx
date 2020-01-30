import { AppBar, Avatar, Badge, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Theme, Toolbar, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IdentifyIcon from '@material-ui/icons/PermIdentityRounded';
import LogoutIcon from '@material-ui/icons/PowerSettingsNewRounded';
import axios, { CancelTokenSource } from 'axios';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import React, { FC, useContext, useState, useEffect } from 'react';
import { LOGOUT_URL } from 'constants/url';
import { CurrentUserContext } from 'contexts/CurrentUserContext';
import logo from 'images/favi_w.png';
import { getCurrentUserAvatarName, getCurrentCompanyName, getCurrentUserId } from 'selectors';
import SearchInput from './SearchInput';
import useDebounce from 'hooks/useDebounce';
import ActionSnackBar from './ActionSnackbar';
import UpdateProfileModal from './ProfileModal/UpdateProfileModal';
import { ROLE_BASE_URL, USER_BASE_URL, CLIENT_BASE_URL } from 'constants/url';

interface Props {
  open: boolean;
  handleDrawerOpen(): void;
}

const { REACT_APP_DRAWER_WIDTH = '240' } = process.env;

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: 10,
    width: 30,
    height: 30
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: REACT_APP_DRAWER_WIDTH,
    width: `calc(100% - ${REACT_APP_DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  ListItemIcon: {
    minWidth: theme.spacing(5)
  },
  logo: {
    width: '1em'
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  }
}));

const AppHeader: FC<Props> = props => {
  const classes = useStyles();
  const { currentUser, unsetCurrentUser } = useContext(CurrentUserContext);

  const currentUserAvatarName = getCurrentUserAvatarName(currentUser);
  const companyName = getCurrentCompanyName(currentUser);
  const userProfileId = getCurrentUserId(currentUser);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { open, handleDrawerOpen } = props;
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');

  const [queryString] = useState<string>();
  const [users, setUsers] = useState<UserDetailsModel[]>([]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const [currentEditingUserProfileId, setCurrentEditingUserProfileId] = useState<number>(0);

  const [globalSearchValue, setGlobalSearchValue] = useState<string>('');
  const [openPopper, setOpenPopper] = useState(false);

  const [isSearchingClient, setSearchingClient] = useState<boolean>(false);
  const [isSearchClientError, setSearchClientError] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientDetailsModel[]>([]);

  // Loading all the roles to populate the tabs once
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getAllRoles = async () => {
      try {
        const response = await axios.get(ROLE_BASE_URL, { cancelToken: cancelTokenSource.token });
        setRoles(response.data.roles);
      } catch (err) {
        console.log(err);
      }
    };

    getAllRoles();

    return () => {
      // Canceling the request if component is unmounted
      cancelTokenSource.cancel();
    };
  }, []);

  // Get User Data whenever
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }
      return params.toString();
    };
    const userData = async () => {
      try {
        const url = `${USER_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setUsers(data.users);
      } catch (err) {}
    };

    userData();
    return () => {
      cancelTokenSource.cancel();
    };
  }, [queryString]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfileModal = (userProfileId: number): React.MouseEventHandler => () => {
    handleClose();
    setCurrentEditingUserProfileId(userProfileId);
    setOpenProfileModal(true);
  };

  const handleCancelProfileModal = () => {
    setOpenProfileModal(false);
  };

  const handleLogout = async () => {
    handleClose();

    try {
      await axios.post(LOGOUT_URL);
    } catch (err) {
      // do nothing. Log out even if server request failed
    }

    unsetCurrentUser();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const debouncedSearchTerm = useDebounce(globalSearchValue, 500);

  // Load client data to populate on search list
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    if (debouncedSearchTerm) {
      if (debouncedSearchTerm.length >= 3) {
        const getQueryParams = () => {
          const params = new URLSearchParams();
          if (debouncedSearchTerm) {
            params.append('q', debouncedSearchTerm);
          }
          return params.toString();
        };

        const searchClient = async () => {
          setSearchingClient(true);
          setSearchClientError(false);

          try {
            const url = `${CLIENT_BASE_URL}?${getQueryParams()}`;
            const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
            setClients(data.clients);
            setOpenPopper(true);
          } catch (err) {
            setSearchClientError(true);
          }

          setSearchingClient(false);
        };

        searchClient();

        return () => {
          cancelTokenSource.cancel();
        };
      } else {
        setOpenPopper(false);
      }
    } else {
      setOpenPopper(false);
    }
  }, [debouncedSearchTerm]);
  // Only call effect if debounced search term changes
  return (
    <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='Open drawer'
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <img src={logo} alt='' className={classes.logo} />
        </IconButton>
        <Typography component='h1' variant='h4' color='inherit' noWrap className={classes.title}>
          {companyName}
        </Typography>
        <SearchInput
          isAppbar={true}
          globalSearchValue={globalSearchValue}
          setGlobalSearchValue={setGlobalSearchValue}
          openPopper={openPopper}
          setOpenPopper={setOpenPopper}
          isLoadingData={isSearchingClient}
          clients={clients}
        />
        <IconButton color='inherit'>
          <Badge color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton size='small' color='inherit' onClick={handleClick}>
          <Avatar className={classes.avatar}>{currentUserAvatarName}</Avatar>
        </IconButton>
        <Menu
          id='profile-menu'
          anchorEl={anchorEl}
          keepMounted
          elevation={1}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem onClick={handleOpenProfileModal(userProfileId)}>
            <ListItemIcon className={classes.ListItemIcon}>
              <IdentifyIcon />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon className={classes.ListItemIcon}>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
      <ActionSnackBar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? 'Update is successful' : 'Operation failed'}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
      <UpdateProfileModal
        open={openProfileModal}
        roles={roles}
        user={users[currentEditingUserProfileId - 1]}
        userId={currentEditingUserProfileId}
        handleCancel={handleCancelProfileModal}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
      />
    </AppBar>
  );
};

export default AppHeader;
