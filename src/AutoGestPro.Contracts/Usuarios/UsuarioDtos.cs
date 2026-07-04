namespace AutoGestPro.Contracts.Usuarios;

public sealed record UsuarioListItemDto(
    int IdUsuario,
    string NombreCompleto,
    string NombreUsuario,
    string CorreoElectronico,
    string Rol,
    bool Activo);

public sealed record CreateUsuarioRequest(
    int IdRol,
    string Nombres,
    string Apellidos,
    string NombreUsuario,
    string CorreoElectronico,
    string? Telefono,
    string Password,
    int? IdUsuarioCreacion);
