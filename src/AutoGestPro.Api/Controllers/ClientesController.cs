using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Clientes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/clientes")]
public sealed class ClientesController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ClienteListItemDto>>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = db.Clientes.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                x.Nombres.Contains(search) ||
                x.Apellidos.Contains(search) ||
                x.NumeroDocumento.Contains(search) ||
                (x.CorreoElectronico != null && x.CorreoElectronico.Contains(search)));
        }

        var result = await query
            .OrderByDescending(x => x.FechaCreacion)
            .Select(x => new ClienteListItemDto(
                x.IdCliente,
                (x.Nombres + " " + x.Apellidos).Trim(),
                x.TipoDocumento,
                x.NumeroDocumento,
                x.Telefono,
                x.CorreoElectronico,
                x.Activo))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<ClienteListItemDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ClienteDetailDto>>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var cliente = await db.Clientes
            .AsNoTracking()
            .Where(x => x.IdCliente == id)
            .Select(x => new ClienteDetailDto(
                x.IdCliente,
                x.IdTipoCliente,
                x.Nombres,
                x.Apellidos,
                x.RazonSocial,
                x.TipoDocumento,
                x.NumeroDocumento,
                x.Telefono,
                x.TelefonoAlternativo,
                x.CorreoElectronico,
                x.Activo,
                x.FechaCreacion))
            .FirstOrDefaultAsync(cancellationToken);

        return cliente is null
            ? NotFound(ApiResponse<ClienteDetailDto>.Fail("Cliente no encontrado."))
            : Ok(ApiResponse<ClienteDetailDto>.Ok(cliente));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ClienteDetailDto>>> Create(
        CreateClienteRequest request,
        CancellationToken cancellationToken)
    {
        var tipoClienteExiste = await db.TiposCliente
            .AsNoTracking()
            .AnyAsync(x => x.IdTipoCliente == request.IdTipoCliente && x.Activo, cancellationToken);

        if (!tipoClienteExiste)
        {
            return BadRequest(ApiResponse<ClienteDetailDto>.Fail(
                $"El tipo de cliente {request.IdTipoCliente} no existe. Ejecuta database/patches/002_seed_catalogos_minimos.sql o usa un IdTipoCliente valido."));
        }

        var cliente = new Cliente
        {
            IdTipoCliente = request.IdTipoCliente,
            Nombres = request.Nombres,
            Apellidos = request.Apellidos,
            RazonSocial = request.RazonSocial,
            TipoDocumento = request.TipoDocumento,
            NumeroDocumento = request.NumeroDocumento,
            Telefono = request.Telefono,
            TelefonoAlternativo = request.TelefonoAlternativo,
            CorreoElectronico = request.CorreoElectronico,
            Activo = true,
            FechaCreacion = DateTime.Now
        };

        db.Clientes.Add(cliente);
        await db.SaveChangesAsync(cancellationToken);

        var response = new ClienteDetailDto(
            cliente.IdCliente,
            cliente.IdTipoCliente,
            cliente.Nombres,
            cliente.Apellidos,
            cliente.RazonSocial,
            cliente.TipoDocumento,
            cliente.NumeroDocumento,
            cliente.Telefono,
            cliente.TelefonoAlternativo,
            cliente.CorreoElectronico,
            cliente.Activo,
            cliente.FechaCreacion);

        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, ApiResponse<ClienteDetailDto>.Ok(response));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ClienteDetailDto>>> Update(
        int id,
        UpdateClienteRequest request,
        CancellationToken cancellationToken)
    {
        var cliente = await db.Clientes.FirstOrDefaultAsync(x => x.IdCliente == id, cancellationToken);

        if (cliente is null)
        {
            return NotFound(ApiResponse<ClienteDetailDto>.Fail("Cliente no encontrado."));
        }

        cliente.Nombres = request.Nombres;
        cliente.Apellidos = request.Apellidos;
        cliente.RazonSocial = request.RazonSocial;
        cliente.Telefono = request.Telefono;
        cliente.TelefonoAlternativo = request.TelefonoAlternativo;
        cliente.CorreoElectronico = request.CorreoElectronico;
        cliente.Activo = request.Activo;
        cliente.FechaModificacion = DateTime.Now;

        await db.SaveChangesAsync(cancellationToken);

        var response = new ClienteDetailDto(
            cliente.IdCliente,
            cliente.IdTipoCliente,
            cliente.Nombres,
            cliente.Apellidos,
            cliente.RazonSocial,
            cliente.TipoDocumento,
            cliente.NumeroDocumento,
            cliente.Telefono,
            cliente.TelefonoAlternativo,
            cliente.CorreoElectronico,
            cliente.Activo,
            cliente.FechaCreacion);

        return Ok(ApiResponse<ClienteDetailDto>.Ok(response, "Cliente actualizado."));
    }

    [HttpPatch("{id:int}/desactivar")]
    public async Task<ActionResult<ApiResponse<object>>> Deactivate(
        int id,
        CancellationToken cancellationToken)
    {
        var cliente = await db.Clientes.FirstOrDefaultAsync(x => x.IdCliente == id, cancellationToken);

        if (cliente is null)
        {
            return NotFound(ApiResponse<object>.Fail("Cliente no encontrado."));
        }

        cliente.Activo = false;
        cliente.FechaModificacion = DateTime.Now;
        await db.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { cliente.IdCliente, cliente.Activo }, "Cliente desactivado."));
    }
}
