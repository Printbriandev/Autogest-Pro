using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Seg;
using AutoGestPro.Api.Services;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Usuarios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public sealed class UsuariosController(
    AutoGestProDbContext db,
    IPasswordHasher passwordHasher) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<UsuarioListItemDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query =
            from usuario in db.Usuarios.AsNoTracking()
            join rol in db.Roles.AsNoTracking() on usuario.IdRol equals rol.IdRol
            select new { usuario, rol };

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.usuario.Nombres.Contains(search) ||
                x.usuario.Apellidos.Contains(search) ||
                x.usuario.NombreUsuario.Contains(search) ||
                x.usuario.CorreoElectronico.Contains(search));
        }

        var result = await query
            .OrderBy(x => x.usuario.Nombres)
            .Select(x => new UsuarioListItemDto(
                x.usuario.IdUsuario,
                (x.usuario.Nombres + " " + x.usuario.Apellidos).Trim(),
                x.usuario.NombreUsuario,
                x.usuario.CorreoElectronico,
                x.rol.Nombre,
                x.usuario.Activo))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<UsuarioListItemDto>>.Ok(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UsuarioListItemDto>>> Create(
        CreateUsuarioRequest request,
        CancellationToken cancellationToken)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        var usuario = new Usuario
        {
            IdRol = request.IdRol,
            Nombres = request.Nombres,
            Apellidos = request.Apellidos,
            NombreUsuario = request.NombreUsuario,
            CorreoElectronico = request.CorreoElectronico,
            Telefono = request.Telefono,
            Activo = true,
            FechaCreacion = DateTime.Now,
            IdUsuarioCreacion = request.IdUsuarioCreacion
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync(cancellationToken);

        db.Credenciales.Add(new Credencial
        {
            IdUsuario = usuario.IdUsuario,
            PasswordHash = passwordHasher.Hash(request.Password),
            FechaUltimoCambio = DateTime.Now,
            DebeCambiarPassword = true
        });

        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        var rol = await db.Roles.AsNoTracking()
            .FirstAsync(x => x.IdRol == usuario.IdRol, cancellationToken);

        var response = new UsuarioListItemDto(
            usuario.IdUsuario,
            $"{usuario.Nombres} {usuario.Apellidos}".Trim(),
            usuario.NombreUsuario,
            usuario.CorreoElectronico,
            rol.Nombre,
            usuario.Activo);

        return CreatedAtAction(nameof(GetAll), new { search = usuario.NombreUsuario }, ApiResponse<UsuarioListItemDto>.Ok(response));
    }
}
