import { useState, useEffect, useContext } from 'react';
import axios, { CancelTokenSource } from 'axios';

import { LOGIN_URL } from '../constants/url';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

interface Credentials {
  username: string;
  password: string;
}

interface AuthenticationResponse {
  currentUser: CurrentUser;
  token: string;
}

type UseAuthenticationReturnType = [
  { data: any; isLoading: boolean; isAuthenticationError: boolean },
  React.Dispatch<React.SetStateAction<Credentials>>
];

const useAuthentication = (): UseAuthenticationReturnType => {
  const currentUserContext = useContext(CurrentUserContext);

  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAuthenticationError, setAuthenticationError] = useState<boolean>(false);

  const { username, password } = credentials;

  useEffect(() => {
    if (!username || !password) {
      return;
    }

    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const login = async () => {
      setLoading(true);
      setAuthenticationError(false);

      try {
        const response = await axios.post(LOGIN_URL, { username, password }, { cancelToken: cancelTokenSource.token });
        const { currentUser, token }: AuthenticationResponse = response.data;

        setData(response.data);

        // Setting the CurrentUser
        currentUserContext.setCurrentUser(currentUser, token);
      } catch (err) {
        setAuthenticationError(true);
      }

      setLoading(false);
    };

    login();

    return () => {
      // Canceling the login request if component is unmounted
      cancelTokenSource.cancel();
    };
  }, [username, password, currentUserContext]);

  return [{ data, isLoading, isAuthenticationError }, setCredentials];
};

export default useAuthentication;
