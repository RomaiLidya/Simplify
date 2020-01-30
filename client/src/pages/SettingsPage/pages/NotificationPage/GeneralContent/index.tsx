import React, { FC, useState, useEffect } from 'react';
import { FormControlLabel, Table, Switch, Typography, TableHead, TableFooter, TableRow, TablePagination, withStyles } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import BodyRow from './Components/BodyRow';
import { green } from '@material-ui/core/colors';
import BodyCell from 'components/BodyCell';

import Button from '@material-ui/core/Button';

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: green[500]
    },
    '&$checked + $track': {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 2)
      }
    }
  })
);

interface Props {
  isLoadingData: boolean;
}

const GeneralContent: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData } = props;

  const dummyUser: UserDetailsModel = {
    id: 0,
    roleId: 0,
    role: '',
    displayName: '',
    email: '',
    contactNumber: '',
    active: false,
    lock: false
  };

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoadingData) {
      timeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);
    }

    setShowSkeleton(false);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoadingData]);

  return (
    <div className={classes.root}>
      <Table>
        <BodyRow isLoadingData={isLoadingData} />
      </Table>
    </div>
  );
};

export default GeneralContent;
