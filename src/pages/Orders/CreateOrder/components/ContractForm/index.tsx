import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';

import api from '../../../../../services/api';

import { InputAsyncSelect } from '../../../../../components/Form';

import { Form, DeliveryPriceInput } from './styles';

interface Customer {
  // id: string;
  // name: string;
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
  client_id: string;
  delivery_price?: string;
}

interface ContractFormProps {
  onSubmit(data: ContractFormData): void;
  formRef: React.RefObject<FormHandles>;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit, formRef }) => {
  // JF
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  const [customerOptions, setCustomerOptions] = useState<Option[]>([]);
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);
  const [clientsPage, setClientsPage] = useState(1);
  const [clientsPagesAvailable, setClientsPagesAvailable] = useState(0);

  useEffect(() => {
    async function loadCustomerOptions(): Promise<void> {
      // const response = await api.get<Customer[]>('/customers');

      const response = await api.get<Customer[]>('/customers', {
        params: {
          page: queryPage || 1,
          name: queryName || undefined,
        },
      });

      console.log('data:', response.data);
      const clientsTotalCount = response.headers['x-total-count'];

      setClientsPagesAvailable(Math.ceil(clientsTotalCount / 7));
      setCustomerOptions(
        response.data.map((customer) => ({
          label: customer.name,
          value: customer.id,
        })),
      );
      setOptionsIsLoading(false);
    }

    loadCustomerOptions();
  }, []);

  const handleClientsMenuScrollToBottom = useCallback(async () => {
    if (clientsPage === clientsPagesAvailable) return;

    setOptionsIsLoading(true);
    const response = await api.get<Customer[]>('/customers', {
      params: {
        page: clientsPage + 1,
      },
    });

    setCustomerOptions((state) => [
      ...state,
      ...response.data.map((client) => ({
        label: client.name,
        value: client.id,
      })),
    ]);
    setClientsPage(clientsPage + 1);
    setOptionsIsLoading(false);
  }, [clientsPage, clientsPagesAvailable]);

  const handleLoadClientOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = customerOptions.filter((customer) =>
        customer.label.includes(inputValue),
      );

      if (data.length === 0) {
        // fazer debaunce
        setOptionsIsLoading(true);
        const response = await api.get<Customer[]>('/clients', {
          params: {
            name: inputValue,
          },
        });

        setOptionsIsLoading(false);

        callback(
          response.data.map((client) => ({
            label: client.name,
            value: client.id,
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
        <InputAsyncSelect
          placeholder="Choose the customer"
          label="Customer"
          name="client_id"
          defaultOptions={customerOptions}
          loadOptions={handleLoadClientOptions}
          onMenuScrollToBottom={handleClientsMenuScrollToBottom}
          noOptionsMessage={() => 'Customer not found'}
          isLoading={optionsIsLoading}
        />
        <DeliveryPriceInput name="delivery_price" label="Delivery Fee" />
      </Form>
    </div>
  );
};

export default ContractForm;
