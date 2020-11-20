import React, { memo, useRef, useCallback } from 'react';
import { FormHelpers, FormHandles } from '@unform/core';

import { InputSearch } from '../Form';
import SearchButton from '../Form/SearchButton';
import LinkToCreatePage from '../LinkToCreatePage';

import * as S from './styles';

interface SearchFormData {
  name: string;
}

interface HeaderProps {
  onSubmit(data: SearchFormData, options?: FormHelpers): void;
  initialName?: string | null;
  createPage: string;
  title: string;
  placeholder?: string;
}

const Header: React.FC<HeaderProps> = ({
  initialName,
  onSubmit,
  createPage,
  title,
  placeholder,
}) => {
  const formRef = useRef<FormHandles>(null);

  const clearValue = useCallback(() => {
    formRef.current?.reset();
    onSubmit({ name: '' });
  }, [onSubmit]);

  return (
    <S.Header>
      <h1>{title}</h1>
      <S.Form
        ref={formRef}
        initialData={{ name: initialName }}
        onSubmit={onSubmit}
      >
        <InputSearch
          placeholder={placeholder}
          name="name"
          clearValue={clearValue}
        />
        <SearchButton type="submit" style={{ marginLeft: 16 }} />
      </S.Form>

      <LinkToCreatePage to={createPage} />
    </S.Header>
  );
};

export default memo(Header);
