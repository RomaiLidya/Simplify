import React, { FC, ComponentType } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';

import useRouter from 'hooks/useRouter';

interface Props {
  Icon: ComponentType<SvgIconProps>;
  path: string;
  label: string;
}

const DrawerItem: FC<Props> = props => {
  const { history } = useRouter();
  const { Icon, path, label } = props;

  const onClickHandler: React.MouseEventHandler = event => {
    event.preventDefault();

    history.push(path);
  };

  return (
    <Tooltip title={label} placement='right'>
      <ListItem button onClick={onClickHandler}>
        <ListItemIcon>
          <Icon color='primary' />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    </Tooltip>
  );
};

export default DrawerItem;
