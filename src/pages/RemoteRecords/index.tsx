import { forwardRef, Fragment, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { type Dispatch } from 'redux';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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

import { listLocation, LOCATION_LIST } from '@/redux/actions/location';
import { type RootState } from '@/redux/configureStore';
import { createLoadingSelector } from '@/redux/selectors/loading';
import { type RemoteLocation } from '@/types';

import './index.less';

type Props = {
  isFetching: boolean;
  remoteLocationsRedux: RemoteLocation[];
  totalPagesRedux: number | null;
  totalRowsRedux: number | null;
  rowsPerPageRedux: number;
  pageRedux: number;
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

const rowContent = (
  _index: number,
  row: RemoteLocation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dispatch: Dispatch
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
                // TODO: update isFavourite
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

const RemoteRecords = ({
  isFetching,
  remoteLocationsRedux = [],
  totalRowsRedux = null,
  rowsPerPageRedux = 10,
  pageRedux = 0,
}: Props) => {
  const dispatch: Dispatch = useDispatch();
  const [page, setPage] = useState(pageRedux);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageRedux);
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

  const rows: RemoteLocation[] = remoteLocationsRedux.map(location => {
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
        count={totalRowsRedux || 0}
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
  const {
    remoteLocations: remoteLocationsRedux,
    totalRows: totalRowsRedux,
    rowsPerPage: rowsPerPageRedux,
    page: pageRedux,
  } = state.location;

  return {
    isFetching: createLoadingSelector([LOCATION_LIST])(state),
    remoteLocationsRedux,
    totalRowsRedux,
    rowsPerPageRedux,
    pageRedux,
  };
};

const RemoteRecordsPage = connect(mapStateToProps)(RemoteRecords);
export default RemoteRecordsPage;
