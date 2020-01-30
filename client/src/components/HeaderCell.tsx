import React, { FC } from 'react';
import { TableCell, Typography, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

interface Props {
  pL?: string;
  pR?: string;
  pT?: string;
  pB?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  isCheckBox?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  headerCellText: {
    fontWeight: 500,
    color: theme.palette.grey.A200
  },
  cellStyle: (props: Props) => ({
    paddingLeft: props.pL === '' || props.pL === null ? theme.spacing(0) : props.pL,
    paddingRight: props.pR === '' || props.pR === null ? theme.spacing(0) : props.pR,
    paddingTop: props.pT === '' || props.pT === null ? theme.spacing(0) : props.pT,
    paddingBottom: props.pB === '' || props.pB === null ? theme.spacing(0) : props.pB,
    verticalAlign: props.verticalAlign === undefined ? 'middle' : props.verticalAlign
  })
}));

const HeaderCell: FC<Props> = props => {
  const { pL, pR, pT, pB, isCheckBox } = props;
  const classes = useStyles(props);

  return (
    <TableCell align='left' className={clsx({ [classes.cellStyle]: pL || pR || pT || pB })}>
      {isCheckBox ? (
        props.children
      ) : (
        <Typography variant='overline' className={classes.headerCellText}>
          {props.children}
        </Typography>
      )}
    </TableCell>
  );
};

export default HeaderCell;
