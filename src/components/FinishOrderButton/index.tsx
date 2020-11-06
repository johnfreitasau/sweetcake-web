import React, { ButtonHTMLAttributes } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
  showForm?: boolean;
};

const FinishOrderButton: React.FC<ButtonProps> = ({
  onClick,
  isLoading,
  showForm = false,
  ...rest
}) => {
  if (showForm) {
    return (
      <ButtonContainer
        type="button"
        onClick={onClick}
        disabled={isLoading}
        {...rest}
      >
        <FiXCircle size={20} />
        CANCELAR
      </ButtonContainer>
    );
  }

  return (
    <ButtonContainer
      type="button"
      onClick={onClick}
      disabled={isLoading}
      {...rest}
    >
      <FiCheckCircle size={20} />
      {isLoading ? 'Loading ...' : 'Close Order'}
    </ButtonContainer>
  );
};

export default FinishOrderButton;
