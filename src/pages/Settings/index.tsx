import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';

import { Container, Content, ButtonContainer } from './styles';

const Settings: React.FC = () => {
  const history = useHistory();

  const handleSubmitButton = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      history.push('/settings/signup');
    },
    [history],
  );

  return (
    <Container>
      <Content>
        <header>
          <h1>Settings</h1>
        </header>

        <div>
          <ButtonContainer type="button" onClick={handleSubmitButton}>
            <FiUserPlus size={20} />
            Register new user
          </ButtonContainer>
        </div>
      </Content>
    </Container>
  );
};

export default Settings;
