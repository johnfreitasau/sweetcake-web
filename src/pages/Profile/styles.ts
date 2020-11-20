import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';

export const NewContent = styled.div`
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

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 0 16px;
  box-shadow: 0px 0px 18px #000;
`;
