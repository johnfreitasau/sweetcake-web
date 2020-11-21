import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 0 16px;
  box-shadow: 0px 0px 18px #000;
`;

export const Content = styled.div`
  max-width: 550px;
  width: 100%;
  height: 460px;
  background: ${({ theme }) => theme.colors.shape};
  margin: 0 auto;
  margin-top: 64px;
  border-radius: 10px;
  padding: 32px;
  box-shadow: 0px 0px 18px ${({ theme }) => theme.colors.dark};
  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    h1 {
      font-size: 24px;
      font-weight: 500;
    }
  }
`;

export const ButtonContainer = styled.button`
  background: #e67e22;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#E67E22')};
  }
`;
