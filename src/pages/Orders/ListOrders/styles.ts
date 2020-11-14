import styled from 'styled-components';
import { shade } from 'polished';

type TStyledOrderStatus = {
  orderStatus: string;
};

interface CompletedFilterButtonProps {
  isSelected: boolean;
}

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
  border-spacing: 0 10px;
  cursor: pointer;
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
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(6) {
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(7) {
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(8) {
      text-align: center;
      padding-right: 16px;
    }
    th:nth-child(9) {
      text-align: center;
      padding-right: 16px;
    }
  }
`;

export const OrderRow = styled.tr<TStyledOrderStatus>`
  td {
    height: 56px;
  }
  td:nth-child(1) {
    text-align: center;
    padding-left: 16px;
    border-radius: 10px 0 0 10px;
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
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(6) {
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(7) {
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(8) {
    text-align: center;
    padding-right: 16px;
  }
  td:nth-child(9) {
    text-align: center;
    padding-right: 16px;
    border-radius: 0 10px 10px 0;

    div {
      border-radius: 7px;
      width: 60px;
      height: 20px;
      color: 'green' !important;
      text-shadow: 1px 1px 0 #444;
      color: #fff !important;
      background: ${({ orderStatus }: any) => {
        if (orderStatus === 'Open') {
          return '#FBC131';
        }
        if (orderStatus === 'Closed') {
          return '#009900';
        }
        return '#000';
      }};
    }

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

// NEW BELOW
export const CompletedFilterButton = styled.button<CompletedFilterButtonProps>`
  height: 46px;
  border: none;
  padding: 0 8px 0 16px;
  border-radius: 10px 0 0 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.green : theme.colors.dark};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.dark : theme.colors.white};
  &:hover {
    background: ${({ theme, isSelected }) =>
      !isSelected && shade(0.5, theme.colors.green)};
  }
  cursor: ${({ isSelected }) => (isSelected ? 'not-allowed' : 'pointer')};
  & + button {
    border-radius: 0 10px 10px 0;
    padding: 0 16px 0 8px;
  }
`;

export const ClientRow = styled.tr`
  td {
    height: 56px;
  }
  td:nth-child(1) {
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
  background: ${({ theme }) => theme.colors.shape};
  font-size: 16px;
  transition: background 0.3s;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => shade(0.4, theme.colors.shape)};
  }
`;
