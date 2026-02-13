import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Container } from '../components/layout/Container';
import { useLoginMutation } from '../store/api/apiSlice';
import { PageWrapper, Card, Title, Form, ErrorMessage, FooterText } from './styles/Auth.styles';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Login failed:', err);
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
            <Title>Welcome Back</Title>

            {error && (
              <ErrorMessage>
                {'data' in error ? (error.data as any)?.message : 'Login failed'}
              </ErrorMessage>
            )}

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
                  disabled={isLoading}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  disabled={isLoading}
                />

                <Button type="submit" fullWidth size="large" loading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Box>
            </Form>

            <FooterText>
              Don't have an account? <Link to="/register">Register</Link>
            </FooterText>
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
