import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  padding: 0 16px 0 16px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  box-shadow: 0px 0px 18px #000;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Content = styled.div`
  max-width: 900px;
  width: 100%;
  background: ${({ theme }) => theme.colors.shape};
  margin: 64px auto 64px auto;
  border-radius: 5px;
  padding: 32px;
  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      color: ${({ theme }) => theme.colors.white};
      font-size: 24px;
      font-weight: bold;
    }
    section {
      display: flex;
    }
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  span {
    font-size: 24px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const CustomerList = styled.div`
  margin: 56px 0 0 0;
  align-items: center;
  h1 {
    font-size: 28px;
    margin-bottom: 10px;

    color: ${({ theme }) => theme.colors.orange};
  }
  tbody {
    border-spacing: 15px;
    font-size: 20px;
    list-style-type: none;
    line-height: 1.6;

    td:nth-child(1) {
      text-align: right;
      font-weight: bold;
      min-width: 150px;
      color: ${({ theme }) => theme.colors.white};
    }
    td:nth-child(2) {
      padding-left: 20px;
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const OrderList = styled.div`
  margin: 56px 0 0 0;
  align-items: center;
  h1 {
    font-size: 28px;
    margin-bottom: 10px;

    color: ${({ theme }) => theme.colors.orange};
  }
  tbody {
    font-size: 20px;
    list-style-type: none;
    line-height: 1.6;
    td:nth-child(1) {
      text-align: right;
      font-weight: bold;
      min-width: 150px;
      color: ${({ theme }) => theme.colors.white};
    }
    td:nth-child(2) {
      padding-left: 20px;
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const ProductTable = styled.table`
  width: 100%;
  margin: 32px 0 0 0;
  border-collapse: separate;
  border-spacing: 0 16px;
  thead {
    tr {
      th {
        font-size: 18px;
        font-weight: 500;
      }
      th:nth-child(1) {
        text-align: left;
        padding-left: 16px;
      }
      th:nth-child(4) {
        text-align: right;
        padding-right: 16px;
      }
    }
  }
`;

export const ProductRow = styled.tr`
  font-size: 18px;
  background: ${({ theme }) => theme.colors.dark};
  td {
    height: 40px;
  }
  td:nth-child(1) {
    text-align: left;
    padding-left: 16px;
    border-radius: 10px 0 0 10px;
  }
  td:nth-child(2) {
    text-align: center;
  }
  td:nth-child(3) {
    text-align: center;
  }
  td:nth-child(4) {
    text-align: right;
    padding-right: 16px;
    border-radius: 0 10px 10px 0;
  }
`;

export const FinalInformation = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  justify-content: flex-end;
  span {
    background: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.dark};
    padding: 16px;
    border-radius: 10px;
  }
`;

export const Form = styled(UnForm)`
  margin: 32px 0 0 0;
  display: flex;
  align-items: flex-end;
  label + label {
    margin-left: 16px;
  }
`;

export const CloseButton = styled.button.attrs({
  type: 'submit',
})`
  border: none;
  height: 56px;
  border-radius: 10px;
  padding: 0 32px;
  margin-left: 16px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.error};
  transition: background 0.3s;
  &:hover {
    background: ${({ theme }) => shade(0.3, theme.colors.error)};
  }
`;
