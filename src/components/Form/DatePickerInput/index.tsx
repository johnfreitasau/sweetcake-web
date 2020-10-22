import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
import DatePicker from 'react-datepicker';
import 'react-day-picker/lib/style.css';

import { LabelContainer } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  label_name?: string;
  showErro?: 'bottom' | 'border';
}

const InputLabel: React.FC<InputProps> = ({
  name,
  label,
  label_name = '',
  className,
  showErro = 'bottom',
  ...rest
}) => {
  const [startDate, setStartDate] = useState(new Date());

  const { fieldName, defaultValue, error, registerField } = useField(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleDateChange = useCallback((date) => {
    setStartDate(date);
  }, []);

  return (
    <LabelContainer
      showErro={showErro}
      hasError={!!error}
      htmlFor={label_name || name}
      className={className}
    >
      {label}
      {/* <input
        name={label_name || name}
        id={label_name || name}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      /> */}
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date)}
        showTimeSelect
        dateFormat="Pp"
        locale="es"
        className="react-datepicker-styles"
      />
      {error && showErro === 'bottom' && <span>{error}</span>}
    </LabelContainer>
  );
};

export default InputLabel;
