import React from 'react';
import VerificationRequests from './components/VerificationRequests';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e2a44",
    },
    text: {
      primary: "#fff",
      secondary: "#f4c430",
    },
    primary: {
      main: "#f4c430",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <VerificationRequests />
    </ThemeProvider>
  );
}

export default App;