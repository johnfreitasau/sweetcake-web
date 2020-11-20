import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import * as S from './styles';

const Settings: React.FC = () => {
  return (
    <S.Container>
      <S.Content>
        <h1>Settings</h1>
        <div>
          <S.SettingsButton>
            <FiUserPlus size={34} color="#fff" />
            <Link to="/settings/signup">Create new User</Link>
          </S.SettingsButton>
        </div>
      </S.Content>
    </S.Container>
  );
};

export default Settings;
