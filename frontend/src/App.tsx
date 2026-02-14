import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RequestPasswordReset } from './pages/RequestPasswordReset';
import { ResetPassword } from './pages/ResetPassword';
import { useGetCurrentUserQuery } from './store/api/apiSlice';
import { selectIsAuthenticated } from './store';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check auth on mount - don't retry on failure to prevent infinite loops
  const { isLoading } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: false, // Don't refetch if already in cache
    refetchOnFocus: false, // Don't refetch on window focus initially
    refetchOnReconnect: false, // Don't refetch on reconnect initially
  });

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontSize: '2rem',
          color: '#64ffda'
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/request-password-reset"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RequestPasswordReset />}
            />
            <Route
              path="/reset-password"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
