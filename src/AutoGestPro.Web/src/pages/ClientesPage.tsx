import { useEffect, useState, type FormEvent } from "react";
import type { ClienteListItem } from "../entities/cliente";
import { createCliente, getClientes } from "../features/clientes/clientesApi";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

export function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadClientes(value = search) {
    const result = await getClientes(value);
    setClientes(result.items);
  }

  useEffect(() => {
    loadClientes("");
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadClientes();
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSaving(true);

    try {
      await createCliente({
        idTipoCliente: 1,
        nombres: String(form.get("nombres") ?? ""),
        apellidos: String(form.get("apellidos") ?? ""),
        razonSocial: null,
        tipoDocumento: "CED",
        numeroDocumento: String(form.get("documento") ?? ""),
        telefono: String(form.get("telefono") ?? ""),
        telefonoAlternativo: null,
        correoElectronico: String(form.get("correo") || "") || null,
      });

      event.currentTarget.reset();
      await loadClientes();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page page--split">
      <section className="panel">
        <div className="panel__header">
          <h1>Clientes</h1>
          <form className="search-form" onSubmit={handleSearch}>
            <input value={search} placeholder="Buscar cliente..." onChange={(event) => setSearch(event.target.value)} />
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </form>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Telefono</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.idCliente}>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{cliente.numeroDocumento}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correoElectronico ?? "Sin correo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Nuevo cliente</h2>
        <form className="form-grid" onSubmit={handleCreate}>
          <TextField label="Nombres" name="nombres" required />
          <TextField label="Apellidos" name="apellidos" required />
          <TextField label="Documento" name="documento" required />
          <TextField label="Telefono" name="telefono" required />
          <TextField label="Correo" name="correo" type="email" />
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Guardando..." : "Guardar cliente"}
          </Button>
        </form>
      </section>
    </div>
  );
}
