export const theme = {
  colors: {
    background: {
      primary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      secondary: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
      tertiary: '#1a1a2e',
      card: 'rgba(26, 26, 46, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a8b2d1',
      accent: '#64ffda',
    },
    button: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hover: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    },
    input: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      focus: '#64ffda',
    },
    error: '#ff6b6b',
    success: '#51cf66',
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSizes: {
    xs: '0.875rem',      // 14px
    sm: '1rem',          // 16px
    md: '1.25rem',       // 20px
    lg: '1.5rem',        // 24px
    xl: '2rem',          // 32px
    xxl: '3rem',         // 48px
    xxxl: '4rem',        // 64px - VERY LARGE
  },
  spacing: {
    xs: '0.5rem',        // 8px
    sm: '1rem',          // 16px
    md: '1.5rem',        // 24px
    lg: '2rem',          // 32px
    xl: '3rem',          // 48px
    xxl: '4rem',         // 64px
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1200px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export type Theme = typeof theme;
