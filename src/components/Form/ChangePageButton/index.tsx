import React, { ButtonHTMLAttributes } from 'react';
import { FiArrowRightCircle, FiArrowLeft } from 'react-icons/fi';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
  changePageTo: 'increment' | 'decrement';
};

const ChangePageButton: React.FC<ButtonProps> = ({
  disabled = false,
  changePageTo,
  ...rest
}) => {
  return (
    <ButtonContainer type="button" disabled={disabled} {...rest}>
      {changePageTo === 'increment' ? (
        <MdKeyboardArrowRight size={24} />
      ) : (
        <MdKeyboardArrowLeft size={24} />
      )}
    </ButtonContainer>
  );
};

export default ChangePageButton;
