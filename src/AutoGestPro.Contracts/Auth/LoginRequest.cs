namespace AutoGestPro.Contracts.Auth;

public sealed record LoginRequest(
    string NombreUsuario,
    string Password);
