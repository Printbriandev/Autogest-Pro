using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Citas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/citas")]
public sealed class CitasController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<CitaListItemDto>>>> GetAll(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        [FromQuery] int? idEstadoCita,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query =
            from cita in db.Citas.AsNoTracking()
            join cliente in db.Clientes.AsNoTracking() on cita.IdCliente equals cliente.IdCliente
            join estado in db.EstadosCita.AsNoTracking() on cita.IdEstadoCita equals estado.IdEstadoCita
            join tipo in db.TiposCita.AsNoTracking() on cita.IdTipoCita equals tipo.IdTipoCita
            select new { cita, cliente, estado, tipo };

        if (desde.HasValue)
        {
            query = query.Where(x => x.cita.FechaHoraCita >= desde.Value);
        }

        if (hasta.HasValue)
        {
            query = query.Where(x => x.cita.FechaHoraCita <= hasta.Value);
        }

        if (idEstadoCita.HasValue)
        {
            query = query.Where(x => x.cita.IdEstadoCita == idEstadoCita.Value);
        }

        var result = await query
            .OrderBy(x => x.cita.FechaHoraCita)
            .Select(x => new CitaListItemDto(
                x.cita.IdCita,
                x.cita.IdCliente,
                x.cita.IdVehiculo,
                (x.cliente.Nombres + " " + x.cliente.Apellidos).Trim(),
                x.estado.Nombre,
                x.tipo.Nombre,
                x.cita.FechaHoraCita,
                x.cita.MotivoConsulta))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<CitaListItemDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<CitaDetailDto>>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var cita = await db.Citas
            .AsNoTracking()
            .Where(x => x.IdCita == id)
            .Select(x => new CitaDetailDto(
                x.IdCita,
                x.IdCliente,
                x.IdVehiculo,
                x.IdEstadoCita,
                x.IdTipoCita,
                x.IdUsuarioAsignado,
                x.FechaHoraCita,
                x.DuracionEstimadaMin,
                x.MotivoConsulta,
                x.Observaciones,
                x.FechaCreacion))
            .FirstOrDefaultAsync(cancellationToken);

        return cita is null
            ? NotFound(ApiResponse<CitaDetailDto>.Fail("Cita no encontrada."))
            : Ok(ApiResponse<CitaDetailDto>.Ok(cita));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CitaDetailDto>>> Create(
        CreateCitaRequest request,
        CancellationToken cancellationToken)
    {
        if (!request.IdVehiculo.HasValue)
        {
            return BadRequest(ApiResponse<CitaDetailDto>.Fail("La nueva base requiere un vehiculo para crear una cita."));
        }

        var vehiculoExiste = await db.Vehiculos
            .AsNoTracking()
            .AnyAsync(x => x.IdVehiculo == request.IdVehiculo.Value && x.IdCliente == request.IdCliente && x.Activo, cancellationToken);

        if (!vehiculoExiste)
        {
            return BadRequest(ApiResponse<CitaDetailDto>.Fail("El vehiculo no existe, no esta activo o no pertenece al cliente indicado."));
        }

        var cita = new Cita
        {
            IdCliente = request.IdCliente,
            IdVehiculo = request.IdVehiculo,
            IdEstadoCita = request.IdEstadoCita,
            IdTipoCita = request.IdTipoCita,
            IdUsuarioAsignado = request.IdUsuarioAsignado,
            FechaHoraCita = request.FechaHoraCita,
            DuracionEstimadaMin = request.DuracionEstimadaMin,
            MotivoConsulta = request.MotivoConsulta,
            Observaciones = request.Observaciones,
            IdUsuarioCreacion = request.IdUsuarioCreacion,
            FechaCreacion = DateTime.Now
        };

        db.Citas.Add(cita);
        await db.SaveChangesAsync(cancellationToken);

        var response = new CitaDetailDto(
            cita.IdCita,
            cita.IdCliente,
            cita.IdVehiculo,
            cita.IdEstadoCita,
            cita.IdTipoCita,
            cita.IdUsuarioAsignado,
            cita.FechaHoraCita,
            cita.DuracionEstimadaMin,
            cita.MotivoConsulta,
            cita.Observaciones,
            cita.FechaCreacion);

        return CreatedAtAction(nameof(GetById), new { id = cita.IdCita }, ApiResponse<CitaDetailDto>.Ok(response));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<CitaDetailDto>>> Update(
        int id,
        UpdateCitaRequest request,
        CancellationToken cancellationToken)
    {
        var cita = await db.Citas.FirstOrDefaultAsync(x => x.IdCita == id, cancellationToken);

        if (cita is null)
        {
            return NotFound(ApiResponse<CitaDetailDto>.Fail("Cita no encontrada."));
        }

        cita.IdVehiculo = request.IdVehiculo;
        cita.IdEstadoCita = request.IdEstadoCita;
        cita.IdTipoCita = request.IdTipoCita;
        cita.IdUsuarioAsignado = request.IdUsuarioAsignado;
        cita.FechaHoraCita = request.FechaHoraCita;
        cita.DuracionEstimadaMin = request.DuracionEstimadaMin;
        cita.MotivoConsulta = request.MotivoConsulta;
        cita.Observaciones = request.Observaciones;
        cita.FechaModificacion = DateTime.Now;

        await db.SaveChangesAsync(cancellationToken);

        var response = new CitaDetailDto(
            cita.IdCita,
            cita.IdCliente,
            cita.IdVehiculo,
            cita.IdEstadoCita,
            cita.IdTipoCita,
            cita.IdUsuarioAsignado,
            cita.FechaHoraCita,
            cita.DuracionEstimadaMin,
            cita.MotivoConsulta,
            cita.Observaciones,
            cita.FechaCreacion);

        return Ok(ApiResponse<CitaDetailDto>.Ok(response, "Cita actualizada."));
    }

    [HttpPatch("{id:int}/estado")]
    public async Task<ActionResult<ApiResponse<object>>> CambiarEstado(
        int id,
        CambiarEstadoCitaRequest request,
        CancellationToken cancellationToken)
    {
        var cita = await db.Citas.FirstOrDefaultAsync(x => x.IdCita == id, cancellationToken);

        if (cita is null)
        {
            return NotFound(ApiResponse<object>.Fail("Cita no encontrada."));
        }

        var estado = await db.EstadosCita
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdEstadoCita == request.IdEstadoCita, cancellationToken);

        if (estado is null)
        {
            return BadRequest(ApiResponse<object>.Fail("Estado de cita invalido."));
        }

        cita.IdEstadoCita = request.IdEstadoCita;
        cita.FechaModificacion = DateTime.Now;

        if (estado.Nombre.Equals("Confirmed", StringComparison.OrdinalIgnoreCase))
        {
            cita.FechaConfirmacion = DateTime.Now;
        }

        if (estado.Nombre.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            cita.FechaCancelacion = DateTime.Now;
            cita.MotivoCancelacion = request.MotivoCancelacion;
        }

        await db.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(new
        {
            cita.IdCita,
            cita.IdEstadoCita,
            Estado = estado.Nombre
        }, "Estado de cita actualizado."));
    }
}
