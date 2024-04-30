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
import { Button } from '@mui/material';
import { type NavigateFunction, useNavigate } from 'react-router-dom';

import {
  deleteLocation,
  listLocation,
  LOCATION_LIST,
  updateLocationFavourite,
} from '@/redux/actions/location';
import { type RootState } from '@/redux/configureStore';
import { createLoadingSelector } from '@/redux/selectors/loading';
import { type RemoteLocation } from '@/types';

import './index.less';

type Props = {
  isFetching: boolean;
  remoteLocations: RemoteLocation[];
  totalRows: number | null;
  dispatch: Dispatch;
};

interface ColumnData {
  dataKey: keyof RemoteLocation;
  label: string;
  numeric?: boolean;
  width: number;
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

const RemoteRecords = ({
  isFetching,
  remoteLocations = [],
  totalRows = null,
  dispatch,
}: Props) => {
  // TODO: load initial state from route query
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listLocation(page, rowsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  if (isFetching) {
    return (
      <div className="loading">
        <CircularProgress color="secondary" />
      </div>
    );
  }

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
                  onClick={() => {
                    // TODO: disable when the updateLocationFavourite request is loading
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
                          dispatch(listLocation(page, rowsPerPage)),
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

  // TODO: sorting

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
    remoteLocations,
    totalRows,
  };
};

const RemoteRecordsPage = connect(mapStateToProps)(RemoteRecords);
export default RemoteRecordsPage;
