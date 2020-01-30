import httpContext from 'express-http-context';

export const setRequestTenancy = (tenant: string) => {
  httpContext.set('tenant', tenant.toLowerCase());
};
