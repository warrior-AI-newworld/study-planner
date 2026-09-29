import { NavLink } from 'react-router-dom';
import './Navbar.css';

const navigationItems = [
  { to: '/tasks', label: 'All tasks' },
  { to: '/pending', label: 'Pending' },
  { to: '/completed', label: 'Completed' },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="brand" to="/tasks" aria-label="Task Planner home">
          <span className="brand__mark" aria-hidden="true">T</span>
          <span>Task Planner</span>
        </NavLink>
        <nav className="primary-nav" aria-label="Task views">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `primary-nav__link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}