export type ClienteListItem = {
  idCliente: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico: string | null;
  activo: boolean;
};

export type CreateClienteRequest = {
  idTipoCliente: number;
  nombres: string;
  apellidos: string;
  razonSocial: string | null;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  telefonoAlternativo: string | null;
  correoElectronico: string | null;
};

export type PagedResult<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
};
