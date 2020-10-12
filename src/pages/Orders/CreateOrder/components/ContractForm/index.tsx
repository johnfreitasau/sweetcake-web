import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import Select from 'react-select';

import api from '../../../../../services/api';

import { InputAsyncSelect } from '../../../../../components/Form';

import { Form, DeliveryFeeInput, DeliveryDateInput } from './styles';

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
  deliveryFee?: string;
  deliveryDate: string;
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
  const [enableCustomerInfo, setEnableCustomerInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([
    { value: 'creditCard', label: 'Credit Card' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
  ]);

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
  }, [queryName, queryPage]);

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

  const handleLoadCustomerOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = customerOptions.filter((customer) =>
        customer.label.includes(inputValue),
      );

      if (data.length === 0) {
        // fazer debaunce
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

  // const handleSelectCustomer = useCallback(async (e) => {
  //   console.log('current:', formRef.current);
  //   // console.log('value:', formRef.select.state.value);
  //   //    console.log(e.target.value);

  //   //   this.setState({ selectedOption });
  //   //   console.log(`Option selected:`, selectedOption);
  //   // };
  // }, []);

  const handleSelectedValue = useCallback((e) => {
    console.log('e', e);
    console.log('selectRef', formRef);
    // console.log(selectValue);
  }, []);

  return (
    <div>
      <Form ref={formRef} onSubmit={onSubmit}>
        <InputAsyncSelect
          placeholder="Choose the customer"
          label="Customer"
          name="client_id"
          defaultOptions={customerOptions}
          loadOptions={handleLoadCustomerOptions}
          onMenuScrollToBottom={handleClientsMenuScrollToBottom}
          noOptionsMessage={() => 'Customer not found'}
          isLoading={optionsIsLoading}
          onChange={handleSelectedValue}
        />
        <DeliveryFeeInput name="deliveryFee" label="Delivery Fee" />
        <DeliveryDateInput name="deliveryDate" label="Delivery Date" />
        <div>
          <Select options={paymentMethod} />
          <input type="checkbox" value="paid" /> Paid
        </div>
      </Form>
      {/* {
  enableCustomerInfo && (
    
  )} */}
    </div>
  );
};

export default ContractForm;
