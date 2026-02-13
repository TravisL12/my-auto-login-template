import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Box } from '../ui/Box';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { logoutUser } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';

const HeaderWrapper = styled.header`
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.accent};
  text-decoration: none;

  &:hover {
    opacity: 1;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
    opacity: 1;
  }
`;

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
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
                <span style={{ color: '#a8b2d1', fontSize: '1rem' }}>
                  {user?.username}
                </span>
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
