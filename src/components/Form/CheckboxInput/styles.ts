import styled from 'styled-components';

export const CheckboxContainer = styled.div`
  display: flex;
  font-size: 15px;

  div {
    margin-left: 15px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-left: 40px;

    input {
      margin-top: 17px;
      margin-bottom: 18px;
      height: 25px;
      width: 25px;
      background-color: #232129;
      -webkit-appearance: none;
      -moz-appearance: none;
      -o-appearance: none;
      appearance: none;
      border: 1px solid #232129;
      border-radius: 25px;
      outline: none;
      transition-duration: 0.3s;

      cursor: pointer;
    }

    input:checked {
      border: 1px solid ${({ theme }) => theme.colors.orange};
      background-color: ${({ theme }) => theme.colors.orange};
    }

    input:hover {
      border: 1px solid ${({ theme }) => theme.colors.orange};
    }

    input:active {
      border: 2px solid #34495e;
    }
  }

  div:last-child {
    margin-right: 20px;
  }
`;
