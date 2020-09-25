import React, { ButtonHTMLAttributes } from 'react';
import { FiPlus } from 'react-icons/fi';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
};

const RegisterButton: React.FC<ButtonProps> = ({ onClick, isLoading }) => {
  return (
    <ButtonContainer type="button" onClick={onClick} disabled={isLoading}>
      <FiPlus size={24} />
      {isLoading ? 'Loading ...' : 'ADD CUSTOMER'}
    </ButtonContainer>
  );
};

export default RegisterButton;
