using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Vehiculos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/vehiculos")]
public sealed class VehiculosController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<VehiculoListItemDto>>>> GetAll(
        [FromQuery] int? idCliente,
        [FromQuery] string? placa,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query =
            from v in db.Vehiculos.AsNoTracking()
            join c in db.Clientes.AsNoTracking() on v.IdCliente equals c.IdCliente
            join marca in db.MarcasVehiculo.AsNoTracking() on v.IdMarca equals marca.IdMarca
            join modelo in db.ModelosVehiculo.AsNoTracking() on v.IdModelo equals modelo.IdModelo
            select new { v, c, marca, modelo };

        if (idCliente.HasValue)
        {
            query = query.Where(x => x.v.IdCliente == idCliente.Value);
        }

        if (!string.IsNullOrWhiteSpace(placa))
        {
            query = query.Where(x => x.v.NumeroPlaca.Contains(placa));
        }

        var result = await query
            .OrderBy(x => x.v.NumeroPlaca)
            .Select(x => new VehiculoListItemDto(
                x.v.IdVehiculo,
                x.v.IdCliente,
                (x.c.Nombres + " " + x.c.Apellidos).Trim(),
                x.marca.Nombre,
                x.modelo.Nombre,
                x.v.Anio,
                x.v.NumeroPlaca,
                x.v.KilometrajeActual,
                x.v.Activo))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<VehiculoListItemDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<VehiculoDetailDto>>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var vehiculo = await db.Vehiculos
            .AsNoTracking()
            .Where(x => x.IdVehiculo == id)
            .Select(x => new VehiculoDetailDto(
                x.IdVehiculo,
                x.IdCliente,
                x.IdMarca,
                x.IdModelo,
                x.IdColor,
                x.IdTipoVehiculo,
                x.Anio,
                x.NumeroPlaca,
                x.NumeroChasis,
                x.NumeroMotor,
                x.Cilindraje,
                x.TipoCombustible,
                x.Transmision,
                x.KilometrajeActual,
                x.Observaciones,
                x.Activo))
            .FirstOrDefaultAsync(cancellationToken);

        return vehiculo is null
            ? NotFound(ApiResponse<VehiculoDetailDto>.Fail("Vehiculo no encontrado."))
            : Ok(ApiResponse<VehiculoDetailDto>.Ok(vehiculo));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<VehiculoDetailDto>>> Create(
        CreateVehiculoRequest request,
        CancellationToken cancellationToken)
    {
        var vehiculo = new Vehiculo
        {
            IdCliente = request.IdCliente,
            IdMarca = request.IdMarca,
            IdModelo = request.IdModelo,
            IdColor = request.IdColor,
            IdTipoVehiculo = request.IdTipoVehiculo,
            Anio = request.Anio,
            NumeroPlaca = request.NumeroPlaca,
            NumeroChasis = request.NumeroChasis,
            NumeroMotor = request.NumeroMotor,
            Cilindraje = request.Cilindraje,
            TipoCombustible = request.TipoCombustible,
            Transmision = request.Transmision,
            KilometrajeActual = request.KilometrajeActual,
            Observaciones = request.Observaciones,
            FechaCreacion = DateTime.Now,
            Activo = true
        };

        db.Vehiculos.Add(vehiculo);
        await db.SaveChangesAsync(cancellationToken);

        var response = new VehiculoDetailDto(
            vehiculo.IdVehiculo,
            vehiculo.IdCliente,
            vehiculo.IdMarca,
            vehiculo.IdModelo,
            vehiculo.IdColor,
            vehiculo.IdTipoVehiculo,
            vehiculo.Anio,
            vehiculo.NumeroPlaca,
            vehiculo.NumeroChasis,
            vehiculo.NumeroMotor,
            vehiculo.Cilindraje,
            vehiculo.TipoCombustible,
            vehiculo.Transmision,
            vehiculo.KilometrajeActual,
            vehiculo.Observaciones,
            vehiculo.Activo);

        return CreatedAtAction(nameof(GetById), new { id = vehiculo.IdVehiculo }, ApiResponse<VehiculoDetailDto>.Ok(response));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<VehiculoDetailDto>>> Update(
        int id,
        UpdateVehiculoRequest request,
        CancellationToken cancellationToken)
    {
        var vehiculo = await db.Vehiculos.FirstOrDefaultAsync(x => x.IdVehiculo == id, cancellationToken);

        if (vehiculo is null)
        {
            return NotFound(ApiResponse<VehiculoDetailDto>.Fail("Vehiculo no encontrado."));
        }

        vehiculo.IdMarca = request.IdMarca;
        vehiculo.IdModelo = request.IdModelo;
        vehiculo.IdColor = request.IdColor;
        vehiculo.IdTipoVehiculo = request.IdTipoVehiculo;
        vehiculo.Anio = request.Anio;
        vehiculo.NumeroPlaca = request.NumeroPlaca;
        vehiculo.NumeroChasis = request.NumeroChasis;
        vehiculo.NumeroMotor = request.NumeroMotor;
        vehiculo.Cilindraje = request.Cilindraje;
        vehiculo.TipoCombustible = request.TipoCombustible;
        vehiculo.Transmision = request.Transmision;
        vehiculo.KilometrajeActual = request.KilometrajeActual;
        vehiculo.Observaciones = request.Observaciones;
        vehiculo.Activo = request.Activo;
        vehiculo.FechaModificacion = DateTime.Now;

        await db.SaveChangesAsync(cancellationToken);

        var response = new VehiculoDetailDto(
            vehiculo.IdVehiculo,
            vehiculo.IdCliente,
            vehiculo.IdMarca,
            vehiculo.IdModelo,
            vehiculo.IdColor,
            vehiculo.IdTipoVehiculo,
            vehiculo.Anio,
            vehiculo.NumeroPlaca,
            vehiculo.NumeroChasis,
            vehiculo.NumeroMotor,
            vehiculo.Cilindraje,
            vehiculo.TipoCombustible,
            vehiculo.Transmision,
            vehiculo.KilometrajeActual,
            vehiculo.Observaciones,
            vehiculo.Activo);

        return Ok(ApiResponse<VehiculoDetailDto>.Ok(response, "Vehiculo actualizado."));
    }

    [HttpPatch("{id:int}/desactivar")]
    public async Task<ActionResult<ApiResponse<object>>> Deactivate(
        int id,
        CancellationToken cancellationToken)
    {
        var vehiculo = await db.Vehiculos.FirstOrDefaultAsync(x => x.IdVehiculo == id, cancellationToken);

        if (vehiculo is null)
        {
            return NotFound(ApiResponse<object>.Fail("Vehiculo no encontrado."));
        }

        vehiculo.Activo = false;
        vehiculo.FechaModificacion = DateTime.Now;
        await db.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(new { vehiculo.IdVehiculo, vehiculo.Activo }, "Vehiculo desactivado."));
    }
}
