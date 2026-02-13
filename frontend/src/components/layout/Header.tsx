import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { useLogoutMutation } from '../../store/api/apiSlice';
import { selectIsAuthenticated, selectCurrentUser } from '../../store';
import { HeaderWrapper, Logo, Nav, NavLink, Username } from './styles/Header.styles';

export const Header: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      // Always navigate and force a page reload to clear all state
      window.location.href = '/';
    }
  };

  return (
    <HeaderWrapper>
      <Container>
        <Box justify="space-between" align="center">
          <Logo to="/">Auth App</Logo>
          <Nav>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <Username>{user?.username}</Username>
                <Button size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button as={Link} to="/register" size="small">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Box>
      </Container>
    </HeaderWrapper>
  );
};
