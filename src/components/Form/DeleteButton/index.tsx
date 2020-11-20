import React, { ButtonHTMLAttributes, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { ButtonContainer } from './styles';

import api from '../../../services/api';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  path: string;
}

const DeleteButton: React.FC<ButtonProps> = ({ path, ...rest }) => {
  const history = useHistory();

  const handleDeleteItem = useCallback(() => {
    api.delete(path);
    history.goBack();
  }, [history, path]);

  return (
    <ButtonContainer type="button" onClick={handleDeleteItem} {...rest}>
      <FiTrash2 size={24} />
      Delete
    </ButtonContainer>
  );
};

export default DeleteButton;
