/*
  Separating out the context file will prevent circular dependencies for the imports
*/

import React from 'react';

export interface CurrentUserContextData {
  currentUser?: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser, token: string) => void;
  unsetCurrentUser: () => void;
}

export const CurrentUserContext = React.createContext<CurrentUserContextData>({
  setCurrentUser: () => {},
  unsetCurrentUser: () => {}
});

export const CurrentUserProvider = CurrentUserContext.Provider;
export const CurrentUserConsumer = CurrentUserContext.Consumer;
