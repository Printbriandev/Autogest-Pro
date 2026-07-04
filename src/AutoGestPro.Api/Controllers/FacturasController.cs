using AutoGestPro.Api.Common;
using AutoGestPro.Api.Data;
using AutoGestPro.Api.Entities.Dbo;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Facturacion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/facturas")]
public sealed class FacturasController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<FacturaListItemDto>>>> GetAll(
        [FromQuery] int? idEstadoFactura,
        [FromQuery] int? idCliente,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query =
            from factura in db.Facturas.AsNoTracking()
            join cliente in db.Clientes.AsNoTracking() on factura.IdCliente equals cliente.IdCliente
            join estado in db.EstadosFactura.AsNoTracking() on factura.IdEstadoFactura equals estado.IdEstadoFactura
            select new { factura, cliente, estado };

        if (idEstadoFactura.HasValue)
        {
            query = query.Where(x => x.factura.IdEstadoFactura == idEstadoFactura.Value);
        }

        if (idCliente.HasValue)
        {
            query = query.Where(x => x.factura.IdCliente == idCliente.Value);
        }

        var result = await query
            .OrderByDescending(x => x.factura.FechaEmision)
            .Select(x => new FacturaListItemDto(
                x.factura.IdFactura,
                x.factura.NumeroFactura,
                x.factura.NCF,
                x.factura.IdCliente,
                (x.cliente.Nombres + " " + x.cliente.Apellidos).Trim(),
                x.estado.Nombre,
                x.factura.FechaEmision,
                x.factura.Total,
                x.factura.MontoPagado,
                x.factura.SaldoPendiente))
            .ToPagedResultAsync(page, pageSize, cancellationToken);

        return Ok(ApiResponse<PagedResult<FacturaListItemDto>>.Ok(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<FacturaListItemDto>>> Create(
        CreateFacturaRequest request,
        CancellationToken cancellationToken)
    {
        var factura = new Factura
        {
            NumeroFactura = request.NumeroFactura,
            NCF = request.Ncf,
            IdTipoNCF = request.IdTipoNcf,
            IdCliente = request.IdCliente,
            IdOrdenServicio = request.IdOrdenServicio,
            IdEstadoFactura = request.IdEstadoFactura,
            IdMetodoPago = request.IdMetodoPago,
            FechaEmision = DateTime.Now,
            FechaVencimiento = request.FechaVencimiento.HasValue
                ? DateOnly.FromDateTime(request.FechaVencimiento.Value)
                : null,
            SubTotal = request.SubTotal,
            MontoDescuento = request.MontoDescuento,
            MontoImpuesto = request.MontoImpuesto,
            Total = request.Total,
            MontoPagado = 0,
            SaldoPendiente = request.Total,
            Notas = request.Notas,
            FechaCreacion = DateTime.Now,
            IdUsuarioCreacion = request.IdUsuarioCreacion
        };

        db.Facturas.Add(factura);
        await db.SaveChangesAsync(cancellationToken);

        var cliente = await db.Clientes.AsNoTracking()
            .FirstAsync(x => x.IdCliente == factura.IdCliente, cancellationToken);
        var estado = await db.EstadosFactura.AsNoTracking()
            .FirstAsync(x => x.IdEstadoFactura == factura.IdEstadoFactura, cancellationToken);

        var response = new FacturaListItemDto(
            factura.IdFactura,
            factura.NumeroFactura,
            factura.NCF,
            factura.IdCliente,
            $"{cliente.Nombres} {cliente.Apellidos}".Trim(),
            estado.Nombre,
            factura.FechaEmision,
            factura.Total,
            factura.MontoPagado,
            factura.SaldoPendiente);

        return CreatedAtAction(nameof(GetAll), new { idCliente = factura.IdCliente }, ApiResponse<FacturaListItemDto>.Ok(response));
    }

    [HttpPost("{id:int}/pagos")]
    public async Task<ActionResult<ApiResponse<object>>> RegistrarPago(
        int id,
        RegistrarPagoRequest request,
        CancellationToken cancellationToken)
    {
        if (id != request.IdFactura)
        {
            return BadRequest(ApiResponse<object>.Fail("El id de la ruta no coincide con la factura."));
        }

        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        var factura = await db.Facturas
            .FirstOrDefaultAsync(x => x.IdFactura == id, cancellationToken);

        if (factura is null)
        {
            return NotFound(ApiResponse<object>.Fail("Factura no encontrada."));
        }

        db.Pagos.Add(new Pago
        {
            IdFactura = id,
            IdMetodoPago = request.IdMetodoPago,
            MontoPagado = request.MontoPagado,
            ReferenciaPago = request.ReferenciaPago,
            IdUsuario = request.IdUsuario,
            Observaciones = request.Observaciones,
            FechaPago = DateTime.Now
        });

        factura.MontoPagado += request.MontoPagado;
        factura.SaldoPendiente = Math.Max(0, factura.Total - factura.MontoPagado);

        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(new
        {
            factura.IdFactura,
            factura.MontoPagado,
            factura.SaldoPendiente
        }, "Pago registrado."));
    }
}
