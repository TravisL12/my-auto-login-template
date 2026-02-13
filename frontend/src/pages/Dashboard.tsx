import { useSelector } from 'react-redux';
import { Box } from '../components/ui/Box';
import { Container } from '../components/layout/Container';
import { selectCurrentUser } from '../store';
import {
  PageWrapper,
  WelcomeTitle,
  Card,
  InfoRow,
  Label,
  Value,
  SmallValue,
} from './styles/Dashboard.styles';

export const Dashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);

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
              <SmallValue>{user.id}</SmallValue>
            </InfoRow>
          </Card>
        </Box>
      </Container>
    </PageWrapper>
  );
};
