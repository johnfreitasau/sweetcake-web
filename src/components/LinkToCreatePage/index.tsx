import React from 'react';
import { FiPlus, FiUserPlus } from 'react-icons/fi';

import { ContainerLink } from './styles';

interface LinkToCreatePageProps {
  to: string;
}

const LinkToCreatePage: React.FC<LinkToCreatePageProps> = ({ to }) => {
  return (
    <ContainerLink to={to}>
      <FiUserPlus size={24} />
    </ContainerLink>
  );
};

export default LinkToCreatePage;
