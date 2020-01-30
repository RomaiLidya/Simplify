import React, { FC, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Avatar, ClickAwayListener, Divider, Grid, List, ListSubheader, ListItem, ListItemAvatar, Typography, Theme } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

interface Props {
  setOpenPopper?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData?: boolean;
  clients?: ClientDetailsModel[];
  query?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 450,
    borderRadius: '5px'
  },
  subHeader: {
    color: '#53A0BE'
  },
  inline: {
    display: 'inline'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  },
  notFound: {
    marginTop: theme.spacing(1)
  }
}));

const ClientList: FC<Props> = props => {
  const classes = useStyles(props);

  const { isLoadingData, clients, query, setOpenPopper } = props;
  const dataLength = clients !== undefined ? clients.length : 5;

  const handleClickListItem = (clientId: number) => {
    window.open(`/clients/${clientId}`, '_blank');
    setOpenPopper && setOpenPopper(false);
  };

  const renderSkeleton = () => {
    return [1, 2, 3, 4, 5].map((value, index) => (
      <Fragment key={index}>
        <ListItem alignItems='flex-start' button>
          <ListItemAvatar>
            <Skeleton circle={true} height={36} width={36} />
          </ListItemAvatar>
          <Fragment>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Skeleton width={150} />
                <Skeleton width={150} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton width={150} />
                <Skeleton width={150} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton width={300} />
                <Skeleton width={300} />
                <Skeleton width={300} />
              </Grid>
            </Grid>
          </Fragment>
        </ListItem>
        {index !== dataLength - 1 && <Divider />}
      </Fragment>
    ));
  };

  const renderNoResult = () => {
    return (
      <Typography variant='body2' align='center' color='textSecondary' className={classes.notFound}>
        No results found for query <span style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>{query}</span>
      </Typography>
    );
  };

  const renderResult = () => {
    return (
      clients &&
      clients.map((client, index) => {
        const suggestionOne = client.name;
        const matchOne = match(suggestionOne, query === undefined ? '' : query);
        const partOne = parse(suggestionOne, matchOne);

        const suggestionTwo = client.contactNumber;
        const matchTwo = match(suggestionTwo, query === undefined ? '' : query);
        const partTwo = parse(suggestionTwo, matchTwo);

        const suggestionThree = client.billingAddress;
        const matchThree = match(suggestionThree, query === undefined ? '' : query);
        const partThree = parse(suggestionThree, matchThree);

        return (
          <Fragment key={index}>
            <ListItem alignItems='flex-start' button onClick={event => handleClickListItem(client.id)}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>{client.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <Fragment>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' align='left' color='primary'>
                      Client Name
                    </Typography>
                    <Typography variant='body2' align='left' color='textSecondary'>
                      {partOne.map((part, index) =>
                        part.highlight ? (
                          <span key={String(index)} style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        )
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' align='right' color='primary'>
                      Contact Number
                    </Typography>
                    <Typography variant='body2' align='right' color='textSecondary'>
                      {partTwo.map((part, index) =>
                        part.highlight ? (
                          <span key={String(index)} style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        )
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1' align='justify' color='primary'>
                      Address
                    </Typography>
                    <Typography variant='body2' align='justify' color='textSecondary'>
                      {partThree.map((part, index) =>
                        part.highlight ? (
                          <span key={String(index)} style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        )
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Fragment>
            </ListItem>
            {index !== dataLength - 1 && <Divider />}
          </Fragment>
        );
      })
    );
  };

  const renderContent = () => {
    if (isLoadingData) {
      return renderSkeleton();
    } else {
      if (dataLength === 0) {
        return renderNoResult();
      } else {
        return renderResult();
      }
    }
  };

  return (
    <ClickAwayListener onClickAway={event => setOpenPopper && setOpenPopper(false)}>
      <List subheader={<ListSubheader className={classes.subHeader}>Search Result</ListSubheader>} className={classes.list}>
        <Divider />
        {renderContent()}
      </List>
    </ClickAwayListener>
  );
};

export default ClientList;
