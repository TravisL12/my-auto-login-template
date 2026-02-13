import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box } from '../components/ui/Box';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';

const HeroSection = styled(Box)`
  min-height: calc(100vh - 120px);
  background: ${({ theme }) => theme.colors.background.primary};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #64ffda 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  max-width: 800px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

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
