import type { PropsWithChildren } from "react";
import type { Session } from "../entities/auth";
import { clearStoredSession } from "../features/auth/session";

export type AppRoute = "dashboard" | "clientes";

type AppLayoutProps = PropsWithChildren<{
  activeRoute: AppRoute;
  session: Session;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}>;

export function AppLayout({ activeRoute, session, onNavigate, onLogout, children }: AppLayoutProps) {
  function handleLogout() {
    clearStoredSession();
    onLogout();
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbar__brand">
          <img src="/autogestpro-logo.png" alt="AutoGestPro" />
        </div>

        <nav className="tabs" aria-label="Modulos principales">
          <button
            className={activeRoute === "dashboard" ? "tabs__item tabs__item--active" : "tabs__item"}
            type="button"
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeRoute === "clientes" ? "tabs__item tabs__item--active" : "tabs__item"}
            type="button"
            onClick={() => onNavigate("clientes")}
          >
            Clientes
          </button>
        </nav>

        <div className="session">
          <div>
            <strong>{session.nombreCompleto}</strong>
            <span>{session.rol}</span>
          </div>
          <button className="button button--secondary" type="button" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <section className="shell__content">{children}</section>
    </main>
  );
}
