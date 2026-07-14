import { useMemo, useState } from "react";
import { AppLayout, type AppRoute } from "./layout";
import { getStoredSession } from "../features/auth/session";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ClientesPage } from "../pages/ClientesPage";

export function AppRouter() {
  const [session, setSession] = useState(getStoredSession);
  const [route, setRoute] = useState<AppRoute>("dashboard");

  const currentPage = useMemo(() => {
    if (!session) {
      return <LoginPage onAuthenticated={setSession} />;
    }

    if (route === "clientes") {
      return <ClientesPage />;
    }

    return <DashboardPage />;
  }, [route, session]);

  if (!session) {
    return currentPage;
  }

  return (
    <AppLayout activeRoute={route} session={session} onNavigate={setRoute} onLogout={() => setSession(null)}>
      {currentPage}
    </AppLayout>
  );
}
