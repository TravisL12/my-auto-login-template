import { Link } from 'react-router-dom';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import { HeroSection, Title, Subtitle } from './styles/Landing.styles';

export const Landing: React.FC = () => {
  return (
    <HeroSection direction="column" align="center" justify="center" padding="4rem 0">
      <Container>
        <Box direction="column" align="center" gap="2rem">
          <Title>Welcome to Auth App</Title>
          <Subtitle>
            A modern authentication system with secure cookie-based JWT tokens
          </Subtitle>
          <Box gap="1.5rem" wrap="wrap" justify="center">
            <Button as={Link} to="/register" size="large">
              Get Started
            </Button>
            <Button as={Link} to="/login" size="large" variant="outline">
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </HeroSection>
  );
};
