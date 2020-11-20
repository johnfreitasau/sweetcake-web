import styled, { css } from 'styled-components';
import Tooltip from '../../Tooltip';

interface LabelContainerProp {
  showErro: 'bottom' | 'border';
  hasError: boolean;
}

export const LabelContainer = styled.label<LabelContainerProp>`
  display: flex;
  width: 100%;
  flex-direction: column;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.grayHard};
  input {
    margin-top: 8px;
    background: ${({ theme }) => theme.colors.dark};
    color: #f4ede8 !important;
    font-size: 18px;
    border: ${({ theme }) => `1px solid ${theme.colors.dark}`};
    border-radius: 10px;
    padding: 16px;
    height: 56px;
    width: 100%;
    ${(props) =>
      props.hasError &&
      props.showErro === 'border' &&
      css`
        border-color: ${({ theme }) => theme.colors.error};
      `}

    &:hover {
      border-color: ${({ theme }) => theme.colors.orange};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.grayHard};
    }
    &[type='number'] {
      ::-webkit-inner-spin-button,
      ::-webkit-outer-spin-button {
        appearance: none;
      }
    }
  }
  span {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.error};
    display: block;
    margin: 8px 0 0 8px;
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
