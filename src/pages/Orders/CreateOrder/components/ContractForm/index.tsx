import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles } from '@unform/core';

import DatePickerInput from '../../../../../components/Form/DatePickerInput';
import { SelectAsyncInput, SelectInput } from '../../../../../components/Form';
import CheckboxInput from '../../../../../components/Form/CheckboxInput';
import api from '../../../../../services/api';

import { Form, DeliveryFeeInput, InputFormRow } from './styles';

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Option {
  value: string;
  label: string;
}

interface ContractFormData {
  customerId: string;
  deliveryFee?: string;
  deliveryDate: string;
}

interface ContractFormProps {
  onSubmit(data: ContractFormData): void;
  formRef: React.RefObject<FormHandles>;
}

interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit, formRef }) => {
  const [customerOptions, setCustomerOptions] = useState<Option[]>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<Option[]>([
    { value: 'creditCard', label: 'Credit Card' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
  ]);
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersPagesAvailable, setCustomersPagesAvailable] = useState(0);

  useEffect(() => {
    async function loadCustomerOptions(): Promise<void> {
      const response = await api.get<Customer[]>('/customers');

      const customersTotalCount = response.headers['x-total-count'];

      setCustomersPagesAvailable(Math.ceil(customersTotalCount / 7));
      setCustomerOptions(
        response.data.map((customer) => ({
          label: customer.name,
          value: customer.id,
        })),
      );
      setOptionsIsLoading(false);
    }
    console.log('loaded UseEffect');

    loadCustomerOptions();
  }, []);

  const handleCustomersMenuScrollToBottom = useCallback(async () => {
    if (customersPage === customersPagesAvailable) return;

    setOptionsIsLoading(true);
    const response = await api.get<Customer[]>('/customers', {
      params: {
        page: customersPage + 1,
      },
    });

    setCustomerOptions((state) => [
      ...state,
      ...response.data.map((customer) => ({
        label: customer.name,
        value: customer.id,
      })),
    ]);
    setCustomersPage(customersPage + 1);
    setOptionsIsLoading(false);
  }, [customersPage, customersPagesAvailable]);

  const handleLoadCustomerOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = customerOptions.filter((customer) =>
        customer.label.includes(inputValue),
      );

      if (data.length === 0) {
        setOptionsIsLoading(true);
        const response = await api.get<Customer[]>('/customers', {
          params: {
            name: inputValue,
          },
        });

        setOptionsIsLoading(false);

        callback(
          response.data.map((customer) => ({
            label: customer.name,
            value: customer.id,
          })),
        );
        return;
      }

      callback(data);
    },
    [customerOptions],
  );

  return (
    <div>
      <Form ref={formRef} onSubmit={onSubmit}>
        <InputFormRow>
          <SelectAsyncInput
            placeholder="Choose the customer"
            label="Customer"
            name="customerId"
            defaultOptions={customerOptions}
            loadOptions={handleLoadCustomerOptions}
            onMenuScrollToBottom={handleCustomersMenuScrollToBottom}
            noOptionsMessage={() => 'Customer not found'}
            isLoading={optionsIsLoading}
          />
          <DeliveryFeeInput name="deliveryFee" label="Delivery Fee" />
        </InputFormRow>
        <InputFormRow>
          <DatePickerInput label="Delivery Date" name="dateOrder" />
          <SelectInput
            label="Payment Method"
            name="product_id"
            options={paymentMethodOptions}
          />
          <CheckboxInput
            name="checkbox"
            options={[
              { id: 'paid', value: 'paid', label: 'Order Paid' },
              { id: 'pickup', value: 'pickup', label: 'Customer Pickup' },
            ]}
          />
        </InputFormRow>
      </Form>
    </div>
  );
};

export default ContractForm;
