import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';

import MapDisplay from '@/components/MapDisplay';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';

import { store, persistor } from '@/redux/configureStore';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssBaseline />
        <ResponsiveAppBar />
        <MapDisplay />
      </PersistGate>
    </Provider>
  );
}

export default App;
