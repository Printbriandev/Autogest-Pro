using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Ordenes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/ordenes-servicio")]
public sealed class OrdenesServicioController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<OrdenServicioListItemDto>>>> GetAll(
        [FromQuery] int? idEstadoOrden,
        [FromQuery] string? numeroOrden,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query =
            from orden in db.OrdenesServicio.AsNoTracking()
            join cliente in db.Clientes.AsNoTracking() on orden.IdCliente equals cliente.IdCliente
            join estado in db.EstadosOrden.AsNoTracking() on orden.IdEstadoOrden equals estado.IdEstadoOrden
            select new { orden, cliente, estado };

        if (idEstadoOrden.HasValue)
        {
            query = query.Where(x => x.orden.IdEstadoOrden == idEstadoOrden.Value);
        }

        if (!string.IsNullOrWhiteSpace(numeroOrden))
        {
            query = query.Where(x => x.orden.NumeroOrden.Contains(numeroOrden));
        }

        var result = await query
            .OrderByDescending(x => x.orden.FechaIngreso)
            .Select(x => new OrdenServicioListItemDto(
                x.orden.IdOrdenServicio,
                x.orden.NumeroOrden,
                x.orden.IdCliente,
                x.orden.IdVehiculo,
                (x.cliente.Nombres + " " + x.cliente.Apellidos).Trim(),
                x.estado.Nombre,
                x.orden.FechaIngreso,
                x.orden.FechaPrometida,
                x.orden.Total))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<OrdenServicioListItemDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<OrdenServicioDetailDto>>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var orden = await db.OrdenesServicio
            .AsNoTracking()
            .Where(x => x.IdOrdenServicio == id)
            .Select(x => new OrdenServicioDetailDto(
                x.IdOrdenServicio,
                x.NumeroOrden,
                x.IdCliente,
                x.IdVehiculo,
                x.IdCita,
                x.IdEstadoOrden,
                x.IdUsuarioAsesor,
                x.IdUsuarioMecanico,
                x.KilometrajeEntrada,
                x.KilometrajeSalida,
                x.FechaIngreso,
                x.FechaPrometida,
                x.FechaEntrega,
                x.SintomasReportados,
                x.DiagnosticoTecnico,
                x.TrabajoRealizado,
                x.SubTotal,
                x.MontoImpuesto,
                x.Total))
            .FirstOrDefaultAsync(cancellationToken);

        return orden is null
            ? NotFound(ApiResponse<OrdenServicioDetailDto>.Fail("Orden de servicio no encontrada."))
            : Ok(ApiResponse<OrdenServicioDetailDto>.Ok(orden));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrdenServicioDetailDto>>> Create(
        CreateOrdenServicioRequest request,
        CancellationToken cancellationToken)
    {
        var orden = new OrdenServicio
        {
            NumeroOrden = request.NumeroOrden,
            IdCliente = request.IdCliente,
            IdVehiculo = request.IdVehiculo,
            IdCita = request.IdCita,
            IdEstadoOrden = request.IdEstadoOrden,
            IdUsuarioAsesor = request.IdUsuarioAsesor,
            IdUsuarioMecanico = request.IdUsuarioMecanico,
            KilometrajeEntrada = request.KilometrajeEntrada,
            FechaIngreso = request.FechaIngreso,
            FechaPrometida = request.FechaPrometida,
            SintomasReportados = request.SintomasReportados,
            Observaciones = request.Observaciones,
            FechaCreacion = DateTime.Now,
            IdUsuarioCreacion = request.IdUsuarioCreacion
        };

        db.OrdenesServicio.Add(orden);
        await db.SaveChangesAsync(cancellationToken);

        var response = new OrdenServicioDetailDto(
            orden.IdOrdenServicio,
            orden.NumeroOrden,
            orden.IdCliente,
            orden.IdVehiculo,
            orden.IdCita,
            orden.IdEstadoOrden,
            orden.IdUsuarioAsesor,
            orden.IdUsuarioMecanico,
            orden.KilometrajeEntrada,
            orden.KilometrajeSalida,
            orden.FechaIngreso,
            orden.FechaPrometida,
            orden.FechaEntrega,
            orden.SintomasReportados,
            orden.DiagnosticoTecnico,
            orden.TrabajoRealizado,
            orden.SubTotal,
            orden.MontoImpuesto,
            orden.Total);

        return CreatedAtAction(nameof(GetById), new { id = orden.IdOrdenServicio }, ApiResponse<OrdenServicioDetailDto>.Ok(response));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<OrdenServicioDetailDto>>> Update(
        int id,
        UpdateOrdenServicioRequest request,
        CancellationToken cancellationToken)
    {
        var orden = await db.OrdenesServicio.FirstOrDefaultAsync(x => x.IdOrdenServicio == id, cancellationToken);

        if (orden is null)
        {
            return NotFound(ApiResponse<OrdenServicioDetailDto>.Fail("Orden de servicio no encontrada."));
        }

        orden.IdEstadoOrden = request.IdEstadoOrden;
        orden.IdUsuarioMecanico = request.IdUsuarioMecanico;
        orden.KilometrajeEntrada = request.KilometrajeEntrada;
        orden.KilometrajeSalida = request.KilometrajeSalida;
        orden.FechaIngreso = request.FechaIngreso;
        orden.FechaPrometida = request.FechaPrometida;
        orden.FechaEntrega = request.FechaEntrega;
        orden.SintomasReportados = request.SintomasReportados;
        orden.DiagnosticoTecnico = request.DiagnosticoTecnico;
        orden.TrabajoRealizado = request.TrabajoRealizado;
        orden.Observaciones = request.Observaciones;
        orden.SubTotal = request.SubTotal;
        orden.MontoDescuento = request.MontoDescuento;
        orden.MontoImpuesto = request.MontoImpuesto;
        orden.Total = request.Total;
        orden.FechaModificacion = DateTime.Now;

        await db.SaveChangesAsync(cancellationToken);

        var response = new OrdenServicioDetailDto(
            orden.IdOrdenServicio,
            orden.NumeroOrden,
            orden.IdCliente,
            orden.IdVehiculo,
            orden.IdCita,
            orden.IdEstadoOrden,
            orden.IdUsuarioAsesor,
            orden.IdUsuarioMecanico,
            orden.KilometrajeEntrada,
            orden.KilometrajeSalida,
            orden.FechaIngreso,
            orden.FechaPrometida,
            orden.FechaEntrega,
            orden.SintomasReportados,
            orden.DiagnosticoTecnico,
            orden.TrabajoRealizado,
            orden.SubTotal,
            orden.MontoImpuesto,
            orden.Total);

        return Ok(ApiResponse<OrdenServicioDetailDto>.Ok(response, "Orden de servicio actualizada."));
    }

    [HttpPatch("{id:int}/estado/{idEstadoOrden:int}")]
    public async Task<ActionResult<ApiResponse<object>>> CambiarEstado(
        int id,
        int idEstadoOrden,
        CancellationToken cancellationToken)
    {
        var orden = await db.OrdenesServicio.FirstOrDefaultAsync(x => x.IdOrdenServicio == id, cancellationToken);

        if (orden is null)
        {
            return NotFound(ApiResponse<object>.Fail("Orden de servicio no encontrada."));
        }

        var estado = await db.EstadosOrden
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdEstadoOrden == idEstadoOrden, cancellationToken);

        if (estado is null)
        {
            return BadRequest(ApiResponse<object>.Fail("Estado de orden invalido."));
        }

        orden.IdEstadoOrden = idEstadoOrden;
        orden.FechaModificacion = DateTime.Now;

        if (estado.Nombre.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
        {
            orden.FechaEntrega ??= DateTime.Now;
        }

        await db.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(new
        {
            orden.IdOrdenServicio,
            orden.IdEstadoOrden,
            Estado = estado.Nombre
        }, "Estado de orden actualizado."));
    }
}
