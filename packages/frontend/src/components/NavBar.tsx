import React from 'react';
import { Link } from 'react-router-dom';

export interface NavItem {
  path: string;
  label: string;
}

export interface NavBarProps {
  items: NavItem[];
}

const NavBar: React.FC<NavBarProps> = ({ items }) => (
  <nav aria-label="Main navigation">
    <ul className="navbar">
      {items.map(item => (
        <li key={item.path}>
          <Link to={item.path} className="nav-link">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default NavBar;
