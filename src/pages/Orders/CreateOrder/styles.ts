import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';

export const Container = styled.div`
  width: 100%;
  padding: 0 16px;
`;

export const Content = styled.div`
  max-width: 900px;
  width: 100%;
  background: ${({ theme }) => theme.colors.shape};
  margin: 0 auto;
  margin-top: 64px;
  border-radius: 10px;
  padding: 32px;
  border: 1px black;

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
    section {
      display: flex;
    }
  }
`;

export const Form = styled(UnForm)`
  div {
    display: flex;
    justify-content: space-between;
    & + div {
      margin-top: 16px;
    }

    label {
      width: 100%;
      & + label {
        width: 340px;
        margin-left: 16px;
      }
    }
  }
`;
