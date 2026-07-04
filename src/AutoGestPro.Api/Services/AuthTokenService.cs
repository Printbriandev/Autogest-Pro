namespace AutoGestPro.Api.Services;

public sealed class AuthTokenService : IAuthTokenService
{
    public (string Token, DateTime FechaExpiracion) CreateSessionToken()
    {
        var expiration = DateTime.UtcNow.AddHours(8);
        return (Guid.NewGuid().ToString("N"), expiration);
    }
}
