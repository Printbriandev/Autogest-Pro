import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ordenesApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { OrdenServicioListItem } from '../api/types';
import { Empty, ErrorBox, Loading, StatusBadge } from '../components/Feedback';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;
const currency = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' });
const dateFmt = new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium' });

function formatDate(value?: string | null): string {
  return value ? dateFmt.format(new Date(value)) : '—';
}

export default function OrdenesPage() {
  const [items, setItems] = useState<OrdenServicioListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [numeroOrden, setNumeroOrden] = useState('');
  const [numeroInput, setNumeroInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await ordenesApi.list({ numeroOrden, page, pageSize: PAGE_SIZE }, signal);
        setItems(resp.data?.items ?? []);
        setTotalPages(resp.data?.totalPages ?? 0);
        setTotalItems(resp.data?.totalItems ?? 0);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las ordenes.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [numeroOrden, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setNumeroOrden(numeroInput.trim());
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Ordenes de servicio</h2>
        <p className="page-sub">Trabajos en el taller</p>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por numero de orden..."
          value={numeroInput}
          onChange={(e) => setNumeroInput(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">
          Buscar
        </button>
      </form>

      {loading ? (
        <Loading label="Cargando ordenes..." />
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <Empty label="No se encontraron ordenes de servicio." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Ingreso</th>
                  <th>Prometida</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.idOrdenServicio}>
                    <td className="mono">{o.numeroOrden}</td>
                    <td>{o.cliente}</td>
                    <td>{formatDate(o.fechaIngreso)}</td>
                    <td>{formatDate(o.fechaPrometida)}</td>
                    <td>
                      <StatusBadge value={o.estado} />
                    </td>
                    <td className="text-right">{currency.format(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
