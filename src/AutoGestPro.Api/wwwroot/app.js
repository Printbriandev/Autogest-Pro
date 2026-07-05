const state = {
  page: 1,
  pageSize: 10,
  search: "",
  totalItems: 0,
  totalPages: 1,
  clients: [],
  tiposCliente: [],
  editing: null,
  toastTimer: null,
};

const els = {
  clientsBody: document.querySelector("#clientsBody"),
  emptyState: document.querySelector("#emptyState"),
  searchInput: document.querySelector("#searchInput"),
  newClientButton: document.querySelector("#newClientButton"),
  pageInfo: document.querySelector("#pageInfo"),
  prevPageButton: document.querySelector("#prevPageButton"),
  nextPageButton: document.querySelector("#nextPageButton"),
  drawer: document.querySelector("#clientDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  closeDrawerButton: document.querySelector("#closeDrawerButton"),
  cancelButton: document.querySelector("#cancelButton"),
  clientForm: document.querySelector("#clientForm"),
  drawerMode: document.querySelector("#drawerMode"),
  drawerTitle: document.querySelector("#drawerTitle"),
  saveButton: document.querySelector("#saveButton"),
  toast: document.querySelector("#toast"),
  fields: {
    clientId: document.querySelector("#clientId"),
    idTipoCliente: document.querySelector("#idTipoCliente"),
    tipoDocumento: document.querySelector("#tipoDocumento"),
    nombres: document.querySelector("#nombres"),
    apellidos: document.querySelector("#apellidos"),
    razonSocial: document.querySelector("#razonSocial"),
    numeroDocumento: document.querySelector("#numeroDocumento"),
    telefono: document.querySelector("#telefono"),
    telefonoAlternativo: document.querySelector("#telefonoAlternativo"),
    correoElectronico: document.querySelector("#correoElectronico"),
    activo: document.querySelector("#activo"),
    activeField: document.querySelector("#activeField"),
  },
};

const icons = {
  edit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`,
  view: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>`,
  undo: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"></path><path d="M4 9h10a6 6 0 0 1 0 12h-2"></path></svg>`,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

async function loadCatalogs() {
  try {
    const catalogos = await api("/api/catalogos");
    state.tiposCliente = Array.isArray(catalogos?.tiposCliente) ? catalogos.tiposCliente : [];
  } catch {
    state.tiposCliente = [];
  }

  renderTipoClienteOptions();
}

function renderTipoClienteOptions() {
  const options = state.tiposCliente.length
    ? state.tiposCliente.map((item) => {
        const id = item.id ?? item.idTipoCliente;
        const name = item.nombre ?? item.descripcion ?? `Tipo ${id}`;
        return `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`;
      })
    : [`<option value="1">Individual</option>`];

  els.fields.idTipoCliente.innerHTML = options.join("");
}

async function loadClients() {
  setBusy(true);
  try {
    const params = new URLSearchParams({
      page: String(state.page),
      pageSize: String(state.pageSize),
    });

    if (state.search) {
      params.set("search", state.search);
    }

    const result = await api(`/api/clientes?${params}`);
    state.clients = result.items ?? [];
    state.totalItems = result.totalItems ?? 0;
    state.totalPages = Math.max(result.totalPages ?? 1, 1);

    renderClients();
  } catch (error) {
    state.clients = [];
    state.totalItems = 0;
    state.totalPages = 1;
    renderClients();
    showToast(error.message || "No se pudieron cargar los clientes.", "error");
  } finally {
    setBusy(false);
  }
}

function renderClients() {
  els.pageInfo.textContent = `Pagina ${state.page} de ${state.totalPages}`;
  els.prevPageButton.disabled = state.page <= 1;
  els.nextPageButton.disabled = state.page >= state.totalPages;

  els.emptyState.hidden = state.clients.length > 0;
  els.clientsBody.innerHTML = state.clients.map(renderClientRow).join("");
}

function renderClientRow(client) {
  const email = client.correoElectronico || "Sin correo";
  const actionButton = client.activo
    ? `<button class="row-action danger" type="button" data-action="deactivate" data-id="${client.idCliente}" aria-label="Desactivar cliente">${icons.trash}</button>`
    : `<button class="row-action" type="button" data-action="restore" data-id="${client.idCliente}" aria-label="Reactivar cliente">${icons.undo}</button>`;

  return `
    <tr>
      <td>${escapeHtml(client.nombreCompleto)}</td>
      <td>${escapeHtml(client.telefono)}</td>
      <td>${escapeHtml(email)}</td>
      <td>
        <div class="row-actions">
          <button class="row-action" type="button" data-action="edit" data-id="${client.idCliente}" aria-label="Editar cliente">${icons.edit}</button>
          <button class="row-action view" type="button" data-action="view" data-id="${client.idCliente}" aria-label="Ver cliente">${icons.view}</button>
          ${actionButton}
        </div>
      </td>
    </tr>
  `;
}

function setBusy(isBusy) {
  els.saveButton.disabled = isBusy;
}

function openDrawer(mode, client = null) {
  state.editing = client;
  els.clientForm.reset();
  const isView = mode === "view";
  const isEdit = mode === "edit" || isView;
  els.drawerMode.textContent = isView ? "Consulta" : mode === "edit" ? "Edicion" : "Registro";
  els.drawerTitle.textContent = isView ? "Detalle del cliente" : mode === "edit" ? "Editar cliente" : "Nuevo cliente";
  els.fields.activeField.hidden = !isEdit;
  els.fields.idTipoCliente.disabled = isEdit;
  els.fields.tipoDocumento.disabled = isEdit;
  els.fields.numeroDocumento.disabled = isEdit;
  els.saveButton.hidden = isView;

  setFormReadOnly(isView);

  if (isEdit && client) {
    fillForm(client);
  } else {
    els.fields.clientId.value = "";
    els.fields.activo.checked = true;
  }

  els.drawerBackdrop.hidden = false;
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  els.fields.nombres.focus();
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  els.drawerBackdrop.hidden = true;
  state.editing = null;
  setFormReadOnly(false);
  els.saveButton.hidden = false;
}

function setFormReadOnly(isReadOnly) {
  [
    els.fields.nombres,
    els.fields.apellidos,
    els.fields.razonSocial,
    els.fields.telefono,
    els.fields.telefonoAlternativo,
    els.fields.correoElectronico,
    els.fields.activo,
  ].forEach((field) => {
    field.disabled = isReadOnly;
  });
}

function fillForm(client) {
  els.fields.clientId.value = client.idCliente;
  els.fields.idTipoCliente.value = client.idTipoCliente;
  els.fields.nombres.value = client.nombres ?? "";
  els.fields.apellidos.value = client.apellidos ?? "";
  els.fields.razonSocial.value = client.razonSocial ?? "";
  els.fields.tipoDocumento.value = client.tipoDocumento ?? "CED";
  els.fields.numeroDocumento.value = client.numeroDocumento ?? "";
  els.fields.telefono.value = client.telefono ?? "";
  els.fields.telefonoAlternativo.value = client.telefonoAlternativo ?? "";
  els.fields.correoElectronico.value = client.correoElectronico ?? "";
  els.fields.activo.checked = Boolean(client.activo);
}

function readCreatePayload() {
  return {
    idTipoCliente: Number(els.fields.idTipoCliente.value),
    nombres: els.fields.nombres.value.trim(),
    apellidos: els.fields.apellidos.value.trim(),
    razonSocial: valueOrNull(els.fields.razonSocial.value),
    tipoDocumento: els.fields.tipoDocumento.value,
    numeroDocumento: els.fields.numeroDocumento.value.trim(),
    telefono: els.fields.telefono.value.trim(),
    telefonoAlternativo: valueOrNull(els.fields.telefonoAlternativo.value),
    correoElectronico: valueOrNull(els.fields.correoElectronico.value),
  };
}

function readUpdatePayload() {
  return {
    nombres: els.fields.nombres.value.trim(),
    apellidos: els.fields.apellidos.value.trim(),
    razonSocial: valueOrNull(els.fields.razonSocial.value),
    telefono: els.fields.telefono.value.trim(),
    telefonoAlternativo: valueOrNull(els.fields.telefonoAlternativo.value),
    correoElectronico: valueOrNull(els.fields.correoElectronico.value),
    activo: els.fields.activo.checked,
  };
}

function valueOrNull(value) {
  const normalized = value.trim();
  return normalized.length ? normalized : null;
}

async function saveClient(event) {
  event.preventDefault();
  setBusy(true);

  try {
    const id = Number(els.fields.clientId.value);
    if (id) {
      await api(`/api/clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(readUpdatePayload()),
      });
      showToast("Cliente actualizado.", "success");
    } else {
      const created = await api("/api/clientes", {
        method: "POST",
        body: JSON.stringify(readCreatePayload()),
      });
      state.page = 1;
      showToast(`Cliente ${created.idCliente} creado.`, "success");
    }

    closeDrawer();
    await loadClients();
  } catch (error) {
    showToast(error.message || "No se pudo guardar el cliente.", "error");
  } finally {
    setBusy(false);
  }
}

async function editClient(id) {
  setBusy(true);
  try {
    const client = await api(`/api/clientes/${id}`);
    openDrawer("edit", client);
  } catch (error) {
    showToast(error.message || "No se pudo abrir el cliente.", "error");
  } finally {
    setBusy(false);
  }
}

async function viewClient(id) {
  setBusy(true);
  try {
    const client = await api(`/api/clientes/${id}`);
    openDrawer("view", client);
  } catch (error) {
    showToast(error.message || "No se pudo abrir el cliente.", "error");
  } finally {
    setBusy(false);
  }
}

async function deactivateClient(id) {
  const client = state.clients.find((item) => item.idCliente === id);
  const name = client?.nombreCompleto ?? `ID ${id}`;
  if (!window.confirm(`Desactivar cliente ${name}?`)) {
    return;
  }

  setBusy(true);
  try {
    await api(`/api/clientes/${id}/desactivar`, { method: "PATCH" });
    showToast("Cliente desactivado.", "success");
    await loadClients();
  } catch (error) {
    showToast(error.message || "No se pudo desactivar el cliente.", "error");
  } finally {
    setBusy(false);
  }
}

async function restoreClient(id) {
  setBusy(true);
  try {
    const client = await api(`/api/clientes/${id}`);
    await api(`/api/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombres: client.nombres,
        apellidos: client.apellidos,
        razonSocial: client.razonSocial,
        telefono: client.telefono,
        telefonoAlternativo: client.telefonoAlternativo,
        correoElectronico: client.correoElectronico,
        activo: true,
      }),
    });
    showToast("Cliente reactivado.", "success");
    await loadClients();
  } catch (error) {
    showToast(error.message || "No se pudo reactivar el cliente.", "error");
  } finally {
    setBusy(false);
  }
}

function showToast(message, type = "success") {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.className = `toast ${type}`;
  els.toast.hidden = false;
  state.toastTimer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 3600);
}

els.newClientButton.addEventListener("click", () => openDrawer("create"));
els.closeDrawerButton.addEventListener("click", closeDrawer);
els.cancelButton.addEventListener("click", closeDrawer);
els.drawerBackdrop.addEventListener("click", closeDrawer);
els.clientForm.addEventListener("submit", saveClient);

els.searchInput.addEventListener("input", debounce((event) => {
  state.search = event.target.value.trim();
  state.page = 1;
  loadClients();
}, 300));

els.prevPageButton.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadClients();
  }
});

els.nextPageButton.addEventListener("click", () => {
  if (state.page < state.totalPages) {
    state.page += 1;
    loadClients();
  }
});

els.clientsBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    editClient(id);
  }

  if (action === "view") {
    viewClient(id);
  }

  if (action === "deactivate") {
    deactivateClient(id);
  }

  if (action === "restore") {
    restoreClient(id);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.drawer.classList.contains("open")) {
    closeDrawer();
  }
});

loadCatalogs();
loadClients();
