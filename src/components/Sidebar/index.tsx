import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  memo,
} from 'react';
import Switch from 'react-switch';
import {
  FiPackage,
  FiBook,
  FiTruck,
  FiBox,
  FiGrid,
  FiChevronsLeft,
  FiUsers,
  FiMenu,
  // FiLogOut,
  FiPower,
  FiSettings,
} from 'react-icons/fi';
// import { BiFoodMenu } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import { shade } from 'polished';
// import toolSvg from '../../assets/tool.svg';

import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { Container, SignOutButton } from './styles';
import dark from '../../styles/themes/dark';

interface Props {
  toggleTheme(): void;
}

const Sidebar: React.FC<Props> = ({ toggleTheme }) => {
  const [theme, setTheme] = useState(dark);

  const { colors, title } = useContext(ThemeContext);

  const [isOpened, setIsOpened] = useState(() => {
    const sidebarState = localStorage.getItem('@cupcakes.co:sidebarState');

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
      localStorage.setItem('@cupcakes.co:sidebarState', String(isOpened));
    } else {
      localStorage.removeItem('@cupcakes.co:sidebarState');
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
        <NavLink to="/orders">
          <FiPackage size={24} />
          {isOpened && 'Orders'}
        </NavLink>
        <NavLink to="/customers">
          <FiUsers size={24} />
          {isOpened && 'Customers'}
        </NavLink>
        <NavLink to="/categories">
          <FiGrid size={24} />
          {isOpened && 'Categories'}
        </NavLink>
        <NavLink to="/products">
          <FiBook size={24} />
          {isOpened && 'Products'}
        </NavLink>
      </nav>
      {/* <SettingsButton>
        <FiSettings size={24} />
        {isOpened && <strong>Settings</strong>}
      </SettingsButton> */}
      <SignOutButton onClick={signOut}>
        <FiPower size={24} />
        {isOpened && <strong>SignOut</strong>}
      </SignOutButton>
    </Container>
  );
};

export default memo(Sidebar);
