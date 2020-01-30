import React, { FC, useState } from 'react';
import { TableRow, makeStyles, Theme, Avatar, Typography, IconButton, CircularProgress, Menu, MenuItem, Checkbox } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { grey, green, red } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/MoreHoriz';
import NewIcon from '@material-ui/icons/FiberNew';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  clients: ClientDetailsModel;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onViewClient: React.MouseEventHandler;
  onViewContract: React.MouseEventHandler;
  onViewJob: React.MouseEventHandler;
  checked: number[];
  handleIndividualCheck: (id: number) => void;
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
  const {
    isLoadingData,
    clients,
    setOpenSnackbar,
    setSnackbarVarient,
    onViewClient,
    onViewContract,
    onViewJob,
    checked,
    handleIndividualCheck
  } = props;
  const { id, name, contactPerson, contactNumber, contactEmail, country, billingAddress, new: isNew } = clients;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkedCheckbox = checked.filter(checkedValue => checkedValue === id).length;

  return (
    <TableRow className={classes.tableRow}>
      <BodyCell cellWidth='5%' pR='10px' isComponent={true}>
        {isLoadingData ? (
          <Skeleton width={15} />
        ) : (
          <Checkbox
            key={id}
            icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxSize} />}
            checkedIcon={<CheckBoxIcon className={classes.checkBoxSize} />}
            edge='start'
            color='primary'
            className={classes.checkBox}
            checked={checkedCheckbox === 0 ? false : true}
            tabIndex={-1}
            disableRipple
            onChange={event => handleIndividualCheck && handleIndividualCheck(id)}
          />
        )}
      </BodyCell>
      <BodyCell cellWidth='20%' pR='5px' isComponent={true}>
        <div className={classes.tableCellInner}>
          <div className={classes.wrapper}>
            {isProcessing && <CircularProgress size={44} thickness={4} className={classes.fabProgress} />}
            {isLoadingData ? <Skeleton circle={true} height={50} width={50} /> : <Avatar className={classes.avatar}>{name[0].toUpperCase()}</Avatar>}
          </div>
          <div className={classes.nameTextCell}>
            <Typography variant='body2'>{name || <Skeleton width={100} />}</Typography>
          </div>
          {isNew && (
            <div>
              <NewIcon fontSize='large' className={classes.newIcon} />
            </div>
          )}
        </div>
      </BodyCell>
      
      <BodyCell cellWidth='20%' pR='5px'>
        <div className={classes.tableCellInner}>
          <div className={classes.otherTextCell}>
            <Typography variant='body2'>{billingAddress || <Skeleton width={100} />}</Typography>
            <Typography variant='subtitle2' className={classes.secondText}>
              {country || <Skeleton width={100} />}
            </Typography>
          </div>
        </div>
      </BodyCell>
      <BodyCell cellWidth='15%' pR='5px'>
        <div className={classes.tableCellInner}>
          <div className={classes.otherTextCell}>
            <Typography variant='body2'>{contactPerson || <Skeleton width={100} />}</Typography>
            <Typography variant='subtitle2' className={classes.secondText}>
              {contactNumber || <Skeleton width={100} />}
            </Typography>
            <Typography variant='subtitle2' className={classes.secondText}>
              {contactEmail || <Skeleton width={100} />}
            </Typography>
          </div>
        </div>
      </BodyCell>
      <BodyCell cellWidth='10%' pR='5px'>
        {1 || <Skeleton width={100} height={25} />}
      </BodyCell>
      <BodyCell cellWidth='15%' pR='5px'>
        {<NumberFormat value={10000} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true} /> || (
          <Skeleton width={100} height={25} />
        )}
      </BodyCell>
      
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
                horizontal:'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <MenuItem className={classes.menuList} onClick={onViewClient}>
                View Profile
              </MenuItem>
              <MenuItem className={classes.menuList} onClick={onViewContract}>
                View Contract
              </MenuItem>
              <MenuItem className={classes.menuList} onClick={onViewJob}>
                View Job
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </BodyCell>
    </TableRow>
  );
};

export default BodyRow;
