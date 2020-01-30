import React, { FC, Fragment, useState } from 'react';

import 'react-circular-progressbar/dist/styles.css';

import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import Skeleton from 'react-loading-skeleton';
import useRouter from 'hooks/useRouter';

import { Avatar, Checkbox, IconButton, makeStyles, TableRow, Theme, Typography } from '@material-ui/core';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { format } from 'date-fns';
import { green } from '@material-ui/core/colors';
import { PopperPlacementType } from '@material-ui/core/Popper';

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import EditInvoiceIcon from '@material-ui/icons/EditOutlined';
import MenuIcon from '@material-ui/icons/MoreHoriz';
import NewIcon from '@material-ui/icons/FiberNewOutlined';

import PositionedPopper from 'components/PositionedPopper';
import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  contract: ContractsModel;
  checked: number[];
  handleIndividualCheck: (id: number) => void;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onEditInvoice: React.MouseEventHandler;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableRowChecked: {
    height: 64,
    backgroundColor: '#F4F4F4'
  },
  newIcon: {
    color: green[500],
    fontSize: 30,
    marginTop: theme.spacing(0.8)
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  editIconForEmptyInvoice: {
    marginLeft: theme.spacing(5.5)
  },
  wrapper: {
    position: 'relative'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  icon: {
    fontSize: 20
  },
  checkBox: {
    '&&:hover': {
      backgroundColor: 'transparent'
    }
  },
  checkBoxSize: {
    fontSize: '16px'
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { history } = useRouter();
  const { isLoadingData, setSelectedId, contract, checked, handleIndividualCheck, setOpenDialog, setMessage, onEditInvoice } = props;
  const {
    id,
    contractId,
    clientName,
    contractTitle,
    startDate,
    endDate,
    createdDate,
    invoiceNo,
    amount,
    entity,
    completed,
    totalJob,
    new: isNew
  } = contract;
  const progress = (completed / totalJob) * 100;

  const [openActionMenuPopper, setOpenActionMenuPopper] = useState(false);
  const [anchorElActionMenuPopper, setAnchorElActionMenuPopper] = useState<HTMLElement | null>(null);
  const [placementActionMenuPopper, setPlacementActionMenuPopper] = useState<PopperPlacementType>();

  const handleActionMenuListClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenActionMenuPopper(!openActionMenuPopper);
    setAnchorElActionMenuPopper(event.currentTarget);
    setPlacementActionMenuPopper('left-start');
  };

  const handleViewActionClick = () => {
    history.push({ pathname: `/clients/contract/${id}`, state: { selectedTab: 1 } });
  };

  const handleDeleteActionClick = () => {
    setOpenDialog(true);
    setSelectedId(id);
    setMessage('Are you sure you want to delete this?');
  };

  const checkedCheckbox = checked.filter(checkedValue => checkedValue === id).length;

  let isChecked;

  if (checkedCheckbox === 0) {
    isChecked = false;
  } else {
    isChecked = true;
  }

  return (
    <Fragment>
      <TableRow className={clsx({ [classes.tableRow]: !isChecked, [classes.tableRowChecked]: isChecked })}>
        <BodyCell cellWidth='5%' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={15} />
          ) : (
            <Checkbox
              key={contractId}
              icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxSize} />}
              checkedIcon={<CheckBoxIcon className={classes.checkBoxSize} />}
              edge='start'
              color='primary'
              className={classes.checkBox}
              checked={isChecked}
              tabIndex={-1}
              disableRipple
              onChange={event => handleIndividualCheck && handleIndividualCheck(id)}
            />
          )}
        </BodyCell>
        <BodyCell cellWidth='5%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : contractId}
        </BodyCell>
        <BodyCell cellWidth='15%' pL='10px' pR='10px' isComponent={true}>
          <div className={classes.tableCellInner}>
            <div className={classes.wrapper}>
              {isLoadingData ? (
                <Skeleton circle={true} height={36} width={36} />
              ) : (
                <Avatar className={classes.avatar}>{clientName && clientName[0].toUpperCase()}</Avatar>
              )}
            </div>
            <div className={classes.nameTextCell}>
              {isLoadingData ? <Skeleton width={80} /> : <Typography variant='body2'>{clientName || <Skeleton width={100} />}</Typography>}
            </div>
          </div>
        </BodyCell>
        <BodyCell cellWidth='15%' pL='10px' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={150} />
          ) : (
            <div className={classes.tableCellInner}>
              <div className={classes.nameTextCell}>
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
        <BodyCell cellWidth={'11%'} pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(new Date(endDate), 'dd/MM/yyyy')}`}
        </BodyCell>
        <BodyCell cellWidth={'9%'} pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(createdDate), 'dd/MM/yyyy')}`}
        </BodyCell>
        <BodyCell cellWidth='8%' pL='10px' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <div className={classes.tableCellInner}>
              <div className={classes.nameTextCell}>
                <Typography variant='body1'>{invoiceNo}</Typography>
              </div>
              <div>
                <IconButton size='small' className={clsx({ [classes.editIconForEmptyInvoice]: !invoiceNo })} onClick={onEditInvoice}>
                  <EditInvoiceIcon className={classes.icon} />
                </IconButton>
              </div>
            </div>
          )}
        </BodyCell>
        <BodyCell cellWidth='9%' pL='10px' pR='10px'>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            <NumberFormat value={amount} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} />
          )}
        </BodyCell>
        <BodyCell cellWidth='9%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : entity}
        </BodyCell>
        <BodyCell cellWidth='9%' pL='10px' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton circle={true} height={45} width={45} />
          ) : (
            <svg width={45} height={45} style={{ marginTop: 3, marginBottom: 3 }}>
              <CircularProgressbar
                value={progress}
                text={`${completed}/${totalJob}`}
                styles={buildStyles({
                  strokeLinecap: 'butt',
                  textColor: '#53a0be',
                  textSize: 25
                })}
              />
            </svg>
          )}
        </BodyCell>
        <BodyCell cellWidth='5%' pL='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={20} />
          ) : (
            <div>
              <PositionedPopper
                openPopper={openActionMenuPopper}
                setOpenPopper={setOpenActionMenuPopper}
                anchorEl={anchorElActionMenuPopper}
                placement={placementActionMenuPopper}
                containerWidth={150}
                fadeTransition={350}
                popperComponent='menus'
                options={[
                  { key: 'ViewContract', label: 'View Contract', action: 'view', handleViewAction: handleViewActionClick },
                  { key: 'EditContract', label: 'Edit Contract', action: 'edit' },
                  { key: 'DeleteContract', label: 'Delete Contract', action: 'delete', handleDeleteAction: handleDeleteActionClick }
                ]}
              />
              <IconButton size='small' onClick={event => handleActionMenuListClick(event)}>
                <MenuIcon className={classes.icon} />
              </IconButton>
            </div>
          )}
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default BodyRow;
