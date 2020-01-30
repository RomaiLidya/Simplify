import React, { FC, useState } from 'react';
import {
  Button,
  Checkbox,
  ClickAwayListener,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
  withStyles
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Option } from 'components/PositionedPopper';

interface Props {
  setOpenPopper: React.Dispatch<React.SetStateAction<boolean>>;
  options: Option[];
  columnFilter?: ColumnFilter[];
  setColumnFilter?: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    padding: theme.spacing(0),
    marginTop: theme.spacing(-1),
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  checkBox: {
    '&&:hover': {
      backgroundColor: 'transparent'
    }
  },
  clearButton: {
    color: '#89BED3',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#53A0BE'
    },
    padding: theme.spacing(0)
  },
  checkBoxSize: {
    fontSize: '16px'
  }
}));

const ClearButton = withStyles({
  label: {
    textTransform: 'capitalize',
    marginLeft: 25
  }
})(Button);

const CheckBoxPicker: FC<Props> = props => {
  const classes = useStyles(props);
  const { setOpenPopper, options, columnFilter, setColumnFilter } = props;

  const handleCloseMenuListPopper = () => {
    setOpenPopper(false);
  };

  const [selectedFilter, setSelectedFilter] = useState<ColumnFilter[]>(columnFilter === undefined ? [] : columnFilter);

  const handleClickCheckBox = (columnName: string, columnValue: number) => () => {
    const newSelectedFilter = [...selectedFilter];
    // count element in object selected filter for check already exist or not
    const countElement = newSelectedFilter.filter(selected => selected.filterKey === `${columnName}-${columnValue}`).length;
    if (countElement === 0) {
      newSelectedFilter.push({ filterKey: `${columnName}-${columnValue}`, columnName, columnValue });
    } else {
      // check index of element and remove object by index
      const selectedFilterIndex = newSelectedFilter.map(x => x.filterKey).indexOf(`${columnName}-${columnValue}`);
      newSelectedFilter.splice(selectedFilterIndex, 1);
    }
    setSelectedFilter(newSelectedFilter);
    setColumnFilter && setColumnFilter(newSelectedFilter);
  };

  const handleClickClearButton = () => {
    setSelectedFilter([]);
    setColumnFilter && setColumnFilter([]);
  };

  const renderContent = () => {
    return options.map(option => {
      return (
        <Grid item key={option.key} xs={6}>
          <Typography variant='body2' color='textSecondary'>
            {option.label}
          </Typography>
          <List>
            {option.checkBoxList &&
              option.checkBoxList.map(checkBox => {
                // check checkBox is checked
                const checkedCheckbox = selectedFilter.filter(selected => selected.filterKey === `${option.key}-${checkBox.id}`).length;
                return (
                  <ListItem
                    key={checkBox.id}
                    dense
                    button
                    disableRipple
                    onClick={handleClickCheckBox(option.key, checkBox.id)}
                    className={classes.listItem}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxSize} />}
                      checkedIcon={<CheckBoxIcon className={classes.checkBoxSize} />}
                      edge='start'
                      color='primary'
                      className={classes.checkBox}
                      checked={checkedCheckbox === 0 ? false : true}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': `${option.key}-${checkBox.id}` }}
                    />
                    <ListItemText id={`${option.key}-${checkBox.id}`} primary={checkBox.name} />
                  </ListItem>
                );
              })}
          </List>
        </Grid>
      );
    });
  };

  return (
    <ClickAwayListener onClickAway={handleCloseMenuListPopper}>
      <div>
        <Grid container direction='row' justify='flex-end' alignItems='flex-start'>
          <ClearButton size='small' className={classes.clearButton} onClick={handleClickClearButton} disableRipple>
            Clear
          </ClearButton>
        </Grid>
        <Grid container spacing={2}>
          {renderContent()}
        </Grid>
      </div>
    </ClickAwayListener>
  );
};

export default CheckBoxPicker;
