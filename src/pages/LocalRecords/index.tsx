// import { useEffect, forwardRef, Fragment } from 'react';
import { forwardRef, Fragment } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { type Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// import { listLocation } from '@/redux/actions/location';
import { type RootState } from '@/redux/configureStore';
import { type LocalLocationTableRow } from '@/types';
import TablePagination from '@mui/material/TablePagination/TablePagination';
import { createLocation } from '@/redux/actions/location';

interface ColumnData {
  dataKey: keyof LocalLocationTableRow;
  label: string;
  numeric?: boolean;
  width: number;
}

const createData = (
  {
    id,
    name,
    isFavourite,
    southWest,
    northEast,
    center,
  }: LocalLocationTableRow,
  index: number
) => {
  return {
    id: id ?? -1 * (index + 1),
    name,
    isFavourite,
    southWest,
    northEast,
    center,
  };
};

const columns: ColumnData[] = [
  {
    width: 200,
    label: 'Name',
    dataKey: 'name',
  },
  {
    width: 200,
    label: 'South West',
    dataKey: 'southWest',
  },
  {
    width: 200,
    label: 'North East',
    dataKey: 'northEast',
  },
  {
    width: 200,
    label: 'Center',
    dataKey: 'center',
  },
  {
    width: 120,
    label: 'Action',
    dataKey: 'isFavourite',
  },
];

const VirtuosoTableComponents: TableComponents<LocalLocationTableRow> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: props => (
    <Table
      {...props}
      sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}
    />
  ),
  // @ts-expect-error type mismatch
  TableHead,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const fixedHeaderContent = () => {
  return (
    <TableRow>
      {columns.map(column => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
};

const rowContent = (
  _index: number,
  row: LocalLocationTableRow,
  dispatch: Dispatch
) => {
  return (
    <Fragment>
      {columns.map(column => {
        let displayValue;
        const originalValue = row[column.dataKey];
        if (column.dataKey.startsWith('is')) {
          displayValue = (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...rest } = row;
                dispatch(createLocation(rest));
              }}
              color="inherit"
            >
              <FavoriteBorderIcon />
            </IconButton>
          );
        } else if (typeof originalValue === 'string') {
          displayValue = originalValue;
        } else if (typeof originalValue === 'object') {
          const keys = Object.keys(originalValue);
          if (keys.includes('lat') && keys.includes('lng')) {
            displayValue = `${originalValue.lat}, ${originalValue.lng}`;
          }
        }
        return (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? 'right' : 'left'}
          >
            {displayValue}
          </TableCell>
        );
      })}
    </Fragment>
  );
};

const LocalRecords = () => {
  const dispatch: Dispatch = useDispatch();

  const localLocations = useSelector(
    (state: RootState) => state.location.localLocations
  );

  // useEffect(() => {
  //   dispatch(listLocation());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const rows: LocalLocationTableRow[] = localLocations.map(
    (location, index) => {
      return createData(location, index);
    }
  );

  // TODO: HARDCODED
  const COUNT = 100;
  const PAGE = 1;
  const ROWS_PER_PAGE = 10;

  return (
    <Paper style={{ height: '80vh', width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={(_index: number, row: LocalLocationTableRow) =>
          rowContent(_index, row, dispatch)
        }
      />
      <TablePagination
        component="div"
        count={COUNT}
        page={PAGE}
        onPageChange={() => {}}
        rowsPerPage={ROWS_PER_PAGE}
        onRowsPerPageChange={() => {}}
        sx={{ float: 'right', padding: '12px' }}
      />
    </Paper>
  );
};

export default LocalRecords;