import styled from 'styled-components';
import { Form as UnForm } from '@unform/web';

import { InputCurrency } from '../../../../../components/Form';

export const Form = styled(UnForm)`
  margin-top: 32px;

  display: flex;
  align-items: flex-end;
`;

export const DeliveryFeeInput = styled(InputCurrency)`
  max-width: 200px;
  width: 100%;
  margin-left: 16px;
`;

export const DeliveryDateInput = styled(InputCurrency)`
  max-width: 200px;
  width: 100%;
  margin-left: 16px;
`;
