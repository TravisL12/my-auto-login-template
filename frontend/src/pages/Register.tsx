import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Container } from '../components/layout/Container';
import { registerUser } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';

const PageWrapper = styled(Box)`
  min-height: calc(100vh - 120px);
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Card = styled(Box)`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.accent};
`;

const Form = styled.form`
  width: 100%;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: 600;
  }
`;

export const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    username: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      username: '',
      password: '',
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      errors.username = 'Username must be less than 50 characters';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 100) {
      errors.password = 'Password must be less than 100 characters';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.username && !errors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <PageWrapper direction="column" align="center" justify="center">
      <Container>
        <Box direction="column" align="center">
          <Card direction="column" gap="1.5rem">
            <Title>Create Account</Title>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <Box direction="column" gap="1.5rem">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  disabled={loading}
                />

                <Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  error={validationErrors.username}
                  disabled={loading}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  disabled={loading}
                />

                <Button type="submit" fullWidth size="large" loading={loading} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register'}
                </Button>
              </Box>
            </Form>

            <FooterText>
              Already have an account? <Link to="/login">Sign in</Link>
            </FooterText>
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
