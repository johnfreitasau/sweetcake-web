import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import Select from 'react-select';

import DatePickerInput from '../../../../../components/Form/DatePickerInput';
import 'react-day-picker/lib/style.css';

import api from '../../../../../services/api';

import { InputAsyncSelect, InputSelect } from '../../../../../components/Form';

import {
  Form,
  DeliveryFeeInput,
  InputFormRow,
  DeliveryDateInput,
  PaymentMethodInputSelect,
} from './styles';

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
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<Option[]>([
    { value: 'creditCard', label: 'Credit Card' },
    { value: 'bankTransfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
  ]);
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersPagesAvailable, setCustomersPagesAvailable] = useState(0);
  const [enableCustomerInfo, setEnableCustomerInfo] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState([
  //   { value: 'creditCard', label: 'Credit Card' },
  //   { value: 'bankTransfer', label: 'Bank Transfer' },
  //   { value: 'cash', label: 'Cash' },
  // ]);

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

    loadCustomerOptions();
  }, [queryName, queryPage]);

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

  const handleLoadPaymentMethodOptions = useCallback(
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

  const handleSelectedValue = useCallback((e) => {
    console.log('e', e);
    console.log('selectRef', formRef);
    // console.log(selectValue);
  }, []);

  return (
    <div>
      <Form ref={formRef} onSubmit={onSubmit}>
        <InputFormRow>
          <InputAsyncSelect
            placeholder="Choose the customer"
            label="Customer"
            name="client_id"
            defaultOptions={customerOptions}
            loadOptions={handleLoadCustomerOptions}
            onMenuScrollToBottom={handleCustomersMenuScrollToBottom}
            noOptionsMessage={() => 'Customer not found'}
            isLoading={optionsIsLoading}
          />
          <DeliveryFeeInput name="deliveryFee" label="Delivery Fee" />

          {/* <DatePickerInput name="deliveryDate" label="Delivery Date" /> */}
          {/* <DeliveryDateInput name="deliveryDate" label="Delivery Date" /> */}
        </InputFormRow>
        <InputFormRow>
          <DeliveryDateInput name="Delivery Date" placeholder="Delivery Date" />
          <InputSelect
            placeholder="Choose the payment method"
            label="Payment Method"
            name="product_id"
            // defaultOptions={paymentMethodOptions}
            loadOptions={handleLoadPaymentMethodOptions}
            noOptionsMessage={() => 'payment not found'}
            isLoading={optionsIsLoading}
            options={paymentMethodOptions}
          />
          <input type="checkbox" value="paid" /> Paid
        </InputFormRow>
      </Form>
      {/* {
  enableCustomerInfo && (
    
  )} */}
    </div>
  );
};

export default ContractForm;
