import React, { useRef, useEffect, useCallback, useState } from 'react';
import Select, {
  GroupedOptionsType,
  OptionsType,
  OptionTypeBase,
  StylesConfig,
  Theme,
} from 'react-select';
// import Select, { Props as AsyncProps } from 'react-select/async';
import { useField } from '@unform/core';

import { LabelContainer } from './styles';

interface Props {
  name: string;
  label: string;
  label_name?: string;
  options?: GroupedOptionsType<OptionTypeBase> | OptionsType<OptionTypeBase>;
}

const InputSelect: React.FC<Props> = ({
  name,
  label,
  label_name,
  options,
  ...rest
}) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const colourStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      marginTop: 8,
      marginLeft: 15,
      borderRadius: 10,
      borderColor: error ? '#EE4D64' : '#232129',
      fontSize: 18,
      height: 56,
    }),
    option: (styels) => ({
      ...styels,
      color: '#F4EDE8',
    }),
  };

  const themeProps = (theme: Theme): Theme => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: '#666360',
        primary25: '#63532e',
        primary50: '#999591',
        primary75: '#4c9aff',
        danger: '#de350b',
        dangerLight: '#ffbdad',
        neutral0: '#232129',
        neutral5: '#f2f2f2',
        neutral10: '#e6e6e6',
        neutral20: '#cccccc',
        neutral30: '#FBC131',
        neutral40: '#999999',
        neutral50: '#808080',
        neutral60: '#666666',
        neutral70: '#4d4d4d',
        neutral80: '#F4EDE8',
        neutral90: '#1a1a1a',
      },
    };
  };

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (!ref.select.state.value) {
          return '';
        }

        return ref.select.state.value.value;
      },
      setValue: (ref: any, value: any) => {
        ref.select.state.value = value;
      },
      clearValue: (ref: any) => {
        ref.select.select.clearValue();
      },
    });
  }, [fieldName, registerField]);

  return (
    <LabelContainer htmlFor={label_name || name}>
      {label}
      <Select
        cacheOptions
        isClearable
        isSearchable
        // defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        theme={themeProps}
        maxMenuHeight={225}
        styles={colourStyles}
        name={label_name || name}
        id={label_name || name}
        options={options}
        loadingMessage={() => 'Loading ...'}
        {...rest}
      />
    </LabelContainer>
  );
};

export default InputSelect;
