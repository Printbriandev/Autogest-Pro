import { useCallback, useEffect, useState } from 'react';
import { citasApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { CitaListItem } from '../api/types';
import { Empty, ErrorBox, Loading, StatusBadge } from '../components/Feedback';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const dateTime = new Intl.DateTimeFormat('es-DO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function CitasPage() {
  const [items, setItems] = useState<CitaListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await citasApi.list(
          {
            desde: desde || undefined,
            hasta: hasta || undefined,
            page,
            pageSize: PAGE_SIZE,
          },
          signal,
        );
        setItems(resp.data?.items ?? []);
        setTotalPages(resp.data?.totalPages ?? 0);
        setTotalItems(resp.data?.totalItems ?? 0);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las citas.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [desde, hasta, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Citas</h2>
        <p className="page-sub">Agenda de citas del taller</p>
      </div>

      <div className="toolbar">
        <label className="field field-inline">
          <span>Desde</span>
          <input
            type="date"
            value={desde}
            onChange={(e) => {
              setPage(1);
              setDesde(e.target.value);
            }}
          />
        </label>
        <label className="field field-inline">
          <span>Hasta</span>
          <input
            type="date"
            value={hasta}
            onChange={(e) => {
              setPage(1);
              setHasta(e.target.value);
            }}
          />
        </label>
      </div>

      {loading ? (
        <Loading label="Cargando citas..." />
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <Empty label="No hay citas en el rango seleccionado." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.idCita}>
                    <td>{dateTime.format(new Date(c.fechaHoraCita))}</td>
                    <td>{c.cliente}</td>
                    <td>{c.tipo}</td>
                    <td>{c.motivoConsulta}</td>
                    <td>
                      <StatusBadge value={c.estado} />
                    </td>
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
