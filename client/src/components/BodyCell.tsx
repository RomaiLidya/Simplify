import React, { FC } from 'react';
import { TableCell, Typography, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

interface Props {
  cellWidth?: string;
  pL?: string;
  pR?: string;
  pT?: string;
  pB?: string;
  isComponent?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  bodyCellText: {
    color: theme.palette.common.black
  },
  customWidth: (props: Props) => ({
    width: props.cellWidth
  }),
  customPadding: (props: Props) => ({
    paddingLeft: props.pL === '' || props.pL === null ? theme.spacing(0) : props.pL,
    paddingRight: props.pR === '' || props.pR === null ? theme.spacing(0) : props.pR,
    paddingTop: props.pT === '' || props.pT === null ? theme.spacing(0) : props.pT,
    paddingBottom: props.pB === '' || props.pB === null ? theme.spacing(0) : props.pB
  })
}));

const BodyCell: FC<Props> = props => {
  const { cellWidth, pL, pR, pT, pB, isComponent } = props;
  const classes = useStyles(props);

  return (
    <TableCell align='left' className={clsx({ [classes.customWidth]: cellWidth }, { [classes.customPadding]: pL || pR || pT || pB })}>
      {isComponent ? (
        props.children
      ) : (
        <Typography variant='body1' className={classes.bodyCellText}>
          {props.children}
        </Typography>
      )}
    </TableCell>
  );
};

export default BodyCell;
