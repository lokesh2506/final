import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlockchainProvider } from './context/BlockchainContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Error Boundary Component to catch and handle runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Oops! Something went wrong.</h1>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const toastConfig = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'dark',
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <BlockchainProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <ToastContainer {...toastConfig} />
          </div>
        </BlockchainProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;