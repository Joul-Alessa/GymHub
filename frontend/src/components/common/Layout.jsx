import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const links = [
  { to: '/', label: 'Catalog', end: true },
  { to: '/diary', label: 'Diary' },
  { to: '/stats', label: 'Stats' },
  { to: '/metrics', label: 'Metrics' },
  { to: '/settings', label: 'Sports & Tags' },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-brand">Sportus</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
