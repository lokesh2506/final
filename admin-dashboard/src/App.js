import React from 'react';
import VerificationRequests from './components/VerificationRequests';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BlockchainProvider } from './context/BlockchainContext';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Debug: Log React instance
console.log('React instance in App.js:', React);

// Expose React to the global scope for debugging in the browser console
window.React = React;

// Create an Emotion cache
const cache = createCache({ key: 'css', prepend: true });

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e2a44',
    },
    text: {
      primary: '#fff',
      secondary: '#f4c430',
    },
    primary: {
      main: '#f4c430',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
});

function App() {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BlockchainProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <VerificationRequests />
        </BlockchainProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;