import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  memo,
} from 'react';
import Switch from 'react-switch';
import { FiX, FiTruck, FiUsers, FiMenu, FiLogOut } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { shade } from 'polished';
// import toolSvg from '../../assets/tool.svg';

import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { Container, SignOutButton } from './styles';
import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

interface Props {
  toggleTheme(): void;
}

const Sidebar: React.FC<Props> = ({ toggleTheme }) => {
  const [theme, setTheme] = useState(dark);

  const { colors, title } = useContext(ThemeContext);

  const [isOpened, setIsOpened] = useState(() => {
    const sidebarState = localStorage.getItem('@JustCupcakes:sidebarState');

    if (sidebarState) {
      return true;
    }

    return false;
  });

  const handleToggleSidebar = useCallback(() => {
    setIsOpened((state) => !state);
  }, []);

  useEffect(() => {
    if (isOpened) {
      localStorage.setItem('@JustCupcakes:sidebarState', String(isOpened));
    } else {
      localStorage.removeItem('@JustCupcakes:sidebarState');
    }
  }, [isOpened]);

  const { signOut } = useAuth();

  return (
    <Container isOpened={!!isOpened}>
      <div>
        <button type="button" onClick={handleToggleSidebar}>
          {isOpened ? <FiX size={32} /> : <FiMenu size={32} />}
        </button>
      </div>
      <nav>
        <NavLink to="/sales">
          {isOpened && 'Sales'}
          <FiTruck size={24} />
        </NavLink>
        <NavLink to="/customers">
          {isOpened && 'Customers'}
          <FiUsers size={24} />
        </NavLink>
        <NavLink to="/inventory">
          {isOpened && 'Inventory'}
          {/* <img src={toolSvg} alt="tool" /> */}
        </NavLink>
        <Switch
          onChange={toggleTheme}
          checked={title === 'dark'}
          checkedIcon={false}
          uncheckedIcon={false}
          height={10}
          width={40}
          handleDiameter={20}
          offColor={shade(0.15, colors.background)}
          onColor={colors.background}
        />
      </nav>
      <SignOutButton onClick={signOut}>
        {isOpened && <strong>Sair</strong>}
        <FiLogOut size={24} />
      </SignOutButton>
    </Container>
  );
};

export default memo(Sidebar);
