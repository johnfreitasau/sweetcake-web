import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  memo,
} from 'react';
import Switch from 'react-switch';
import {
  FiGrid,
  FiDollarSign,
  FiBox,
  FiChevronsLeft,
  FiUsers,
  FiLayers,
  FiMenu,
  FiLogOut,
  FiSettings,
  FiFileText,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { shade } from 'polished';
// import toolSvg from '../../assets/tool.svg';

import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { Container, SettingsButton, SignOutButton } from './styles';
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
          {isOpened ? <FiChevronsLeft size={32} /> : <FiMenu size={32} />}
        </button>
      </div>
      <nav>
        <NavLink to="/dashboard">
          {isOpened && 'Dashboard'}
          {/* <img src={toolSvg} alt="tool" /> */}
          <FiGrid size={24} />
        </NavLink>
        <NavLink to="/customers">
          {isOpened && 'Contacts'}
          <FiUsers size={24} />
        </NavLink>
        <NavLink to="/sales">
          {isOpened && 'Sales'}
          <FiDollarSign size={24} />
        </NavLink>
        <NavLink to="/products">
          {isOpened && 'Products'}
          <FiBox size={24} />
        </NavLink>
        <NavLink to="/inventory">
          {isOpened && 'Inventory'}
          <FiLayers size={24} />
        </NavLink>
        <NavLink to="/reports">
          {isOpened && 'Reports'}
          <FiFileText size={24} />
        </NavLink>

        <Switch
          onChange={toggleTheme}
          checked={title === 'dark'}
          checkedIcon={false}
          uncheckedIcon={false}
          height={10}
          width={40}
          handleDiameter={20}
          offColor={shade(0.35, colors.background)}
          onColor={colors.background}
        />
      </nav>

      <SettingsButton onClick={signOut}>
        {isOpened && <strong>Settings</strong>}
        <FiSettings size={24} />
      </SettingsButton>
      <SignOutButton onClick={signOut}>
        {isOpened && <strong>SignOut</strong>}
        <FiLogOut size={24} />
      </SignOutButton>
    </Container>
  );
};

export default memo(Sidebar);
