import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { Button, Container, Divider, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ContractsIcon from '@material-ui/icons/LibraryAdd';

import useRouter from 'hooks/useRouter';
import ProfileContent from './components/contents/ProfileContent';
import ContractContent from './components/contents/ContractContent';
import JobContent from './components/contents/JobContent';
import CustomizedTabs from 'components/CustomizedTabs';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  divider: {
    marginBottom: theme.spacing(1)
  },
  paper: {
    margin: 'auto'
  },
  addGrid: {
    textAlign: 'end'
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));
 
const ClientDetailPage: FC = () => {
  const classes = useStyles();
  const { history } = useRouter();
  const [selectedTab, setSelectedTab] = useState<number>(history.location.state.selectedTab);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    action(actionParam);
  };

  const SelectedContent: FC<{ page: number }> = props => {
    switch (props.page) {
      case 0:
        return <ProfileContent />;
      case 1:
        return <ContractContent />;
      case 2:
        return <JobContent />;
      default:
        return <div />;
    }
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <Typography variant='h4' color='primary'>
            Clients List
          </Typography>
        </Grid>
        <Grid item sm={6} className={classes.addGrid}>
          {selectedTab === 0 ? (
            <Button color='primary' size='medium' variant='contained' className={classes.addButton} onClick={() => {}}>
              <PersonAddIcon className={classes.extendedIcon} />
              New Client
            </Button>
          ) : (
            <Button color='primary' size='medium' variant='contained' className={classes.addButton} onClick={() => {}}>
              <ContractsIcon className={classes.extendedIcon} />
              New Contract
            </Button>
          )}
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <CustomizedTabs
        tabs={[{ id: 0, name: 'Profile' }, { id: 1, name: 'Contracts' }, { id: 2, name: 'Jobs' }]}
        selectedTabId={selectedTab}
        onSelect={(tabId: number) => performActionAndRevertPage(setSelectedTab, tabId)}
      />
      <SelectedContent page={selectedTab} />
    </Container>
  );
};

export default ClientDetailPage;
