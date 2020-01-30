import React, { FC } from 'react';
import { Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';

interface CompanyDetail {
  label: string;
  value: string;
  option: string;
}

interface Props {
  header: string;
  companyDetails: CompanyDetail[];
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: 'auto'
  },
  headerColumn: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  gridOdd: {
    backgroundColor: '#F8F8F8 ',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  gridEven: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

const CompanyDetail: FC<Props> = props => {
  const classes = useStyles();
  const { companyDetails, header } = props;

  return (
    <Grid item xs>
      <Paper className={classes.paper}>
        <Grid container justify='space-between' className={classes.headerColumn}>
          <Typography variant='h4' color='primary'>
            {header}
          </Typography>
        </Grid>
        {companyDetails.map(companyDetail => (
          <Grid container className={companyDetail.option === 'even' ? classes.gridEven : classes.gridOdd}>
            <Grid item xs={6}>
              <Typography variant='h6'>{companyDetail.label}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h6'>{companyDetail.value}</Typography>
            </Grid>
          </Grid>
        ))}
      </Paper>
    </Grid>
  );
};

export default CompanyDetail;
