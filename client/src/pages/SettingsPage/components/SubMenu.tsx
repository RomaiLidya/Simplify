import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, List, ListItem, ListItemText, Theme, Typography } from '@material-ui/core';
import SettingPageContents from '../../../typings/SettingPageContents';

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  listItemText: {
    color: '#53A0BE'
  },
  listItemTextActive: {
    color: '#53A0BE',
    fontWeight: 500
  }
}));

interface Props {
  subMenuActive: SettingPageContents;
  selectedRenderContent: (page: SettingPageContents) => React.MouseEventHandler;
}

const SubMenu: FC<Props> = props => {
  const { selectedRenderContent, subMenuActive } = props;

  const subMenus = Object.values(SettingPageContents);

  const classes = useStyles();

  return (
    <List>
      {subMenus.map((subMenu, index) => (
        <ListItem className={classes.listItem} button disableRipple onClick={selectedRenderContent(subMenu)} key={index}>
          <ListItemText
            primary={
              <Typography variant='body1' className={clsx(classes.listItemText, subMenuActive === subMenu && classes.listItemTextActive)}>
                {subMenu}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SubMenu;
