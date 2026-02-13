import styled from 'styled-components';
import { Box } from './Box';

interface InputWrapperProps {
  error?: boolean;
}

const InputWrapper = styled(Box)<InputWrapperProps>`
  position: relative;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StyledInput = styled.input<InputWrapperProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  background: ${({ theme }) => theme.colors.input.background};
  border: 2px solid
    ${({ error, theme }) => (error ? theme.colors.error : theme.colors.input.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
  }

  &:focus {
    border-color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.input.focus)};
    box-shadow: 0 0 0 3px
      ${({ error }) =>
        error ? 'rgba(255, 107, 107, 0.2)' : 'rgba(100, 255, 218, 0.2)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <InputWrapper direction="column">
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput error={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};
