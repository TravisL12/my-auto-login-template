import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Box } from '../components/ui/Box';
import { Container } from '../components/layout/Container';
import type { RootState } from '../store';

const PageWrapper = styled(Box)`
  min-height: calc(100vh - 120px);
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const WelcomeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #64ffda 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

const Card = styled(Box)`
  background: ${({ theme }) => theme.colors.background.card};
  border: 2px solid rgba(100, 255, 218, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const InfoRow = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md} 0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  min-width: 120px;
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.accent};
  font-weight: 700;
`;

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <PageWrapper direction="column" align="center" justify="center">
      <Container>
        <Box direction="column" align="center" gap="3rem">
          <WelcomeTitle>Welcome, {user.username}!</WelcomeTitle>

          <Card direction="column" gap="0">
            <InfoRow justify="space-between" align="center">
              <Label>Email:</Label>
              <Value>{user.email}</Value>
            </InfoRow>

            <InfoRow justify="space-between" align="center">
              <Label>Username:</Label>
              <Value>{user.username}</Value>
            </InfoRow>

            <InfoRow justify="space-between" align="center">
              <Label>User ID:</Label>
              <Value style={{ fontSize: '1rem' }}>{user.id}</Value>
            </InfoRow>
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
