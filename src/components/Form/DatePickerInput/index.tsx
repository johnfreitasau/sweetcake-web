import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useField } from '@unform/core';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { LabelContainer } from './styles';

interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  name: string;
  label: string;
  label_name?: string;
  showErro?: 'bottom' | 'border';
}

const InputLabel: React.FC<DatePickerProps> = ({
  name,
  label,
  label_name = '',
  className,
  showErro = 'bottom',
  ...rest
}) => {
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const datePickerRef = useRef(null);

  const [date, setDate] = useState(defaultValue || new Date());

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datePickerRef.current,
      path: 'props.selected',
      clearValue: (ref: any) => {
        ref.clear();
      },
    });
  }, [fieldName, registerField]);

  const handleDateChange = useCallback((changedDate) => {
    setDate(changedDate);
  }, []);

  return (
    <LabelContainer
      showErro={showErro}
      hasError={!!error}
      htmlFor={label_name || name}
      className={className}
    >
      {label}
      <DatePicker
        ref={datePickerRef}
        selected={date}
        onChange={(changedDate) => handleDateChange(changedDate)}
        showTimeSelect
        timeIntervals={60}
        dateFormat="dd/MM/yyyy - hh:00 aa"
        {...rest}
      />
      {error && showErro === 'bottom' && <span>{error}</span>}
    </LabelContainer>
  );
};

export default InputLabel;
