import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 0 16px;
  box-shadow: 0px 0px 18px #000;
`;

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  padding-top: 40px;
  margin: 0 auto;
  display: flex;
  //flex-direction: column;

  h1 {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.white};
  }

  > div {
    display: flex;
    //flex-direction: column;
    width: 800px;
    max-width: 80%;
    min-width: 100px;
    min-height: 400px;
    padding: 20px 40px;
    border-radius: 6px;
    box-shadow: 0px 8px 36px #000;
    background-color: #f4ede8;
  }
`;

export const SettingsButton = styled.div`
  width: 300px;
  height: 200px;
  border-radius: 16px;
  margin: 20px;
  background: ${({ theme }) => theme.colors.gray};
`;

// export const MessageContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 100%;
//   width: 100%;
//   span {
//     font-size: 24px;
//     font-weight: 500;
//     color: ${({ theme }) => theme.colors.white};
//   }
// `;
