import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { catalogosApi, clientesApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { CatalogoItem, ClienteListItem, CreateClienteRequest } from '../api/types';
import { Empty, ErrorBox, Loading, StatusBadge } from '../components/Feedback';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const emptyForm: CreateClienteRequest = {
  idTipoCliente: 0,
  nombres: '',
  apellidos: '',
  razonSocial: '',
  tipoDocumento: 'CED',
  numeroDocumento: '',
  telefono: '',
  telefonoAlternativo: '',
  correoElectronico: '',
};

export default function ClientesPage() {
  const [items, setItems] = useState<ClienteListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tiposCliente, setTiposCliente] = useState<CatalogoItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await clientesApi.list({ search, page, pageSize: PAGE_SIZE }, signal);
        const data = resp.data;
        setItems(data?.items ?? []);
        setTotalPages(data?.totalPages ?? 0);
        setTotalItems(data?.totalItems ?? 0);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los clientes.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [search, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // Catalogo de tipos de cliente para el formulario de alta.
  useEffect(() => {
    const controller = new AbortController();
    catalogosApi
      .getAll(controller.signal)
      .then((resp) => setTiposCliente(resp.data?.tiposCliente ?? []))
      .catch(() => setTiposCliente([]));
    return () => controller.abort();
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDeactivate = async (cliente: ClienteListItem) => {
    if (!confirm(`Desactivar al cliente "${cliente.nombreCompleto}"?`)) return;
    try {
      await clientesApi.deactivate(cliente.idCliente);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo desactivar el cliente.');
    }
  };

  return (
    <div className="page">
      <div className="page-head page-head-row">
        <div>
          <h2>Clientes</h2>
          <p className="page-sub">Directorio de clientes del taller</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          Nuevo cliente
        </button>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por nombre, documento o telefono..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn btn-ghost">
          Buscar
        </button>
      </form>

      {loading ? (
        <Loading label="Cargando clientes..." />
      ) : error ? (
        <ErrorBox message={error} />
      ) : items.length === 0 ? (
        <Empty label="No se encontraron clientes." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Telefono</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th aria-label="acciones" />
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.idCliente}>
                    <td>{c.nombreCompleto}</td>
                    <td>
                      <span className="mono">
                        {c.tipoDocumento} {c.numeroDocumento}
                      </span>
                    </td>
                    <td>{c.telefono}</td>
                    <td>{c.correoElectronico ?? '—'}</td>
                    <td>
                      <StatusBadge value={c.activo ? 'Activo' : 'Inactivo'} />
                    </td>
                    <td className="cell-actions">
                      {c.activo && (
                        <button
                          type="button"
                          className="btn btn-danger-ghost"
                          onClick={() => handleDeactivate(c)}
                        >
                          Desactivar
                        </button>
                      )}
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

      {showForm && (
        <ClienteFormModal
          tiposCliente={tiposCliente}
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            setPage(1);
            setSearch('');
            setSearchInput('');
            void load();
          }}
        />
      )}
    </div>
  );
}

interface ModalProps {
  tiposCliente: CatalogoItem[];
  onClose: () => void;
  onCreated: () => void;
}

function ClienteFormModal({ tiposCliente, onClose, onCreated }: ModalProps) {
  const [form, setForm] = useState<CreateClienteRequest>({
    ...emptyForm,
    idTipoCliente: tiposCliente[0]?.id ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CreateClienteRequest>(key: K, value: CreateClienteRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await clientesApi.create({
        ...form,
        razonSocial: form.razonSocial || null,
        telefonoAlternativo: form.telefonoAlternativo || null,
        correoElectronico: form.correoElectronico || null,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el cliente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Nuevo cliente</h3>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {error && <ErrorBox message={error} />}

          <div className="grid-2">
            <label className="field">
              <span>Tipo de cliente</span>
              <select
                value={form.idTipoCliente}
                onChange={(e) => update('idTipoCliente', Number(e.target.value))}
                required
              >
                <option value={0} disabled>
                  Seleccionar...
                </option>
                {tiposCliente.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tipo de documento</span>
              <select
                value={form.tipoDocumento}
                onChange={(e) => update('tipoDocumento', e.target.value)}
              >
                <option value="CED">Cedula</option>
                <option value="RNC">RNC</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </label>
            <label className="field">
              <span>Nombres</span>
              <input value={form.nombres} onChange={(e) => update('nombres', e.target.value)} required />
            </label>
            <label className="field">
              <span>Apellidos</span>
              <input
                value={form.apellidos}
                onChange={(e) => update('apellidos', e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Numero de documento</span>
              <input
                value={form.numeroDocumento}
                onChange={(e) => update('numeroDocumento', e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Telefono</span>
              <input value={form.telefono} onChange={(e) => update('telefono', e.target.value)} required />
            </label>
            <label className="field">
              <span>Telefono alternativo</span>
              <input
                value={form.telefonoAlternativo ?? ''}
                onChange={(e) => update('telefonoAlternativo', e.target.value)}
              />
            </label>
            <label className="field">
              <span>Correo electronico</span>
              <input
                type="email"
                value={form.correoElectronico ?? ''}
                onChange={(e) => update('correoElectronico', e.target.value)}
              />
            </label>
            <label className="field field-full">
              <span>Razon social (opcional)</span>
              <input
                value={form.razonSocial ?? ''}
                onChange={(e) => update('razonSocial', e.target.value)}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
