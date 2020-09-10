import React, { useContext, memo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { shade } from 'polished';
import { FormHelpers, FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/auth';
import { Container, HeaderContent } from './styles';

// import { InputSearch } from '../Form';
// import SearchButton from '../SearchButton';
// import LinkToCreatePage from '../LinkToCreatePage';

import * as S from './styles';

interface SearchFormData {
  name: string;
}

interface HeaderProps {
  onSubmit(data: SearchFormData, options?: FormHelpers): void;
  disabled?: boolean;
  initialName?: string | null;
  createPage: string;
  title: string;
  placeholder?: string;
}

const Header: React.FC<HeaderProps> = ({
  initialName,
  onSubmit,
  disabled = false,
  createPage,
  title,
  placeholder,
}) => {
  const { user, signOut } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const { colors } = useContext(ThemeContext);

  const clearValue = useCallback(() => {
    formRef.current?.reset();
    onSubmit({ name: '' });
  }, [onSubmit]);

  return (
    <Container>
      <HeaderContent>
        <h1>JustCupcakes</h1>
        <Link to="/profile">{user.name}</Link>
      </HeaderContent>

      <S.Form
        ref={formRef}
        initialData={{ name: initialName }}
        onSubmit={onSubmit}
      >
        {/* <InputSearch
          placeholder={placeholder}
          name="name"
          disabled={disabled}
          clearValue={clearValue}
        />
        <SearchButton
          type="submit"
          style={{ marginLeft: 16 }}
          disabled={disabled}
        /> */}
      </S.Form>
      {/* <LinkToCreatePage to={createPage} /> */}
      <h1>{title}x</h1>
    </Container>
  );
};

export default Header;
