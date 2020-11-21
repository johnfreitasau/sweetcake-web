import React, { ButtonHTMLAttributes } from 'react';
import { FiPlus } from 'react-icons/fi';
import { GrUpdate } from 'react-icons/gr';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
  label?: string;
};

const RegisterButton: React.FC<ButtonProps> = ({
  onClick,
  isLoading,
  label,
}) => {
  return (
    <ButtonContainer type="button" onClick={onClick} disabled={isLoading}>
      {label === 'Create' ? <FiPlus size={24} /> : <GrUpdate size={15} />}
      {isLoading ? 'Loading...' : label}
    </ButtonContainer>
  );
};

export default RegisterButton;
