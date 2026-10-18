import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/candidates', label: 'Candidates', icon: '👥' },
  { to: '/pipeline', label: 'Pipeline', icon: '🔄' },
];

/**
 * Navbar - top navigation bar with active-link highlighting
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎯</span>
        <span className="brand-name">MiniATS</span>
      </div>
      <ul className="nav-links">
        {navLinks.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
