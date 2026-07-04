import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { vehiculosApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { VehiculoListItem } from '../api/types';
import { Empty, ErrorBox, Loading, StatusBadge } from '../components/Feedback';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

export default function VehiculosPage() {
  const [items, setItems] = useState<VehiculoListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [placa, setPlaca] = useState('');
  const [placaInput, setPlacaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await vehiculosApi.list({ placa, page, pageSize: PAGE_SIZE }, signal);
        setItems(resp.data?.items ?? []);
        setTotalPages(resp.data?.totalPages ?? 0);
        setTotalItems(resp.data?.totalItems ?? 0);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los vehiculos.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [placa, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setPlaca(placaInput.trim());
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Vehiculos</h2>
        <p className="page-sub">Flota registrada por cliente</p>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por placa..."
          value={placaInput}
          onChange={(e) => setPlacaInput(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">
          Buscar
        </button>
      </form>

      {loading ? (
        <Loading label="Cargando vehiculos..." />
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <Empty label="No se encontraron vehiculos." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Cliente</th>
                  <th>Marca / Modelo</th>
                  <th>Anio</th>
                  <th>Kilometraje</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.idVehiculo}>
                    <td className="mono">{v.numeroPlaca}</td>
                    <td>{v.cliente}</td>
                    <td>
                      {v.marca} {v.modelo}
                    </td>
                    <td>{v.anio}</td>
                    <td>{v.kilometrajeActual.toLocaleString('es-DO')} km</td>
                    <td>
                      <StatusBadge value={v.activo ? 'Activo' : 'Inactivo'} />
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
