import SnackBar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useEffect, useRef, useState } from 'react';
import { type Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/redux/configureStore';
import { type NotificationPayload } from '@/types';
import { triggerNotification } from '@/redux/actions/notification';

const GlobalSnackbar = () => {
  const dispatch: Dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const data: NotificationPayload = useSelector(
    (state: RootState) => state.app.notificationData
  );

  const {
    message = '',
    severity = 'info',
    duration = 3000,
    sx = {},
  } = data || {};

  useEffect(() => {
    if (data) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setOpen(true);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    timerRef.current = setTimeout(() => {
      dispatch(triggerNotification());
    }, 200);
  };

  return (
    <SnackBar
      ContentProps={{ sx: { background: 'white', color: 'black' } }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={duration}
      TransitionComponent={props => <Slide {...props} direction="up" />}
    >
      <Alert
        variant="filled"
        onClose={handleClose}
        severity={severity}
        sx={{ width: '100%', ...sx }}
        elevation={6}
      >
        {message}
      </Alert>
    </SnackBar>
  );
};

export default GlobalSnackbar;
