import React, { FC, useState, useEffect } from 'react';
import { FormControlLabel, Table, Switch, Typography, TableHead, TableFooter, Button, TableRow, TablePagination, withStyles } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Body from './components/Body';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 2)
      }
    },
    addButton: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    extendedIcon: {
      paddingRight: theme.spacing(1)
    },
  })
);

interface Props {
  isLoadingData: boolean;
}

const BussinesDetails: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData } = props;
  const [OpenAddEntity, setOpenAddEntity] = useState<boolean>(false);

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

  const handleOpenAddEntity = () => {
    setOpenAddEntity(true);
  };

  return (
    <div className={classes.root}>
      
      <Table>
        <Body isLoadingData={isLoadingData} />
      </Table>
      
    </div>
  );
};

export default BussinesDetails;
