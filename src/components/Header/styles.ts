import styled from 'styled-components';

import { Form as UForm } from '@unform/web';

export const Container = styled.div`
  height: 50px;
  background: ${(props) => props.theme.colors.background};
  color: '#444';
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  h1 {
    font-weight: normal;
    font-size: 20px;
    margin-left: auto;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  h1 {
    font-family: 'Sacramento', sans-serif;
    color: #e1e1e1;
    font-size: 26px;
  }

  div {
    margin-left: auto;
    color: #e1e1e1;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #e1e1e1;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Form = styled(UForm)`
  display: flex;
  max-width: 415px;
  width: 100%;
`;
