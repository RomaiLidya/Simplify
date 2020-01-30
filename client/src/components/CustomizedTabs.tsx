import React, { FC, MouseEventHandler } from 'react';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Tab, Tabs, Typography } from '@material-ui/core';

interface Tabs {
  id: number;
  name: string;
}

interface Props {
  tabs: Tabs[];
  tabsByModel?: Tabs[];
  selectedTabId: number;
  onSelect: (tabId: number) => void;
}

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8'
  },
  indicator: {
    backgroundColor: '#53A0BE'
  }
})(Tabs);

const AntTab: any = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#B5B5B5',
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      '&:hover': {
        color: '#53A0BE',
        opacity: 1
      },
      '&$selected': {
        color: '#53A0BE',
        fontWeight: theme.typography.fontWeightMedium
      },
      '&:focus': {
        color: '#53A0BE'
      }
    },
    selected: {}
  })
)(props => <Tab disableRipple {...props} wrapped />);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(-4)
  },
  padding: {
    padding: theme.spacing(3)
  }
}));

const CustomizedTabs: FC<Props> = props => {
  const { tabs, tabsByModel, onSelect, selectedTabId } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(selectedTabId);

  const handleChange = (tabId: number): MouseEventHandler => event => {
    onSelect(tabId);
    setValue(tabId);
  };

  return (
    <div className={classes.root}>
      <AntTabs value={value} aria-label='ant' variant='scrollable'>
        {tabs.map(tab => (
          <AntTab key={tab.id} value={tab.id} label={tab.name} onClick={handleChange(tab.id)} />
        ))}
        {tabsByModel !== undefined &&
          tabsByModel.map(tabByModel => (
            <AntTab key={tabByModel.id} value={tabByModel.id} label={tabByModel.name} onClick={handleChange(tabByModel.id)} />
          ))}
      </AntTabs>
      <Typography className={classes.padding} />
    </div>
  );
};

export default CustomizedTabs;
