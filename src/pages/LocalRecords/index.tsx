import { forwardRef, Fragment, useEffect, useState } from 'react';
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

import { type RootState } from '@/redux/configureStore';
import {
  type LocalLocation,
  type OrderString,
  type LocalLocationTableRow,
  type SearchParams,
} from '@/types';
import TablePagination from '@mui/material/TablePagination/TablePagination';
import { createLocation } from '@/redux/actions/location';

import './index.less';
import TableSortLabel from '@mui/material/TableSortLabel/TableSortLabel';
import cloneDeep from 'lodash/cloneDeep';
import { convertQueryToState, useQuery } from '@/utils';
import { useSearchParams } from 'react-router-dom';

interface ColumnData {
  dataKey: keyof LocalLocationTableRow;
  label: string;
  numeric?: boolean;
  width: number;
  sortable?: boolean;
}

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 10;

const createData = (
  { name, isFavourite, southWest, northEast, center }: LocalLocation,
  index: number
) => {
  return {
    id: -1 * (index + 1),
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
    sortable: true,
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
            displayValue = `${originalValue.lng}, ${originalValue.lat}`;
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

const descendingComparator = (
  a: LocalLocation,
  b: LocalLocation,
  orderBy: keyof LocalLocation | undefined
) => {
  if (orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }

  return 0;
};

const getComparator = (
  order: OrderString,
  orderBy: keyof LocalLocation | undefined
) => {
  return order === 'desc'
    ? (a: LocalLocation, b: LocalLocation) =>
        descendingComparator(a, b, orderBy)
    : (a: LocalLocation, b: LocalLocation) =>
        -descendingComparator(a, b, orderBy);
};

const LocalRecords = () => {
  const dispatch: Dispatch = useDispatch();

  const localLocations: LocalLocation[] = useSelector(
    (state: RootState) => state.location.localLocations
  );

  // load initial state from route query
  // ?size=10&page=1&column=name&order=desc
  const routeQuery = useQuery();
  const pageQuery = routeQuery.get('page');
  const sizeQuery = routeQuery.get('size');
  const columnQuery = routeQuery.get('column');
  const orderQuery = routeQuery.get('order');

  const [data, setData] = useState(localLocations);

  const [page, setPage] = useState(
    convertQueryToState(pageQuery, DEFAULT_PAGE)
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    convertQueryToState(sizeQuery, DEFAULT_ROWS_PER_PAGE)
  );
  const [orderBy, setOrderBy] = useState<keyof LocalLocation | undefined>(
    (['name', null].includes(columnQuery)
      ? columnQuery ?? undefined
      : undefined) as keyof LocalLocation | undefined
  );
  const [order, setOrder] = useState<OrderString>(
    (['desc', 'asc', null].includes(orderQuery)
      ? orderQuery ?? undefined
      : undefined) as OrderString
  );

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const newData = cloneDeep(localLocations);
    if (order) {
      newData.sort(getComparator(order, orderBy));
    }
    setData(newData);
  }, [localLocations, order, orderBy]);

  useEffect(() => {
    let basicSearchParams: SearchParams = {
      page: page.toString(),
      size: rowsPerPage.toString(),
    };
    if (orderBy) {
      basicSearchParams = {
        ...basicSearchParams,
        column: orderBy,
      };
    }

    if (order) {
      basicSearchParams = {
        ...basicSearchParams,
        order,
      };
    }
    setSearchParams(basicSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, orderBy, order]);

  // NOTE: support clear current sort by clicking same key in desc
  const handleSort = (columnDataKey: keyof LocalLocation | undefined) => {
    // when previous orderBy is current clicking one
    if (orderBy === columnDataKey) {
      if (order === 'asc') {
        setOrder('desc');
      } else if (order === 'desc') {
        setOrder(undefined);
        setOrderBy(undefined);
      } else {
        setOrder('asc');
      }
    } else {
      setOrder('asc');
      setOrderBy(columnDataKey);
    }
    setPage(0);
  };

  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.dataKey}
            sx={{
              width:
                typeof column.width !== 'undefined' ? column.width : undefined,
              backgroundColor: 'background.paper',
            }}
          >
            {column?.sortable === false ? (
              column.label
            ) : (
              <TableSortLabel
                active={order && orderBy === column.dataKey}
                direction={orderBy === column.dataKey ? order : undefined}
                onClick={() => {
                  if (column.dataKey !== 'id') {
                    handleSort(column.dataKey);
                  }
                }}
              >
                {column.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const rows: LocalLocationTableRow[] = data
    .slice(rowsPerPage * page, rowsPerPage * (page + 1))
    .map((location, index) => {
      return createData(location, index);
    });

  return (
    <Paper className="container">
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
        count={localLocations.length}
        page={page}
        onPageChange={(_, page) => {
          setPage(page);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={event => {
          setPage(0);
          setRowsPerPage(parseInt(event.target.value, 10));
        }}
        sx={{ float: 'right', padding: '12px' }}
      />
    </Paper>
  );
};

export default LocalRecords;
