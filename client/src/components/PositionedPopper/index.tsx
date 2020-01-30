import React, { FC } from 'react';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/styles';
import { Fade, Paper, Theme } from '@material-ui/core';
import DateRangePicker from './components/DateRangePicker';
import ListPicker from './components/ListPicker';
import CheckBoxPicker from './components/CheckBoxPicker';

export interface Option {
  key: string;
  label: string;
  action?: 'view' | 'add' | 'edit' | 'delete' | 'filter';
  checkBoxList?: Select[];
  handleViewAction?: () => void;
  handleDeleteAction?: () => void;
}

interface Props {
  // this props to open and close popper component
  openPopper: boolean;
  setOpenPopper: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: HTMLElement | null;
  placement: any;
  containerWidth: number;
  fadeTransition: number;
  mT?: number;
  mR?: number;
  mB?: number;
  mL?: number;
  // this props to determine the type of component rendered inside the popper
  popperComponent: 'dateRangePicker' | 'menus' | 'checkBoxMenus';
  // this props to datepicker inside popper component
  filterBy?: string;
  setFilterBy?: React.Dispatch<React.SetStateAction<string>>;
  startDate?: Date | null;
  setStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate?: Date | null;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  // this props to checkbox inside popper component
  columnFilter?: ColumnFilter[];
  setColumnFilter?: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  // this props to additional property of the selected component
  options: Option[];
}

const useStyles = makeStyles((theme: Theme) => ({
  popper: (props: Props) => ({
    marginTop: theme.spacing(props.mT !== undefined ? props.mT : 0),
    marginRight: theme.spacing(props.mR !== undefined ? props.mR : 0),
    marginBottom: theme.spacing(props.mB !== undefined ? props.mB : 0),
    marginLeft: theme.spacing(props.mL !== undefined ? props.mL : 0),
    width: props.containerWidth,
    zIndex: 99
  }),
  paper: (props: Props) => ({
    borderRadius: '5px',
    padding: theme.spacing(props.popperComponent === 'checkBoxMenus' ? 2 : props.popperComponent === 'dateRangePicker' ? 1 : 0)
  }),
  clearButton: {
    color: '#89BED3',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#53A0BE'
    },
    padding: theme.spacing(0)
  },
  textFieldFont: {
    fontSize: '12px',
    height: 18
  }
}));

const PositionedPopper: FC<Props> = props => {
  const classes = useStyles(props);
  const { openPopper, setOpenPopper, anchorEl, placement, fadeTransition, popperComponent, options } = props;

  const { filterBy, setFilterBy } = props;
  const { startDate, setStartDate } = props;
  const { endDate, setEndDate } = props;

  const { columnFilter, setColumnFilter } = props;

  const renderContent = () => {
    if (popperComponent === 'dateRangePicker') {
      return (
        <DateRangePicker
          setOpenPopper={setOpenPopper}
          options={options}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      );
    } else if (popperComponent === 'menus') {
      return <ListPicker setOpenPopper={setOpenPopper} options={options} />;
    } else if (popperComponent === 'checkBoxMenus') {
      return <CheckBoxPicker setOpenPopper={setOpenPopper} options={options} columnFilter={columnFilter} setColumnFilter={setColumnFilter} />;
    }
  };

  return (
    <Popper open={openPopper} anchorEl={anchorEl} placement={placement} className={classes.popper} transition disablePortal>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={fadeTransition}>
          <Paper className={classes.paper}>{renderContent()}</Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default PositionedPopper;
