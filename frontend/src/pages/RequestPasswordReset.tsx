import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Container } from '../components/layout/Container';
import { useRequestPasswordResetMutation } from '../store/api/apiSlice';
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
  margin-bottom: 1rem;
`;

const TokenDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.accent};
`;

export const RequestPasswordReset: React.FC = () => {
  const [requestReset, { isLoading, error }] = useRequestPasswordResetMutation();

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setValidationError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setValidationError('Invalid email format');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await requestReset({ email }).unwrap();
      setResetToken(response.resetToken);
    } catch (err) {
      console.error('Password reset request failed:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError('');
  };

  return (
    <PageWrapper direction="column" align="center" justify="center">
      <Container>
        <Box direction="column" align="center">
          <Card direction="column" gap="1.5rem">
            <Title>Reset Password</Title>

            {!resetToken ? (
              <>
                {error && (
                  <ErrorMessage>
                    {'data' in error ? (error.data as any)?.message : 'Request failed'}
                  </ErrorMessage>
                )}

                <p style={{ fontSize: '1.1rem', color: '#a8b2d1', marginBottom: '1rem' }}>
                  Enter your email address and we'll generate a password reset token for you.
                </p>

                <Form onSubmit={handleSubmit}>
                  <Box direction="column" gap="1.5rem">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleChange}
                      error={validationError}
                      disabled={isLoading}
                    />

                    <Button type="submit" fullWidth size="large" loading={isLoading} disabled={isLoading}>
                      {isLoading ? 'Requesting...' : 'Request Reset Token'}
                    </Button>
                  </Box>
                </Form>

                <FooterText>
                  Remember your password? <Link to="/login">Login</Link>
                </FooterText>
              </>
            ) : (
              <>
                <SuccessMessage>
                  <strong>Password reset token generated!</strong>
                  <br />
                  <br />
                  Copy the token below and use it on the reset password page.
                  This token will expire in 1 hour.
                </SuccessMessage>

                <TokenDisplay>
                  {resetToken}
                </TokenDisplay>

                <Box direction="column" gap="1rem" style={{ marginTop: '1rem' }}>
                  <Button
                    as={Link}
                    to="/reset-password"
                    fullWidth
                    size="large"
                  >
                    Go to Reset Password Page
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    fullWidth
                    size="large"
                    variant="secondary"
                  >
                    Back to Login
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
