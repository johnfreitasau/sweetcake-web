import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 0 16px;
  /* padding: 60px 48px 0; */
  /* padding: 60px 135px 0 55px; */
`;

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  padding-top: 60px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  span {
    font-size: 24px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 3px;
  tr {
    th {
      font-size: 18px;
      font-weight: 500;
    }
    th:nth-child(1) {
      text-align: left;
      padding-left: 16px;
    }
    th:nth-child(3) {
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(4) {
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(5) {
      text-align: right;
      padding-right: 16px;
    }
  }
`;

export const CustomerRow = styled.tr`
  td {
    height: 56px;
  }
  td:nth-child(1) {
    padding-left: 16px;
    //border-radius: 10px 0 0 10px;
  }
  td:nth-child(2) {
    text-align: center;
  }
  td:nth-child(3) {
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(4) {
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(5) {
    text-align: right;
    padding-right: 16px;
    //border-radius: 0 10px 10px 0;

    div :nth-child(1):hover {
      color: ${({ theme }) => theme.colors.gray};
      cursor: pointer;
    }

    div :nth-child(2) {
      margin-left: 10px;
    }

    div :nth-child(2):hover {
      color: ${({ theme }) => theme.colors.gray};
      cursor: pointer;
    }
  }

  background: ${({ theme }) => theme.colors.shape};
  font-size: 16px;
  transition: background 0.3s;
  &:hover {
    background: ${({ theme }) => shade(0.4, theme.colors.shape)};
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 60px;
`;
