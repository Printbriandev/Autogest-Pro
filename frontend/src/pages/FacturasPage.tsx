import { useCallback, useEffect, useState } from 'react';
import { facturasApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { FacturaListItem } from '../api/types';
import { Empty, ErrorBox, Loading, StatusBadge } from '../components/Feedback';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;
const currency = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' });
const dateFmt = new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium' });

export default function FacturasPage() {
  const [items, setItems] = useState<FacturaListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await facturasApi.list({ page, pageSize: PAGE_SIZE }, signal);
        setItems(resp.data?.items ?? []);
        setTotalPages(resp.data?.totalPages ?? 0);
        setTotalItems(resp.data?.totalItems ?? 0);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las facturas.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Facturas</h2>
        <p className="page-sub">Documentos de facturacion y saldos</p>
      </div>

      {loading ? (
        <Loading label="Cargando facturas..." />
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <Empty label="No se encontraron facturas." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>NCF</th>
                  <th>Cliente</th>
                  <th>Emision</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((f) => (
                  <tr key={f.idFactura}>
                    <td className="mono">{f.numeroFactura}</td>
                    <td className="mono">{f.ncf ?? '—'}</td>
                    <td>{f.cliente}</td>
                    <td>{dateFmt.format(new Date(f.fechaEmision))}</td>
                    <td>
                      <StatusBadge value={f.estado} />
                    </td>
                    <td className="text-right">{currency.format(f.total)}</td>
                    <td className="text-right">{currency.format(f.saldoPendiente)}</td>
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
