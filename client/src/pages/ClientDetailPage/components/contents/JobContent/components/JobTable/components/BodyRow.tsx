import React, { FC, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { format } from 'date-fns';
import NumberFormat from 'react-number-format';
import { Chip, TableRow, makeStyles, TableCell, Theme, Avatar, Typography, IconButton } from '@material-ui/core';
import { grey, green, red } from '@material-ui/core/colors';
import ViewIcon from '@material-ui/icons/Visibility';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  jobs: JobsModel;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onViewJob: React.MouseEventHandler;
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
  },
  chip: {
    borderRadius: 7
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, jobs, onViewJob } = props;
  const { id, completed, totalJob, serviceName, startDate, endDate, jobType, invoiceNo, amount, jobStatus } = jobs;
  const progressPie = (completed / totalJob) * 100;

  const [isProcessing, setProcessing] = useState<boolean>(false);

  return (
    <TableRow className={classes.tableRow}>
      <BodyCell cellWidth='10%' pR='5px'>
        {isLoadingData ? <Skeleton width={80} /> : id}
      </BodyCell>
      <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
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
      <BodyCell cellWidth='20%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={150} />
        ) : (
          <div className={classes.tableCellInner}>
            <div className={classes.otherTextCell}>
              <Typography variant='body1'>{serviceName}</Typography>
            </div>
          </div>
        )}
      </BodyCell>
      <BodyCell cellWidth={'10%'} pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(startDate), 'EEEE, dd/MM/yyyy hh:mm a')}`}
      </BodyCell>
      <BodyCell cellWidth={'10%'} pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(endDate), 'EEEE, dd/MM/yyyy hh:mm a')}`}
      </BodyCell>
      <BodyCell cellWidth='7%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={150} />
        ) : (
          <div className={classes.tableCellInner}>
            <div className={classes.otherTextCell}>
              <Chip label={jobType} className={classes.chip} variant='outlined' color={jobType === 'Contract' ? 'primary' : 'secondary'} />
            </div>
          </div>
        )}
      </BodyCell>
      <BodyCell cellWidth='8%' pL='10px' pR='10px'>
        {isLoadingData ? <Skeleton width={80} /> : invoiceNo}
      </BodyCell>
      <BodyCell cellWidth='8%' pL='10px' pR='10px'>
        {isLoadingData ? (
          <Skeleton width={80} />
        ) : (
          <NumberFormat value={amount} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
        )}
      </BodyCell>
      <BodyCell cellWidth='7%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={150} />
        ) : (
          <div className={classes.tableCellInner}>
            <div className={classes.otherTextCell}>
              <Chip label={jobStatus} className={classes.chip} variant='outlined' color={jobStatus === 'Assigned' ? 'primary' : 'secondary'} />
            </div>
          </div>
        )}
      </BodyCell>
      <TableCell>
        {isLoadingData ? null : (
          <IconButton size='small' color='inherit' onClick={onViewJob}>
            <Avatar className={classes.menuAvatar}>
              <ViewIcon />
            </Avatar>
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default BodyRow;
