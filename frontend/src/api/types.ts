// Tipos que reflejan los contratos de AutoGestPro.Contracts.
// ASP.NET Core serializa en camelCase por defecto, por eso las propiedades
// aqui usan camelCase respecto a los records de C#.

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[] | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ----- Auth -----
export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombreCompleto: string;
  rol: string;
  token: string;
  fechaExpiracion: string;
}

// ----- Catalogos -----
export interface CatalogoItem {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface ModeloVehiculoItem {
  idModelo: number;
  idMarca: number;
  nombre: string;
}

export interface Catalogos {
  tiposCliente: CatalogoItem[];
  marcas: CatalogoItem[];
  modelos: ModeloVehiculoItem[];
  colores: CatalogoItem[];
  tiposVehiculo: CatalogoItem[];
  tiposCita: CatalogoItem[];
  estadosCita: CatalogoItem[];
  estadosOrden: CatalogoItem[];
  estadosFactura: CatalogoItem[];
  metodosPago: CatalogoItem[];
  tiposNcf: CatalogoItem[];
}

// ----- Clientes -----
export interface ClienteListItem {
  idCliente: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico?: string | null;
  activo: boolean;
}

export interface ClienteDetail {
  idCliente: number;
  idTipoCliente: number;
  nombres: string;
  apellidos: string;
  razonSocial?: string | null;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  telefonoAlternativo?: string | null;
  correoElectronico?: string | null;
  activo: boolean;
  fechaCreacion: string;
}

export interface CreateClienteRequest {
  idTipoCliente: number;
  nombres: string;
  apellidos: string;
  razonSocial?: string | null;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  telefonoAlternativo?: string | null;
  correoElectronico?: string | null;
}

export interface UpdateClienteRequest {
  nombres: string;
  apellidos: string;
  razonSocial?: string | null;
  telefono: string;
  telefonoAlternativo?: string | null;
  correoElectronico?: string | null;
  activo: boolean;
}

// ----- Vehiculos -----
export interface VehiculoListItem {
  idVehiculo: number;
  idCliente: number;
  cliente: string;
  marca: string;
  modelo: string;
  anio: number;
  numeroPlaca: string;
  kilometrajeActual: number;
  activo: boolean;
}

export interface VehiculoDetail {
  idVehiculo: number;
  idCliente: number;
  idMarca: number;
  idModelo: number;
  idColor: number;
  idTipoVehiculo: number;
  anio: number;
  numeroPlaca: string;
  numeroChasis?: string | null;
  numeroMotor?: string | null;
  cilindraje?: number | null;
  tipoCombustible: string;
  transmision: string;
  kilometrajeActual: number;
  observaciones?: string | null;
  activo: boolean;
}

// ----- Citas -----
export interface CitaListItem {
  idCita: number;
  idCliente: number;
  idVehiculo?: number | null;
  cliente: string;
  estado: string;
  tipo: string;
  fechaHoraCita: string;
  motivoConsulta: string;
}

// ----- Ordenes de servicio -----
export interface OrdenServicioListItem {
  idOrdenServicio: number;
  numeroOrden: string;
  idCliente: number;
  idVehiculo: number;
  cliente: string;
  estado: string;
  fechaIngreso: string;
  fechaPrometida?: string | null;
  total: number;
}

// ----- Facturas -----
export interface FacturaListItem {
  idFactura: number;
  numeroFactura: string;
  ncf?: string | null;
  idCliente: number;
  cliente: string;
  estado: string;
  fechaEmision: string;
  total: number;
  montoPagado: number;
  saldoPendiente: number;
}

// ----- Usuarios -----
export interface UsuarioListItem {
  idUsuario: number;
  nombreCompleto: string;
  nombreUsuario: string;
  correoElectronico: string;
  rol: string;
  activo: boolean;
}

// ----- Reportes -----
export interface DashboardSummary {
  clientesActivos: number;
  vehiculosActivos: number;
  citasPendientes: number;
  ordenesAbiertas: number;
  facturasPendientes: number;
  repuestosBajoStock: number;
}

export interface VentaMensual {
  anio: number;
  mes: number;
  totalFacturas: number;
  totalFacturado: number;
  totalCobrado: number;
}
