import { apiFetch } from './client';
import type {
  ApiResponse,
  Catalogos,
  CitaListItem,
  ClienteDetail,
  ClienteListItem,
  CreateClienteRequest,
  DashboardSummary,
  FacturaListItem,
  LoginRequest,
  LoginResponse,
  OrdenServicioListItem,
  PagedResult,
  UpdateClienteRequest,
  UsuarioListItem,
  VehiculoListItem,
  VentaMensual,
} from './types';

// ----- Auth -----
export const authApi = {
  login: (body: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiFetch<LoginResponse>('/api/auth/login', { method: 'POST', body }),
};

// ----- Catalogos -----
export const catalogosApi = {
  getAll: (signal?: AbortSignal): Promise<ApiResponse<Catalogos>> =>
    apiFetch<Catalogos>('/api/catalogos', { signal }),
};

// ----- Clientes -----
export const clientesApi = {
  list: (
    query: { search?: string; page?: number; pageSize?: number },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<ClienteListItem>>> =>
    apiFetch<PagedResult<ClienteListItem>>('/api/clientes', { query, signal }),

  getById: (id: number, signal?: AbortSignal): Promise<ApiResponse<ClienteDetail>> =>
    apiFetch<ClienteDetail>(`/api/clientes/${id}`, { signal }),

  create: (body: CreateClienteRequest): Promise<ApiResponse<ClienteDetail>> =>
    apiFetch<ClienteDetail>('/api/clientes', { method: 'POST', body }),

  update: (id: number, body: UpdateClienteRequest): Promise<ApiResponse<ClienteDetail>> =>
    apiFetch<ClienteDetail>(`/api/clientes/${id}`, { method: 'PUT', body }),

  deactivate: (id: number): Promise<ApiResponse<unknown>> =>
    apiFetch<unknown>(`/api/clientes/${id}/desactivar`, { method: 'PATCH' }),
};

// ----- Vehiculos -----
export const vehiculosApi = {
  list: (
    query: { idCliente?: number; placa?: string; page?: number; pageSize?: number },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<VehiculoListItem>>> =>
    apiFetch<PagedResult<VehiculoListItem>>('/api/vehiculos', { query, signal }),
};

// ----- Citas -----
export const citasApi = {
  list: (
    query: {
      desde?: string;
      hasta?: string;
      idEstadoCita?: number;
      page?: number;
      pageSize?: number;
    },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<CitaListItem>>> =>
    apiFetch<PagedResult<CitaListItem>>('/api/citas', { query, signal }),
};

// ----- Ordenes de servicio -----
export const ordenesApi = {
  list: (
    query: {
      idEstadoOrden?: number;
      numeroOrden?: string;
      page?: number;
      pageSize?: number;
    },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<OrdenServicioListItem>>> =>
    apiFetch<PagedResult<OrdenServicioListItem>>('/api/ordenes-servicio', { query, signal }),
};

// ----- Facturas -----
export const facturasApi = {
  list: (
    query: {
      idEstadoFactura?: number;
      idCliente?: number;
      page?: number;
      pageSize?: number;
    },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<FacturaListItem>>> =>
    apiFetch<PagedResult<FacturaListItem>>('/api/facturas', { query, signal }),
};

// ----- Usuarios -----
export const usuariosApi = {
  list: (
    query: { search?: string; page?: number; pageSize?: number },
    signal?: AbortSignal,
  ): Promise<ApiResponse<PagedResult<UsuarioListItem>>> =>
    apiFetch<PagedResult<UsuarioListItem>>('/api/usuarios', { query, signal }),
};

// ----- Reportes -----
export const reportesApi = {
  dashboard: (signal?: AbortSignal): Promise<ApiResponse<DashboardSummary>> =>
    apiFetch<DashboardSummary>('/api/reportes/dashboard', { signal }),

  ventasMensuales: (
    anio?: number,
    signal?: AbortSignal,
  ): Promise<ApiResponse<VentaMensual[]>> =>
    apiFetch<VentaMensual[]>('/api/reportes/ventas-mensuales', { query: { anio }, signal }),
};
