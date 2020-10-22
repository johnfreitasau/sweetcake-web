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

    input {
      width: 22px;
      height: 30px;
    }
  }
`;
