import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'large':
        return `${theme.spacing.md} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }
  }};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme.fontSizes.sm;
      case 'large':
        return theme.fontSizes.xl;
      default:
        return theme.fontSizes.lg;
    }
  }};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return theme.colors.background.secondary;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.button.primary;
    }
  }};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ variant, theme }) =>
    variant === 'outline' ? `2px solid ${theme.colors.text.accent}` : 'none'};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  cursor: ${({ disabled, loading }) => (disabled || loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled, loading }) => (disabled || loading ? 0.6 : 1)};
  transition: all ${({ theme }) => theme.transitions.normal};
  pointer-events: ${({ disabled, loading }) => (disabled || loading ? 'none' : 'auto')};

  &:hover {
    background: ${({ variant, theme }) => {
      switch (variant) {
        case 'secondary':
          return theme.colors.background.primary;
        case 'outline':
          return 'rgba(100, 255, 218, 0.1)';
        default:
          return theme.colors.button.hover;
      }
    }};
    transform: ${({ disabled, loading }) => (disabled || loading ? 'none' : 'translateY(-2px)')};
    box-shadow: ${({ disabled, loading }) =>
      disabled || loading ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.3)'};
  }

  &:active {
    transform: ${({ disabled, loading }) => (disabled || loading ? 'none' : 'translateY(0)')};
  }
`;
