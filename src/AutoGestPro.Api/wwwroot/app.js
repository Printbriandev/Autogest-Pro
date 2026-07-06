const SESSION_KEY = "autogest.session";
const REMEMBER_KEY = "autogest.rememberedUser";

const state = {
  session: readSession(),
  currentRoute: "dashboard",
  page: 1,
  pageSize: 10,
  search: "",
  totalItems: 0,
  totalPages: 1,
  clients: [],
  tiposCliente: [],
  clientsLoaded: false,
  dashboardLoaded: false,
  editing: null,
  toastTimer: null,
};

const els = {
  loginView: document.querySelector("#loginView"),
  appView: document.querySelector("#appView"),
  loginForm: document.querySelector("#loginForm"),
  nombreUsuario: document.querySelector("#nombreUsuario"),
  password: document.querySelector("#password"),
  rememberMe: document.querySelector("#rememberMe"),
  togglePasswordButton: document.querySelector("#togglePasswordButton"),
  loginButton: document.querySelector("#loginButton"),
  loginError: document.querySelector("#loginError"),
  navButtons: document.querySelectorAll("[data-route]"),
  logoutButton: document.querySelector("#logoutButton"),
  userName: document.querySelector("#userName"),
  userRole: document.querySelector("#userRole"),
  dashboardSection: document.querySelector("#dashboardSection"),
  dashboardGrid: document.querySelector("#dashboardGrid"),
  dashboardRefreshButton: document.querySelector("#dashboardRefreshButton"),
  clientsSection: document.querySelector("#clientsSection"),
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

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveSession(session) {
  state.session = session;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  state.session = null;
  window.localStorage.removeItem(SESSION_KEY);
}

function sessionToken() {
  return state.session?.token ?? state.session?.Token ?? "";
}

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

function pick(source, camelName, pascalName, fallback = 0) {
  return source?.[camelName] ?? source?.[pascalName] ?? fallback;
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(sessionToken() ? { Authorization: `Bearer ${sessionToken()}` } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(path, {
    ...options,
    headers,
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

  if (response.status === 401 && !path.includes("/api/auth/login")) {
    clearSession();
    showLogin();
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

function showLogin() {
  els.loginView.hidden = false;
  els.appView.hidden = true;
  els.loginError.hidden = true;
  els.nombreUsuario.value = "";
  els.rememberMe.checked = false;
  els.password.value = "";
  els.password.type = "password";
  els.togglePasswordButton.setAttribute("aria-label", "Mostrar contrasena");
  window.setTimeout(() => els.nombreUsuario.focus(), 0);
}

function showApp() {
  els.loginView.hidden = true;
  els.appView.hidden = false;
  els.userName.textContent = pick(state.session, "nombreCompleto", "NombreCompleto", "Usuario");
  els.userRole.textContent = pick(state.session, "rol", "Rol", "Sin rol");
  navigateTo(state.currentRoute || "dashboard");
}

async function handleLogin(event) {
  event.preventDefault();
  els.loginButton.disabled = true;
  els.loginError.hidden = true;

  try {
    const session = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        nombreUsuario: els.nombreUsuario.value.trim(),
        password: els.password.value,
      }),
    });

    saveSession(session);
    window.localStorage.removeItem(REMEMBER_KEY);
    state.currentRoute = "dashboard";
    showApp();
    showToast("Sesion iniciada.", "success");
  } catch (error) {
    els.loginError.textContent = error.message || "No se pudo iniciar sesion.";
    els.loginError.hidden = false;
  } finally {
    els.loginButton.disabled = false;
  }
}

function handleLogout() {
  clearSession();
  state.clientsLoaded = false;
  state.dashboardLoaded = false;
  closeDrawer();
  showLogin();
}

function togglePasswordVisibility() {
  const isPassword = els.password.type === "password";
  els.password.type = isPassword ? "text" : "password";
  els.togglePasswordButton.setAttribute("aria-label", isPassword ? "Ocultar contrasena" : "Mostrar contrasena");
  els.password.focus();
}

function navigateTo(route) {
  state.currentRoute = route;

  els.dashboardSection.hidden = route !== "dashboard";
  els.clientsSection.hidden = route !== "clientes";

  els.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.route === route);
  });

  if (route === "dashboard") {
    loadDashboard();
  }

  if (route === "clientes") {
    prepareClients();
  }
}

async function loadDashboard(force = false) {
  if (state.dashboardLoaded && !force) {
    return;
  }

  renderDashboardLoading();
  els.dashboardRefreshButton.disabled = true;

  try {
    const summary = await api("/api/reportes/dashboard");
    state.dashboardLoaded = true;
    renderDashboard(summary);
  } catch (error) {
    state.dashboardLoaded = false;
    els.dashboardGrid.innerHTML = `
      <article class="metric-card red">
        <p>Dashboard</p>
        <strong>Error</strong>
        <span></span>
      </article>
    `;
    showToast(error.message || "No se pudo cargar el dashboard.", "error");
  } finally {
    els.dashboardRefreshButton.disabled = false;
  }
}

function renderDashboardLoading() {
  els.dashboardGrid.innerHTML = ["Clientes activos", "Vehiculos activos", "Citas pendientes", "Ordenes abiertas", "Balance pendiente", "Repuestos bajo stock"]
    .map((label) => `
      <article class="metric-card">
        <p>${label}</p>
        <strong>...</strong>
        <span></span>
      </article>
    `)
    .join("");
}

