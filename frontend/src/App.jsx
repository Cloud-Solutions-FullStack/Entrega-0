import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Auth/Login';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2'
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Box className="app-content">
          <Login />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;