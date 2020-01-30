import React, { useState, Fragment, useEffect } from 'react';
import clsx from 'clsx';
import { Box, Theme, Typography } from '@material-ui/core';
import { Switch, Route } from 'react-router';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';

import ConditionalRoute from 'components/ConditionalRoute';
import LoginPage from 'pages/LoginPage';
import NotFoundPage from 'pages/NotFoundPage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import { CurrentUserProvider } from 'contexts/CurrentUserContext';
import { isUserAuthenticated } from 'selectors';
import AppHeader from 'components/AppHeader';
import { attachTokenToHeader, detachTokenFromHeader } from 'utils/AxiosUtils';
import { GET_CURRENT_USER_URL } from 'constants/url';
import ContractsPage from 'pages/ContractsPage';
import ClientPage from 'pages/ClientPage';
import ClientDetailPage from 'pages/ClientDetailPage';
import JobListPage from 'pages/JobListPage';
import AppDrawer from 'components/AppDrawer';
import ResetPasswordPage from 'pages/ResetPassowordPage';
import SettingsPage from 'pages/SettingsPage';
import VehicleSchedulePage from 'pages/VehicleSchedulePage';
import { CurrentPageProvider } from 'contexts/CurrentPageContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '95vh',
    overflow: 'auto'
  },
  footerPaddingIsLoggedIn: {
    paddingRight: theme.spacing(6)
  }
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('');
  const [CurrentUserData, setCurrentUserData] = useState<CurrentUser>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(true);

  const isLoggedIn = isUserAuthenticated(CurrentUserData);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const setCurrentUser = (currentUser: CurrentUser, token: string): void => {
    localStorage.setItem('token', token);
    attachTokenToHeader(token);

    setCurrentUserData(currentUser);
  };

  const unsetCurrentUser = (): void => {
    localStorage.removeItem('token');
    detachTokenFromHeader();

    setCurrentUserData(undefined);
  };

  useEffect(() => {
    const getPersistedToken = () => {
      return localStorage.getItem('token');
    };

    const getCurrentUserData = async () => {
      setAuthenticating(true);
      const token = getPersistedToken();

      if (token) {
        try {
          const response = await axios.get(GET_CURRENT_USER_URL, { headers: { Authorization: `Bearer ${token}` } });
          const currentUser: CurrentUser = response.data;

          setCurrentUser(currentUser, token);
        } catch (err) {
          unsetCurrentUser();
        }
      }

      setAuthenticating(false);
    };

    getCurrentUserData();
  }, []);

  return isAuthenticating ? null : (
    <Box>
      <CurrentUserProvider
        value={{
          currentUser: CurrentUserData,
          setCurrentUser,
          unsetCurrentUser
        }}
      >
        <CurrentPageProvider
          value={{
            currentPageTitle,
            setCurrentPageTitle
          }}
        >
          <div className={classes.root}>
            {isLoggedIn && (
              <Fragment>
                <AppHeader open={openDrawer} handleDrawerOpen={handleDrawerOpen} />
                <AppDrawer openDrawer={openDrawer} handleDrawerClose={handleDrawerClose} />
              </Fragment>
            )}
            <main className={classes.content}>
              {isLoggedIn && <div className={classes.appBarSpacer} />}
              <Switch>
                <ConditionalRoute exact={true} path={'/'} routeCondition={!isLoggedIn} component={LoginPage} redirectTo={'/jobs'} />
                <ConditionalRoute exact={true} path={'/resetpassword'} routeCondition={!isLoggedIn} component={ResetPasswordPage} redirectTo={'/'} />
                <ConditionalRoute
                  exact={true}
                  path={'/forgotpassword'}
                  routeCondition={!isLoggedIn}
                  component={ForgotPasswordPage}
                  redirectTo={'/jobs'}
                />
                <ConditionalRoute exact={true} path={'/jobs'} routeCondition={isLoggedIn} component={JobListPage} redirectTo={'/'} />
                <ConditionalRoute exact={true} path={'/contracts'} routeCondition={isLoggedIn} component={ContractsPage} redirectTo={'/'} />
                <ConditionalRoute exact={true} path={'/clients'} routeCondition={isLoggedIn} component={ClientPage} redirectTo={'/'} />
                <ConditionalRoute exact={true} path={'/clients/:id'} routeCondition={isLoggedIn} component={ClientDetailPage} redirectTo={'/'} />
                <ConditionalRoute exact={true} path={'/settings'} routeCondition={isLoggedIn} component={SettingsPage} redirectTo={'/'} />
                
                <ConditionalRoute exact={true} path={'/vehicleschedule'} routeCondition={isLoggedIn} component={VehicleSchedulePage} redirectTo={'/'} />
                <Route component={NotFoundPage} />
              </Switch>
            </main>
          </div>
        </CurrentPageProvider>
      </CurrentUserProvider>
      <Typography
        variant={isLoggedIn ? 'body2' : 'h6'}
        color='textSecondary'
        align={!isLoggedIn ? 'center' : 'right'}
        className={clsx({ [classes.footerPaddingIsLoggedIn]: isLoggedIn })}
      >
        {'© 2020 Simplify All Rights Reserved'}
      </Typography>
    </Box>
  );
};

export default App;
