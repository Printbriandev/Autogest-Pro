import type { ClienteListItem, CreateClienteRequest, PagedResult } from "../../entities/cliente";
import { httpClient } from "../../shared/api/httpClient";

export function getClientes(search = "") {
  const params = new URLSearchParams({ page: "1", pageSize: "20" });
  if (search.trim()) {
    params.set("search", search.trim());
  }

  return httpClient<PagedResult<ClienteListItem>>(`/api/clientes?${params}`);
}

export function createCliente(request: CreateClienteRequest) {
  return httpClient("/api/clientes", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
