import axios, { AxiosResponse, AxiosError } from 'axios';

import { remountApp } from '..';

export const attachTokenToHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const detachTokenFromHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

export const setUpAxiosInterceptors = () => {
  const onFulfilled = (response: AxiosResponse) => {
    return response;
  };

  const onRejected = (error: AxiosError) => {
    if (error.message === 'Network Error') {
      return;
    }

    const response = error.response;

    if (response && response.data.errorCode === 1) {
      localStorage.removeItem('token');
      remountApp();
    }

    return Promise.reject(response);
  };

  axios.interceptors.response.use(onFulfilled, onRejected);
};
