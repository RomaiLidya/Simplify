import React, { FC, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import CompanyDetail from '../../../CompanyDetail';
import axios, { CancelTokenSource } from 'axios';
import useRouter from 'hooks/useRouter';
import { GET_CLIENT_BY_ID_URL } from 'constants/url';

interface ClientData {
  id: number;
  name: string;
  clientType: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  secondaryContactEmail: string;
  country: string;
  billingAddress: string;
  billingPostal: string;
  needGST: boolean;
}

const ContractInfo: FC = () => {
  const { match } = useRouter();
  const params = match.params.id;

  const dummyClient: ClientData = {
    id: 0,
    name: '',
    clientType: '',
    contactPerson: '',
    contactNumber: '',
    contactEmail: '',
    secondaryContactPerson: '',
    secondaryContactNumber: '',
    secondaryContactEmail: '',
    country: '',
    billingAddress: '',
    billingPostal: '',
    needGST: true
  };

  const [clients, setClients] = useState<ClientData>(dummyClient);

  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    const loadData = async () => {
      try {
        const { data } = await axios.get(`${GET_CLIENT_BY_ID_URL(params)}`, { cancelToken: cancelTokenSource.token });
        setClients(data.client);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
    return () => {
      cancelTokenSource.cancel();
    };
  }, [params]);

  const { name, clientType, country, billingAddress, billingPostal, needGST } = clients!;

  return (
    <Grid container spacing={3}>
      <CompanyDetail
        header={'Company Details'}
        companyDetails={[
          { label: 'Company Name', value: name, option: 'odd' },
          { label: 'Company Type', value: clientType, option: 'even' },
          { label: 'GST', value: needGST === true ? 'Yes' : 'No', option: 'odd' },
          { label: 'Remarks', value: 'remarks', option: 'even' }
        ]}
      />
      <CompanyDetail
        header={'Location & Billing'}
        companyDetails={[
          { label: 'Service Address', value: billingAddress, option: 'odd' },
          { label: 'Postal Code', value: billingPostal, option: 'even' },
          { label: 'Billing Address', value: billingAddress + ', ' + country, option: 'odd' },
          { label: 'Postal Code', value: billingPostal, option: 'even' }
        ]}
      />
      <CompanyDetail
        header={'Contract Info'}
        companyDetails={[
          { label: 'Contract Title', value: 'General Maintenance', option: 'odd' },
          {
            label: 'Contract Description',
            value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
            option: 'even'
          }
        ]}
      />
    </Grid>
  );
};

export default ContractInfo;
