import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0 16px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.orange};
  transition: background 0.3s;
  &:hover {
    background: ${({ theme }) => shade(0.2, theme.colors.orange)};
  }
`;
