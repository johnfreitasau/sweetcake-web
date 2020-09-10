import React, { ButtonHTMLAttributes } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

import { hi } from 'date-fns/locale';
import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
  changePageTo: 'increment' | 'decrement';
};

// const ChangePageButton: React.FC<ButtonProps> = ({
//   disabled = false,
//   changePageTo,
//   ...rest
// }) => {
// const ChangePageButton :React.FC = (() => {})

//   return (
//     <h1>hi</h1>

// //     // <ButtonContainer type="button" disabled={disabled} {...rest}>
// //     //   {changePageTo === 'increment' ? (
// //     //     <FiArrowRight size={24} />
// //     //   ) : (
// //     //     <FiArrowLeft size={24} />
// //     //   )}
// // )}    // </ButtonContainer>
//   )};

// export default ChangePageButton;
