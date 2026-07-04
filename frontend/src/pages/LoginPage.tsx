import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(nombreUsuario.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'No se pudo iniciar sesion. Intenta de nuevo.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="brand-mark">AG</span>
          <div>
            <h1>AutoGestPro</h1>
            <p>Gestion de taller mecanico</p>
          </div>
        </div>

        {error && <div className="feedback feedback-error">{error}</div>}

        <label className="field">
          <span>Usuario</span>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            autoComplete="username"
            required
            autoFocus
          />
        </label>

        <label className="field">
          <span>Contrasena</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="login-hint">
          Conecta con la API AutoGestPro (<code>POST /api/auth/login</code>).
        </p>
      </form>
    </div>
  );
}
