import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';

import { InputCurrency } from '../../../../../components/Form';

export const Form = styled(UnForm)`
  margin-top: 32px;
`;

export const InputFormRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 10px;
`;

export const DeliveryFeeInput = styled(InputCurrency)`
  color: ${({ theme }) => theme.colors.grayHard};
  margin: 0;
  padding: 0;
  max-width: 220px;
  width: 100%;
  margin-left: 16px;

  input {
    color: ${({ theme }) => theme.colors.grayHard};
  }
`;

export const DeliveryDateInput = styled(InputCurrency)`
  max-width: 250px;
  width: 100%;
  //margin-left: 16px;
`;

export const PaymentMethodInputSelect = styled.select`
  /* max-width: 100px;
  width: 100%;
  margin-left: 16px; */

  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border: none;
  margin-left: 10px;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;
