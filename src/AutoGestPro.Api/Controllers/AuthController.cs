using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Seg;
using AutoGestPro.Api.Services;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    AutoGestProDbContext db,
    IPasswordHasher passwordHasher,
    IAuthTokenService authTokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var usuario = await db.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.NombreUsuario == request.NombreUsuario && x.Activo, cancellationToken);

        if (usuario is null)
        {
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Usuario o password invalido."));
        }

        var credencial = await db.Credenciales
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdUsuario == usuario.IdUsuario, cancellationToken);

        if (credencial is null || !passwordHasher.Verify(request.Password, credencial.PasswordHash))
        {
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Usuario o password invalido."));
        }

        var rol = await db.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdRol == usuario.IdRol, cancellationToken);

        var (token, fechaExpiracion) = authTokenService.CreateSessionToken();
        db.SesionesUsuario.Add(new SesionUsuario
        {
            IdUsuario = usuario.IdUsuario,
            Token = Guid.Parse(token),
            DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            UserAgent = Request.Headers["User-Agent"].ToString(),
            FechaInicio = DateTime.Now,
            FechaExpiracion = fechaExpiracion,
            Activa = true
        });

        await db.SaveChangesAsync(cancellationToken);

        var response = new LoginResponse(
            usuario.IdUsuario,
            $"{usuario.Nombres} {usuario.Apellidos}".Trim(),
            rol?.Nombre ?? "Sin rol",
            token,
            fechaExpiracion);

        return Ok(ApiResponse<LoginResponse>.Ok(response));
    }
}
