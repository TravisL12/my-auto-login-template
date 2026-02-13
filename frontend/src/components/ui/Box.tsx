import styled from 'styled-components';

interface BoxProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: string;
  padding?: string;
  margin?: string;
  background?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  borderRadius?: string;
  flex?: string | number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export const Box = styled.div<BoxProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  gap: ${({ gap }) => gap || '0'};
  padding: ${({ padding }) => padding || '0'};
  margin: ${({ margin }) => margin || '0'};
  background: ${({ background }) => background || 'transparent'};
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  max-height: ${({ maxHeight }) => maxHeight || 'none'};
  min-width: ${({ minWidth }) => minWidth || 'auto'};
  min-height: ${({ minHeight }) => minHeight || 'auto'};
  border-radius: ${({ borderRadius }) => borderRadius || '0'};
  flex: ${({ flex }) => flex || '0 1 auto'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
`;
