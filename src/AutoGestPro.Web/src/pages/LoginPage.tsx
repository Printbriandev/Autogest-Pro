import { useState, type FormEvent } from "react";
import type { Session } from "../entities/auth";
import { login } from "../features/auth/session";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

type LoginPageProps = {
  onAuthenticated: (session: Session) => void;
};

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await login({ nombreUsuario, password });
      onAuthenticated(session);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card" aria-label="Inicio de sesion">
        <img className="login-card__logo" src="/autogestpro-logo.png" alt="AutoGestPro" />
        <p className="login-card__subtitle">Taller Mecanico</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            value={nombreUsuario}
            placeholder="Ingrese su usuario"
            autoComplete="username"
            onChange={(event) => setNombreUsuario(event.target.value)}
            required
          />

          <label className="field">
            <span>Contrasena</span>
            <span className="password-control">
              <input
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contrasena"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Validando..." : "Iniciar Sesion"}
          </Button>
        </form>
      </section>
    </main>
  );
}
