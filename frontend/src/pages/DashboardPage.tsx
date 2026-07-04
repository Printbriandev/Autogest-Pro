import { useEffect, useState } from 'react';
import { reportesApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { DashboardSummary, VentaMensual } from '../api/types';
import { ErrorBox, Loading } from '../components/Feedback';

const currency = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' });
const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

interface Card {
  label: string;
  value: string;
  accent: string;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ventas, setVentas] = useState<VentaMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [resumenResp, ventasResp] = await Promise.all([
          reportesApi.dashboard(controller.signal),
          reportesApi.ventasMensuales(undefined, controller.signal),
        ]);
        setSummary(resumenResp.data);
        setVentas(ventasResp.data ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudo cargar el dashboard.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (loading) return <Loading label="Cargando dashboard..." />;
  if (error) return <ErrorBox message={error} />;

  const cards: Card[] = summary
    ? [
        { label: 'Clientes activos', value: String(summary.clientesActivos), accent: 'blue' },
        { label: 'Vehiculos activos', value: String(summary.vehiculosActivos), accent: 'indigo' },
        { label: 'Citas pendientes', value: String(summary.citasPendientes), accent: 'amber' },
        { label: 'Ordenes abiertas', value: String(summary.ordenesAbiertas), accent: 'teal' },
        {
          label: 'Facturas pendientes',
          value: currency.format(summary.facturasPendientes),
          accent: 'rose',
        },
        {
          label: 'Repuestos bajo stock',
          value: String(summary.repuestosBajoStock),
          accent: 'slate',
        },
      ]
    : [];

  const maxVenta = ventas.reduce((max, v) => Math.max(max, v.totalFacturado), 0);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Dashboard</h2>
        <p className="page-sub">Resumen operativo del taller</p>
      </div>

      <div className="cards">
        {cards.map((card) => (
          <div key={card.label} className={`card card-${card.accent}`}>
            <span className="card-value">{card.value}</span>
            <span className="card-label">{card.label}</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <h3>Ventas mensuales</h3>
        {ventas.length === 0 ? (
          <p className="page-sub">Sin datos de ventas para el periodo.</p>
        ) : (
          <div className="chart">
            {ventas.map((v) => {
              const height = maxVenta > 0 ? Math.round((v.totalFacturado / maxVenta) * 100) : 0;
              return (
                <div key={`${v.anio}-${v.mes}`} className="chart-col">
                  <div className="chart-bar-wrap" title={currency.format(v.totalFacturado)}>
                    <div className="chart-bar" style={{ height: `${height}%` }} />
                  </div>
                  <span className="chart-label">
                    {MESES[(v.mes - 1) % 12]} {String(v.anio).slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
