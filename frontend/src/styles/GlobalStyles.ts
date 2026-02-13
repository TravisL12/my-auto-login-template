import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${({ theme }) => theme.colors.text.accent};
    text-decoration: none;
    transition: opacity ${({ theme }) => theme.transitions.fast};

    &:hover {
      opacity: 0.8;
    }
  }

  button {
    font-family: ${({ theme }) => theme.fonts.primary};
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea {
    font-family: ${({ theme }) => theme.fonts.primary};
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;
