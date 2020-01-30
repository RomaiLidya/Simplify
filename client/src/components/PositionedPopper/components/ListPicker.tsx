import React, { FC } from 'react';
import { ClickAwayListener, List, ListItem } from '@material-ui/core';
import { Option } from 'components/PositionedPopper';

interface Props {
  setOpenPopper: React.Dispatch<React.SetStateAction<boolean>>;
  options: Option[];
}

const ListPicker: FC<Props> = props => {
  const { setOpenPopper, options } = props;

  const handleCloseMenuListPopper = () => {
    setOpenPopper(false);
  };

  const renderAction = () => {
    return options.map(option => {
      const onClickEvent = () => {
        if (option.action === 'view') {
          if (option.handleViewAction) {
            return option.handleViewAction();
          }
        } else if (option.action === 'delete') {
          if (option.handleDeleteAction) {
            return option.handleDeleteAction();
          }
        }
      };
      return (
        <ListItem
          button
          key={option.key}
          onClick={event => {
            return onClickEvent();
          }}
        >
          {option.label}
        </ListItem>
      );
    });
  };

  return (
    <ClickAwayListener onClickAway={handleCloseMenuListPopper}>
      <List>{renderAction()}</List>
    </ClickAwayListener>
  );
};

export default ListPicker;
