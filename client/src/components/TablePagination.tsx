import React, { FC } from 'react';
import { TableFooter, TableRow, TablePagination as TablePaginationComponent } from '@material-ui/core';

interface Props {
  rowsPerPageOptions: number[];
  count: number;
  rowsPerPage: number;
  page: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

const TablePagination: FC<Props> = props => {
  const { rowsPerPageOptions, count, rowsPerPage, page, onChangePage, onChangeRowsPerPage } = props;
  return (
    <TableFooter>
      <TableRow>
        <TablePaginationComponent
          rowsPerPageOptions={rowsPerPageOptions}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { 'aria-label': 'Rows per page' },
            native: true
          }}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

export default TablePagination;
