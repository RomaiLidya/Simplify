import React from 'react';
import { RouteComponentProps, RouteProps, Redirect, Route } from 'react-router';

interface Props extends RouteProps {
  routeCondition: boolean;
  redirectTo: string;
}

const ConditionalRoute: React.FC<Props> = props => {
  const { component: Component, routeCondition, redirectTo, ...rest } = props;

  const renderFn = (renderProps: RouteComponentProps<any>) => {
    if (props.routeCondition) {
      if (!Component) {
        return null;
      }
      return <Component {...renderProps} />;
    }

    return <Redirect to={props.redirectTo} />;
  };

  return (
    // Extract RouteProps without component property to rest.
    <Route {...rest} render={renderFn} />
  );
};

export default ConditionalRoute;
