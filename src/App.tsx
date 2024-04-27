import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MapDisplay from '@/components/MapDisplay';
import Records from '@/components/Records';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';

import { store, persistor } from '@/redux/configureStore';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <ResponsiveAppBar />
          <Routes>
            <Route path="/" element={<MapDisplay />} />
            <Route path="/records" element={<Records />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
