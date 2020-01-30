import { useContext } from 'react';

import { __RouterContext as RouterContext, match } from 'react-router';

interface MatchParams {
  id?: string;
}

const useRouter = () => {
  const { history, location, match } = useContext(RouterContext);

  return {
    history,
    location,
    match: match as match<MatchParams>
  };
};

export default useRouter;
