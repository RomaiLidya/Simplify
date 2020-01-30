import React from 'react';

export interface CurrentPageTitleContextData {
  currentPageTitle: string;
  setCurrentPageTitle(title: string): void;
}

export const CurrentPageContext = React.createContext<CurrentPageTitleContextData>({ currentPageTitle: '', setCurrentPageTitle: currentPage => {} });

export const CurrentPageProvider = CurrentPageContext.Provider;
export const CurrentPageConsumer = CurrentPageContext.Consumer;
