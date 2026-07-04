import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clientes', label: 'Clientes' },
  { to: '/vehiculos', label: 'Vehiculos' },
  { to: '/citas', label: 'Citas' },
  { to: '/ordenes', label: 'Ordenes de servicio' },
  { to: '/facturas', label: 'Facturas' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AG</span>
          <span className="brand-text">AutoGestPro</span>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">Taller &mdash; Panel de gestion</div>
          <div className="topbar-user">
            <div className="user-meta">
              <span className="user-name">{user?.nombreCompleto}</span>
              <span className="user-role">{user?.rol}</span>
            </div>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
