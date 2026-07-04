using AutoGestPro.Api.Data;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Catalogos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/catalogos")]
public sealed class CatalogosController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetAll(CancellationToken cancellationToken)
    {
        var data = new
        {
            tiposCliente = await db.TiposCliente.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdTipoCliente, x.Descripcion))
                .ToListAsync(cancellationToken),
            marcas = await db.MarcasVehiculo.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdMarca, x.Nombre, x.PaisOrigen))
                .ToListAsync(cancellationToken),
            modelos = await db.ModelosVehiculo.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new { x.IdModelo, x.IdMarca, x.Nombre })
                .ToListAsync(cancellationToken),
            colores = await db.Colores.AsNoTracking()
                .Select(x => new CatalogoItemDto(x.IdColor, x.Nombre, x.CodigoHex))
                .ToListAsync(cancellationToken),
            tiposVehiculo = await db.TiposVehiculo.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdTipoVehiculo, x.Descripcion))
                .ToListAsync(cancellationToken),
            tiposCita = await db.TiposCita.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdTipoCita, x.Nombre))
                .ToListAsync(cancellationToken),
            estadosCita = await db.EstadosCita.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdEstadoCita, x.Nombre, x.Descripcion))
                .ToListAsync(cancellationToken),
            estadosOrden = await db.EstadosOrden.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdEstadoOrden, x.Nombre))
                .ToListAsync(cancellationToken),
            estadosFactura = await db.EstadosFactura.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdEstadoFactura, x.Nombre))
                .ToListAsync(cancellationToken),
            metodosPago = await db.MetodosPago.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdMetodoPago, x.Nombre))
                .ToListAsync(cancellationToken),
            tiposNcf = await db.TiposNcf.AsNoTracking()
                .Where(x => x.Activo)
                .Select(x => new CatalogoItemDto(x.IdTipoNCF, x.Codigo, x.Descripcion))
                .ToListAsync(cancellationToken)
        };

        return Ok(ApiResponse<object>.Ok(data));
    }
}
