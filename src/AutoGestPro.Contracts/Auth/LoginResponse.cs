namespace AutoGestPro.Contracts.Auth;

public sealed record LoginResponse(
    int IdUsuario,
    string NombreCompleto,
    string Rol,
    string Token,
    DateTime FechaExpiracion);
