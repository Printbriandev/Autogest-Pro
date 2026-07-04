namespace AutoGestPro.Contracts.Clientes;

public sealed record ClienteListItemDto(
    int IdCliente,
    string NombreCompleto,
    string TipoDocumento,
    string NumeroDocumento,
    string Telefono,
    string? CorreoElectronico,
    bool Activo);

public sealed record ClienteDetailDto(
    int IdCliente,
    int IdTipoCliente,
    string Nombres,
    string Apellidos,
    string? RazonSocial,
    string TipoDocumento,
    string NumeroDocumento,
    string Telefono,
    string? TelefonoAlternativo,
    string? CorreoElectronico,
    bool Activo,
    DateTime FechaCreacion);

public sealed record CreateClienteRequest(
    int IdTipoCliente,
    string Nombres,
    string Apellidos,
    string? RazonSocial,
    string TipoDocumento,
    string NumeroDocumento,
    string Telefono,
    string? TelefonoAlternativo,
    string? CorreoElectronico);

public sealed record UpdateClienteRequest(
    string Nombres,
    string Apellidos,
    string? RazonSocial,
    string Telefono,
    string? TelefonoAlternativo,
    string? CorreoElectronico,
    bool Activo);
