import { useEffect, useContext } from 'react';

import { CurrentPageContext } from '../contexts/CurrentPageContext';

const useCurrentPageTitleUpdater = (title: string) => {
  const { setCurrentPageTitle } = useContext(CurrentPageContext);

  // CurrentPage is an input argment, will never change
  // Context will never change
  // is the same as []
  useEffect(() => {
    setCurrentPageTitle(title);
  }, [setCurrentPageTitle, title]);
};

export default useCurrentPageTitleUpdater;
