import { useEffect, useState } from "react";
import type { DashboardSummary } from "../entities/dashboard";
import { getDashboardSummary } from "../features/dashboard/dashboardApi";
import { moneyFormatter, numberFormatter } from "../shared/lib/formatters";

const emptySummary: DashboardSummary = {
  clientesActivos: 0,
  vehiculosActivos: 0,
  citasPendientes: 0,
  ordenesAbiertas: 0,
  facturasPendientes: 0,
  repuestosBajoStock: 0,
};

export function DashboardPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .finally(() => setIsLoading(false));
  }, []);

  const metrics = [
    ["Clientes activos", numberFormatter.format(summary.clientesActivos)],
    ["Vehiculos activos", numberFormatter.format(summary.vehiculosActivos)],
    ["Citas pendientes", numberFormatter.format(summary.citasPendientes)],
    ["Ordenes abiertas", numberFormatter.format(summary.ordenesAbiertas)],
    ["Balance pendiente", moneyFormatter.format(summary.facturasPendientes)],
    ["Repuestos bajo stock", numberFormatter.format(summary.repuestosBajoStock)],
  ];

  return (
    <div className="page">
      <div className="metric-grid">
        {metrics.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{isLoading ? "..." : value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
