import { forwardRef, Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper/Paper';
import { type TableComponents, TableVirtuoso } from 'react-virtuoso';
import TablePagination from '@mui/material/TablePagination/TablePagination';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import Table from '@mui/material/Table/Table';
import TableRow from '@mui/material/TableRow/TableRow';
import TableBody from '@mui/material/TableBody/TableBody';
import IconButton from '@mui/material/IconButton/IconButton';
import TableCell from '@mui/material/TableCell/TableCell';
import TableHead from '@mui/material/TableHead/TableHead';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

import {
  deleteLocation,
  listLocation,
  LOCATION_LIST,
  LOCATION_UPDATE_FAVOURITE,
  updateLocationFavourite,
} from '@/redux/actions/location';
import { type RootState } from '@/redux/configureStore';
import { createLoadingSelector } from '@/redux/selectors/loading';
import { type OrderString, type RemoteLocation } from '@/types';

import './index.less';
import Button from '@mui/material/Button/Button';
import TableSortLabel from '@mui/material/TableSortLabel/TableSortLabel';
import { convertQueryToState, useQuery } from '@/utils';

type Props = {
  isFetching: boolean;
  remoteLocations: RemoteLocation[];
  totalRows: number | null;
  dispatch: Dispatch;
  isUpdating: boolean;
};

interface ColumnData {
  dataKey: keyof RemoteLocation;
  label: string;
  numeric?: boolean;
  width: number;
  align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
  sortable?: boolean;
}

type TableContext = {
  context: {
    navigate: NavigateFunction;
  };
};

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS_PER_PAGE = 10;

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
    label: 'Actions',
    dataKey: 'isFavourite',
  },
];

const createData = ({
  name,
  isFavourite,
  southWest,
  northEast,
  center,
  id,
}: RemoteLocation) => {
  return {
    id,
    name,
    isFavourite,
    southWest,
    northEast,
    center,
  };
};

const VirtuosoTableComponents: TableComponents<RemoteLocation> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: props => (
    <Table
      {...props}
      sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}
    />
  ),
  // @ts-expect-error type mismatch with mui TableHead
  TableHead,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
  // @ts-expect-error type mismatch with original EmptyPlaceholder context unknown
  EmptyPlaceholder: ({ context: { navigate } }: TableContext) => {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: 'center', paddingTop: '100px' }}
          >
            Is empty now, Please
            <Button
              onClick={() => {
                navigate('/local_records');
              }}
            >
              Favourite Local Record
            </Button>
          </td>
        </tr>
      </tbody>
    );
  },
};

const RemoteRecords = ({
  isFetching,
  remoteLocations = [],
  totalRows = null,
  dispatch,
  isUpdating,
}: Props) => {
  // load initial state from route query
  // ?size=10&page=1&column=name&order=desc
  const routeQuery = useQuery();
  const pageQuery = routeQuery.get('page');
  const sizeQuery = routeQuery.get('size');
  const columnQuery = routeQuery.get('column');
  const orderQuery = routeQuery.get('order');

  const [page, setPage] = useState(
    convertQueryToState(pageQuery, DEFAULT_PAGE)
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    convertQueryToState(sizeQuery, DEFAULT_ROWS_PER_PAGE)
  );
  const [orderBy, setOrderBy] = useState<string | undefined>(
    columnQuery || undefined
  );
  const [order, setOrder] = useState<OrderString>(
    (['desc', 'asc', null].includes(orderQuery)
      ? orderQuery ?? undefined
      : undefined) as OrderString
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listLocation(page, rowsPerPage, orderBy, order));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, orderBy, order]);

  if (isFetching) {
    return (
      <div className="loading">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  // NOTE: support clear current sort by clicking same key in desc
  const handleSort = (columnDataKey: string) => {
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
            align={column.align || 'left'}
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
                onClick={() => handleSort(column.dataKey)}
              >
                {column.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const rowContent = (
    _index: number,
    row: RemoteLocation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch: Dispatch
  ) => {
    return (
      <Fragment>
        {columns.map(column => {
          let displayValue;
          const originalValue = row[column.dataKey];
          if (column.dataKey.startsWith('is')) {
            displayValue = (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  disabled={isUpdating}
                  onClick={() => {
                    dispatch(
                      updateLocationFavourite({
                        id: row.id,
                        isFavourite: !originalValue,
                      })
                    );
                  }}
                  color="inherit"
                >
                  {originalValue ? (
                    <FavoriteOutlinedIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={() => {
                    dispatch(
                      deleteLocation({
                        id: row.id,
                        onSuccess: () =>
                          dispatch(
                            listLocation(page, rowsPerPage, orderBy, order)
                          ),
                      })
                    );
                  }}
                  color="inherit"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            );
          } else if (typeof originalValue === 'string') {
            displayValue = originalValue;
          } else if (typeof originalValue === 'object') {
            const keys = Object.keys(originalValue);
            if (keys.includes('x') && keys.includes('y')) {
              displayValue = `${originalValue.x}, ${originalValue.y}`;
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

  const rows: RemoteLocation[] = remoteLocations.map(location => {
    return createData(location);
  });

  return (
    <Paper className="container">
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={(_index: number, row: RemoteLocation) =>
          rowContent(_index, row, dispatch)
        }
        context={{ navigate }}
      />
      <TablePagination
        component="div"
        count={totalRows || 0}
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

const mapStateToProps = (state: RootState) => {
  const { remoteLocations, totalRows } = state.location;

  return {
    isFetching: createLoadingSelector([LOCATION_LIST])(state),
    isUpdating: createLoadingSelector([LOCATION_UPDATE_FAVOURITE])(state),
    remoteLocations,
    totalRows,
  };
};

const RemoteRecordsPage = connect(mapStateToProps)(RemoteRecords);
export default RemoteRecordsPage;
