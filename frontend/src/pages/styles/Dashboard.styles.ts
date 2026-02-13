import styled from 'styled-components';
import { Box } from '../../components/ui/Box';

export const PageWrapper = styled(Box)`
  min-height: calc(100vh - 120px);
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const WelcomeTitle = styled.h1`
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

export const Card = styled(Box)`
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

export const InfoRow = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md} 0;

  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  min-width: 120px;
`;

export const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.accent};
  font-weight: 700;
`;

export const SmallValue = styled(Value)`
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
