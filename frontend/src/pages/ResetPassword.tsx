import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Container } from '../components/layout/Container';
import { useResetPasswordMutation } from '../store/api/apiSlice';
import { PageWrapper, Card, Title, Form, ErrorMessage, FooterText } from './styles/Auth.styles';
import styled from 'styled-components';

const SuccessMessage = styled.div`
  padding: 1rem;
  background: rgba(100, 255, 218, 0.1);
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
`;

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors = {
      resetToken: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Reset token validation
    if (!formData.resetToken) {
      errors.resetToken = 'Reset token is required';
    }

    // Password validation
    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return !errors.resetToken && !errors.newPassword && !errors.confirmPassword;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword({
        resetToken: formData.resetToken,
        newPassword: formData.newPassword,
      }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <PageWrapper direction="column" align="center" justify="center">
      <Container>
        <Box direction="column" align="center">
          <Card direction="column" gap="1.5rem">
            <Title>Reset Password</Title>

            {!success ? (
              <>
                {error && (
                  <ErrorMessage>
                    {'data' in error ? (error.data as any)?.message : 'Password reset failed'}
                  </ErrorMessage>
                )}

                <p style={{ fontSize: '1.1rem', color: '#a8b2d1', marginBottom: '1rem' }}>
                  Enter your reset token and choose a new password.
                </p>

                <Form onSubmit={handleSubmit}>
                  <Box direction="column" gap="1.5rem">
                    <Input
                      label="Reset Token"
                      type="text"
                      name="resetToken"
                      placeholder="Paste your reset token here"
                      value={formData.resetToken}
                      onChange={handleChange}
                      error={validationErrors.resetToken}
                      disabled={isLoading}
                    />

                    <Input
                      label="New Password"
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password (min 6 characters)"
                      value={formData.newPassword}
                      onChange={handleChange}
                      error={validationErrors.newPassword}
                      disabled={isLoading}
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={validationErrors.confirmPassword}
                      disabled={isLoading}
                    />

                    <Button type="submit" fullWidth size="large" loading={isLoading} disabled={isLoading}>
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </Box>
                </Form>

                <FooterText>
                  Don't have a token? <Link to="/request-password-reset">Request one</Link>
                </FooterText>
              </>
            ) : (
              <>
                <SuccessMessage>
                  <strong>Password reset successful!</strong>
                  <br />
                  <br />
                  Redirecting you to the login page...
                </SuccessMessage>

                <Button
                  as={Link}
                  to="/login"
                  fullWidth
                  size="large"
                  style={{ marginTop: '1rem' }}
                >
                  Go to Login
                </Button>
              </>
            )}
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
