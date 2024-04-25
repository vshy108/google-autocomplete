/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import './App.less';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CssBaseline />
      <Button variant="contained" onClick={() => setCount(count => count + 1)}>
        count is {count}
      </Button>
    </>
  );
}

export default App;
