namespace AutoGestPro.Api.Services;

public interface IAuthTokenService
{
    (string Token, DateTime FechaExpiracion) CreateSessionToken();
}
