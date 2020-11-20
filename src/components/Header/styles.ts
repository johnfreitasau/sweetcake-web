import styled from 'styled-components';
import { Form as UForm } from '@unform/web';

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  h1 {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Form = styled(UForm)`
  display: flex;
  max-width: 415px;
  width: 100%;
  margin-left: auto;
`;
