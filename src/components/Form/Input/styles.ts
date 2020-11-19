import styled, { css } from 'styled-components';
import Tooltip from '../../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  margin-top: 8px;
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;

  border: 1px solid #232129;
  color: #666360;

  &:hover {
    border-color: #E67E22;
  }

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
   

  ${(props) =>
    props.isFocused &&
    css`
      color: #f4ede8;
      border-color: #666360;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #f4ede8;
      border-color: #e67e22;
    `}


  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #f4ede8;
    font-size: 18px;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  srv {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
