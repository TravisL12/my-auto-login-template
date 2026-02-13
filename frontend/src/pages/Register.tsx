import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Container } from '../components/layout/Container';
import { useRegisterMutation } from '../store/api/apiSlice';
import { PageWrapper, Card, Title, Form, ErrorMessage, FooterText } from './styles/Auth.styles';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

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

    try {
      await register(formData).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Registration failed:', err);
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

            {error && (
              <ErrorMessage>
                {'data' in error ? (error.data as any)?.message : 'Registration failed'}
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
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  error={validationErrors.username}
                  disabled={isLoading}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  disabled={isLoading}
                />

                <Button type="submit" fullWidth size="large" loading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
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