function renderDashboard(summary) {
  const money = new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  });

  const number = new Intl.NumberFormat("es-DO");
  const metrics = [
    ["Clientes activos", number.format(pick(summary, "clientesActivos", "ClientesActivos")), ""],
    ["Vehiculos activos", number.format(pick(summary, "vehiculosActivos", "VehiculosActivos")), "teal"],
    ["Citas pendientes", number.format(pick(summary, "citasPendientes", "CitasPendientes")), "amber"],
    ["Ordenes abiertas", number.format(pick(summary, "ordenesAbiertas", "OrdenesAbiertas")), "green"],
    ["Balance pendiente", money.format(pick(summary, "facturasPendientes", "FacturasPendientes")), "red"],
    ["Repuestos bajo stock", number.format(pick(summary, "repuestosBajoStock", "RepuestosBajoStock")), "amber"],
  ];

  els.dashboardGrid.innerHTML = metrics
    .map(([label, value, tone]) => `
      <article class="metric-card ${tone}">
        <p>${escapeHtml(label)}</p>
        <strong>${escapeHtml(value)}</strong>
        <span></span>
      </article>
    `)
    .join("");
}

async function prepareClients() {
  if (state.clientsLoaded) {
    return;
  }

  await loadCatalogs();
  await loadClients();
  state.clientsLoaded = true;
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
        const id = item.id ?? item.idTipoCliente ?? item.IdTipoCliente;
        const name = item.nombre ?? item.descripcion ?? item.Description ?? `Tipo ${id}`;
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
    state.clients = result.items ?? result.Items ?? [];
    state.totalItems = result.totalItems ?? result.TotalItems ?? 0;
    state.totalPages = Math.max(result.totalPages ?? result.TotalPages ?? 1, 1);

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
  const id = client.idCliente ?? client.IdCliente;
  const name = client.nombreCompleto ?? client.NombreCompleto ?? "Sin nombre";
  const phone = client.telefono ?? client.Telefono ?? "Sin telefono";
  const email = client.correoElectronico ?? client.CorreoElectronico ?? "Sin correo";
  const active = client.activo ?? client.Activo ?? true;
  const actionButton = active
    ? `<button class="row-action danger" type="button" data-action="deactivate" data-id="${id}" aria-label="Desactivar cliente">${icons.trash}</button>`
    : `<button class="row-action" type="button" data-action="restore" data-id="${id}" aria-label="Reactivar cliente">${icons.undo}</button>`;

  return `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td>${escapeHtml(phone)}</td>
      <td>${escapeHtml(email)}</td>
      <td>
        <div class="row-actions">
          <button class="row-action" type="button" data-action="edit" data-id="${id}" aria-label="Editar cliente">${icons.edit}</button>
          <button class="row-action view" type="button" data-action="view" data-id="${id}" aria-label="Ver cliente">${icons.view}</button>
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
  els.fields.clientId.value = client.idCliente ?? client.IdCliente;
  els.fields.idTipoCliente.value = client.idTipoCliente ?? client.IdTipoCliente;
  els.fields.nombres.value = client.nombres ?? client.Nombres ?? "";
  els.fields.apellidos.value = client.apellidos ?? client.Apellidos ?? "";
  els.fields.razonSocial.value = client.razonSocial ?? client.RazonSocial ?? "";
  els.fields.tipoDocumento.value = client.tipoDocumento ?? client.TipoDocumento ?? "CED";
  els.fields.numeroDocumento.value = client.numeroDocumento ?? client.NumeroDocumento ?? "";
  els.fields.telefono.value = client.telefono ?? client.Telefono ?? "";
  els.fields.telefonoAlternativo.value = client.telefonoAlternativo ?? client.TelefonoAlternativo ?? "";
  els.fields.correoElectronico.value = client.correoElectronico ?? client.CorreoElectronico ?? "";
  els.fields.activo.checked = Boolean(client.activo ?? client.Activo);
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
      state.dashboardLoaded = false;
      showToast(`Cliente ${created.idCliente ?? created.IdCliente} creado.`, "success");
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
  const client = state.clients.find((item) => (item.idCliente ?? item.IdCliente) === id);
  const name = client?.nombreCompleto ?? client?.NombreCompleto ?? `ID ${id}`;
  if (!window.confirm(`Desactivar cliente ${name}?`)) {
    return;
  }

  setBusy(true);
  try {
    await api(`/api/clientes/${id}/desactivar`, { method: "PATCH" });
    state.dashboardLoaded = false;
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
        nombres: client.nombres ?? client.Nombres,
        apellidos: client.apellidos ?? client.Apellidos,
        razonSocial: client.razonSocial ?? client.RazonSocial,
        telefono: client.telefono ?? client.Telefono,
        telefonoAlternativo: client.telefonoAlternativo ?? client.TelefonoAlternativo,
        correoElectronico: client.correoElectronico ?? client.CorreoElectronico,
        activo: true,
      }),
    });
    state.dashboardLoaded = false;
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

els.loginForm.addEventListener("submit", handleLogin);
els.togglePasswordButton.addEventListener("click", togglePasswordVisibility);
els.logoutButton.addEventListener("click", handleLogout);
els.dashboardRefreshButton.addEventListener("click", () => loadDashboard(true));
els.navButtons.forEach((button) => {
  button.addEventListener("click", () => navigateTo(button.dataset.route));
});

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

if (sessionToken()) {
  showApp();
} else {
  showLogin();
}
