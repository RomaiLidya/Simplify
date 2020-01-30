import React, { FC, useState } from 'react';
import { PopperPlacementType } from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/styles';
import { IconButton, InputBase, Theme, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { fade } from '@material-ui/core/styles';
import CustomizedPopper from './components/CustomizedPopper';
import clsx from 'clsx';
  
interface Props {
  isAppbar?: boolean;
  withTransition?: boolean;
  withBorder?: boolean;
  width?: number;
  placeHolder?: string;
  iconColor?: string;
  tableSearchValue?: string;
  setTableSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  globalSearchValue?: string;
  setGlobalSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  openPopper?: boolean;
  setOpenPopper?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData?: boolean;
  clients?: ClientDetailsModel[];
}

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.5),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1)
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  appbarSearch: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchIconCustomColor: (props: Props) => ({
    color: props.iconColor
  }),
  clearIcon: {
    color: '#ffffff'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
    fontSize: '13px',
    '&::placeholder': {
      fontSize: '13px'
    }
  },
  widthTransition: {
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: 100,
      '&:focus': {
        width: 120
      }
    }
  },
  bordered: {
    border: `1px solid ${theme.border.primary}}`
  },
  customWidth: (props: Props) => ({
    width: props.width
  })
}));

const SearchInput: FC<Props> = props => {
  const classes = useStyles(props);

  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const [placement, setPlacement] = useState<PopperPlacementType>();

  const {
    isAppbar = false,
    withTransition = true,
    withBorder = false,
    width,
    placeHolder = 'Search...',
    iconColor,
    tableSearchValue,
    globalSearchValue,
    openPopper,
    setTableSearchValue,
    setGlobalSearchValue,
    setOpenPopper,
    isLoadingData,
    clients
  } = props;

  // This method use for global search client on AppHeader
  const handleTextGlobalSearchChange = (event: any) => {
    setGlobalSearchValue && setGlobalSearchValue(event.target.value);
    setAnchorEl(event.currentTarget);
    setPlacement('left-start');
  };

  // This method use for search on table
  const handleTextTableSearchChange = (event: any) => {
    setTableSearchValue && setTableSearchValue(event.target.value);
  };

  // This method use for clear search
  const handleClearSearch = () => {
    setTableSearchValue && setTableSearchValue('');
    setGlobalSearchValue && setGlobalSearchValue('');
  };

  return (
    <div className={clsx(classes.search, { [classes.bordered]: withBorder, [classes.appbarSearch]: isAppbar })}>
      <div className={clsx(classes.searchIcon, { [classes.searchIconCustomColor]: iconColor })}>
        <SearchIcon />
      </div>
      <InputBase
        autoComplete='off'
        placeholder={placeHolder}
        classes={{
          root: classes.inputRoot,
          input: clsx(classes.inputInput, { [classes.widthTransition]: withTransition }, { [classes.customWidth]: width })
        }}
        inputProps={{ 'aria-label': 'Search' }}
        value={isAppbar ? globalSearchValue : tableSearchValue}
        onChange={event => (isAppbar ? handleTextGlobalSearchChange(event) : handleTextTableSearchChange(event))}
      />
      {tableSearchValue === '' || globalSearchValue === '' ? (
        ''
      ) : (
        <Tooltip title='Clear'>
          <IconButton size='small' onClick={handleClearSearch}>
            <ClearIcon className={clsx(classes.clearIcon, { [classes.searchIconCustomColor]: iconColor })} />
          </IconButton>
        </Tooltip>
      )}
      <CustomizedPopper
        isLoadingData={isLoadingData}
        query={globalSearchValue}
        clients={clients}
        openPopper={openPopper !== undefined && openPopper}
        anchorEl={anchorEl}
        placement={placement}
        setOpenPopper={setOpenPopper}
      />
    </div>
  );
};

export default SearchInput;
