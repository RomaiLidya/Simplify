import React, { FC, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { format } from 'date-fns';
import NumberFormat from 'react-number-format';
import { TableRow, makeStyles, TableCell, Theme, Avatar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/MoreHoriz';
import NewIcon from '@material-ui/icons/FiberNew';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  contracts: ContractsModel;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onViewContract: React.MouseEventHandler;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  menuAvatar: {
    backgroundColor: '#ffffff',
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px',
    color: '#707070'
  },
  menuList: {
    minHeight: 30
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  secondText: {
    color: grey[500]
  },
  circle: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: green[500],
    marginRight: theme.spacing(1),
    content: "''"
  },
  redCircle: {
    backgroundColor: red[500]
  },
  actionCell: {
    '& > :nth-child(n+2)': {
      marginLeft: theme.spacing(1)
    }
  },
  wrapper: {
    position: 'relative'
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1,
    top: -4,
    left: -4
  },
  newIcon: {
    color: green[500]
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, contracts, onViewContract } = props;
  const { contractId, clientName, contractTitle, startDate, endDate, invoiceNo, amount, entity, completed, totalJob, new: isNew } = contracts;
  const progressPie = (completed / totalJob) * 100;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow className={classes.tableRow}>
      <BodyCell cellWidth='10%' pR='5px'>
        {isLoadingData ? <Skeleton width={80} /> : contractId}
      </BodyCell>
      <BodyCell cellWidth='20%' pL='10px' pR='5px' isComponent={true}>
        <div className={classes.tableCellInner}>
          <div className={classes.wrapper}>
            {isLoadingData ? (
              <Skeleton circle={true} height={36} width={36} />
            ) : (
              <Avatar className={classes.avatar}>{clientName[0].toUpperCase()}</Avatar>
            )}
          </div>
          <div className={classes.nameTextCell}>
            {isLoadingData ? <Skeleton width={80} /> : <Typography variant='body2'>{clientName || <Skeleton width={100} />}</Typography>}
          </div>
        </div>
      </BodyCell>
      <BodyCell cellWidth='20%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={150} />
        ) : (
          <div className={classes.tableCellInner}>
            <div className={classes.otherTextCell}>
              <Typography variant='body1'>{contractTitle}</Typography>
            </div>
            {isNew && (
              <div>
                <NewIcon className={classes.newIcon} />
              </div>
            )}
          </div>
        )}
      </BodyCell>
      <BodyCell cellWidth={'10%'} pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(new Date(endDate), 'dd/MM/yyyy')}`}
      </BodyCell>
      <BodyCell cellWidth={'7%'} pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : '12/10/2019'}
      </BodyCell>
      <BodyCell cellWidth='7%' pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : invoiceNo}
      </BodyCell>
      <BodyCell cellWidth='6%' pL='10px' pR='10px'>
        {isLoadingData ? (
          <Skeleton width={80} />
        ) : (
          <NumberFormat value={amount} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
        )}
      </BodyCell>
      <BodyCell cellWidth='6%' pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : entity}
      </BodyCell>
      <BodyCell cellWidth='6%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={80} />
        ) : (
          <svg width={45} height={45} style={{ marginTop: 3, marginBottom: 3 }}>
            <CircularProgressbar
              value={progressPie}
              strokeWidth={50}
              text={`${completed}/${totalJob}`}
              styles={buildStyles({
                strokeLinecap: 'butt',
                textColor: 'black',
                textSize: 25
              })}
            />
          </svg>
        )}
      </BodyCell>
      <TableCell>
        {isLoadingData ? null : (
          <React.Fragment>
            <IconButton size='small' color='inherit' onClick={handleClick}>
              <Avatar className={classes.menuAvatar}>
                <MenuIcon />
              </Avatar>
            </IconButton>
            <Menu
              id='list-menu'
              anchorEl={anchorEl}
              keepMounted
              elevation={1}
              getContentAnchorEl={null}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <MenuItem className={classes.menuList} onClick={onViewContract}>
                View Contract
              </MenuItem>
              <MenuItem className={classes.menuList}>Add Contract</MenuItem>
              <MenuItem className={classes.menuList}>Delete Contract</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BodyRow;
