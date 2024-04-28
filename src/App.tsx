import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store, persistor } from '@/redux/configureStore';

import MapDisplay from '@/pages/MapDisplay';
import LocalRecords from '@/pages/LocalRecords';
import RemoteRecords from '@/pages/RemoteRecords';

import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Snackbar from './components/SnackBar';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <ResponsiveAppBar />
          <Routes>
            <Route path="/" element={<MapDisplay />} />
            <Route path="/local_records" element={<LocalRecords />} />
            <Route path="/remote_records" element={<RemoteRecords />} />
          </Routes>
        </BrowserRouter>
        <Snackbar />
      </PersistGate>
    </Provider>
  );
};

export default App;
