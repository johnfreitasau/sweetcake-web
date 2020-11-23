import React, { useState, useCallback, useEffect, memo } from 'react';
import {
  FiPackage,
  FiBook,
  FiGrid,
  FiChevronLeft,
  FiUsers,
  FiMenu,
  FiPower,
  FiSettings,
} from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';

import { NavLink } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

import { Container, SignOutButton } from './styles';

const Sidebar: React.FC = () => {
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
          {/* {isOpened ? <FiChevronLeft size={32} /> : <FiMenu size={32} />} */}
          {isOpened ? <h3>cupcakes.co</h3> : <FiMenu size={32} />}
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
        <NavLink to="/profile">
          <FaRegUserCircle size={24} />
          {isOpened && 'Profile'}
        </NavLink>
        <NavLink to="/settings">
          <FiSettings size={24} />
          {isOpened && 'Settings'}
        </NavLink>
      </nav>
      <SignOutButton onClick={signOut}>
        <FiPower size={24} />
        {isOpened && <strong>SignOut</strong>}
      </SignOutButton>
    </Container>
  );
};

export default memo(Sidebar);
