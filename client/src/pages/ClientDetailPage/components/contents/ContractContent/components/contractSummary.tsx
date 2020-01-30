import React, { FC } from 'react';
import { Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: 'auto'
  },
  headerColumn: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ContractSummary: FC = () => {
  const classes = useStyles();
  return (
    <Grid item xs>
      <Paper className={classes.paper}>
        <Grid container justify='space-between' className={classes.headerColumn}>
          <Typography variant='h4' color='primary'>
            Contract Summary
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ContractSummary;
