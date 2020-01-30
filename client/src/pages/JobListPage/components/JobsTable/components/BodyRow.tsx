import React, { FC, Fragment, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import Skeleton from 'react-loading-skeleton';
import { Chip, Avatar, Checkbox, IconButton, makeStyles, TableRow, Theme, Typography, Menu } from '@material-ui/core';
import { format } from 'date-fns';
import { green } from '@material-ui/core/colors';
import { PopperPlacementType } from '@material-ui/core/Popper';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import MenuIcon from '@material-ui/icons/MoreHoriz';
import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  setSelectedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  job: JobsDetailModel;
  checked: number[];
  handleIndividualCheck: (id: number) => void;
  onViewJob: React.MouseEventHandler;
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
  chip: {
    borderRadius: 7
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
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
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
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();

  const { isLoadingData, job } = props;
  const { jobId, clientName, serviceAddress, startTime, endTime, Datee, vehicleNo, displayName, Type, new: isNew } = job;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <TableRow>
        {/* Checked */}
        <BodyCell cellWidth='5%' pR='10px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={15} />
          ) : (
            <Checkbox
              key={jobId}
              icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxSize} />}
              checkedIcon={<CheckBoxIcon className={classes.checkBoxSize} />}
              edge='start'
              color='primary'
              className={classes.checkBox}
              tabIndex={-1}
              disableRipple
            />
          )}
        </BodyCell>

        {/* jobId */}
        <BodyCell cellWidth='5%' pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : jobId}
        </BodyCell>

        {/* clientName */}
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

        <BodyCell cellWidth='15%' pR='5px'>
          <div className={classes.tableCellInner}>
            <div className={classes.nameTextCell}>
              <Typography variant='body2'>{serviceAddress || <Skeleton width={100} />}</Typography>
            </div>
          </div>
        </BodyCell>
        <BodyCell cellWidth={'11%'} pL='10px' pR='10px'>
          {isLoadingData ? (
            <Skeleton width={80} />
          ) : (
            `${format(new Date(`${Datee} ${startTime}`), ' hh:mm a')} - ${format(new Date(`${Datee} ${endTime}`), ' hh:mm a')}`
          )}
        </BodyCell>
        <BodyCell cellWidth={'9%'} pL='10px' pR='10px'>
          {isLoadingData ? <Skeleton width={80} /> : `${format(new Date(Datee), 'dd/MM/yyyy')}`}
        </BodyCell>

        <BodyCell cellWidth='15%' pR='5px'>
          <div className={classes.tableCellInner}>
            <div className={classes.nameTextCell}>
              <Typography variant='body2'>{vehicleNo || <Skeleton width={100} />}</Typography>
            </div>
          </div>
        </BodyCell>

        <BodyCell cellWidth='15%' pR='5px'>
          <div className={classes.tableCellInner}>
            <div className={classes.nameTextCell}>
              <Typography variant='body2'>{displayName || <Skeleton width={100} />}</Typography>
            </div>
          </div>
        </BodyCell>

        <BodyCell cellWidth='10%' pR='3px'>
          <div className={classes.tableCellInner}>
            <div className={classes.otherTextCell}>
              <Chip label={Type} className={classes.chip} variant='outlined' color={Type === 'Contract' ? 'primary' : 'secondary'} />
            </div>
          </div>
        </BodyCell>
        {/* 
      <BodyCell cellWidth='7%' pL='10px' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={150} />
        ) : (
          <div className={classes.tableCellInner}>
            <div className={classes.nameTextCell}>
              <Chip label={Type} className={classes.chip} variant='outlined' color={Type === 'Contract' ? 'primary' : 'secondary'} />
            </div>
          </div>
        )}
        
      </BodyCell>  */}

        {/* <BodyCell cellWidth='5%' pL='10px' isComponent={true}>
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
                  // { key: 'ViewJob', label: 'View Job', action: 'view', handleViewAction: handleViewActionClick },
                  //  { key: 'EditJob', label: 'Edit Job', action: 'edit' }
                ]}
              />
              <IconButton size='small' onClick={event => handleActionMenuListClick(event)}>
                <MenuIcon className={classes.icon} />
              </IconButton>
            </div>
          )}
        </BodyCell> */}

        <BodyCell cellWidth='10%' pR='5px'>
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
              ></Menu>
            </React.Fragment>
          )}
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default BodyRow;
