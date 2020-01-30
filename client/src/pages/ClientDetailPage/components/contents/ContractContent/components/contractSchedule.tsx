import React, { FC } from 'react';
import { Grid } from '@material-ui/core';

import CompanyDetail from '../../../CompanyDetail';

const ContractSchedule: FC = () => {
  return (
    <Grid container spacing={0}>
      <CompanyDetail
        header={'Schedule 01'}
        companyDetails={[
          { label: 'Repeat', value: 'Daily', option: 'odd' },
          { label: 'Every', value: '1 time(s)', option: 'even' },
          { label: 'Date of First Service', value: '07/08/2019', option: 'odd' },
          { label: '07/08/2019', value: 'After 1 time(s)', option: 'even' }
        ]}
      />
    </Grid>
  );
};

export default ContractSchedule;
