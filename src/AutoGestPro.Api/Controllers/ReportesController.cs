using AutoGestPro.Api.Data;
using AutoGestPro.Contracts;
using AutoGestPro.Contracts.Reportes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoGestPro.Api.Controllers;

[ApiController]
[Route("api/reportes")]
public sealed class ReportesController(AutoGestProDbContext db) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<DashboardSummaryDto>>> GetDashboard(
        CancellationToken cancellationToken)
    {
        var estadosCitaCerrados = new[] { "Completed", "Cancelled", "No Show" };

        var citasPendientes =
            from cita in db.Citas.AsNoTracking()
            join estado in db.EstadosCita.AsNoTracking() on cita.IdEstadoCita equals estado.IdEstadoCita
            where !estadosCitaCerrados.Contains(estado.Nombre)
            select cita;

        var ordenesAbiertas =
            from orden in db.OrdenesServicio.AsNoTracking()
            join estado in db.EstadosOrden.AsNoTracking() on orden.IdEstadoOrden equals estado.IdEstadoOrden
            where !estado.EsFinal
            select orden;

        var summary = new DashboardSummaryDto(
            await db.Clientes.CountAsync(x => x.Activo, cancellationToken),
            await db.Vehiculos.CountAsync(x => x.Activo, cancellationToken),
            await citasPendientes.CountAsync(cancellationToken),
            await ordenesAbiertas.CountAsync(cancellationToken),
            await db.Facturas.SumAsync(x => (decimal?)x.SaldoPendiente, cancellationToken) ?? 0,
            await db.Repuestos.CountAsync(x => x.Activo && x.StockActual <= x.StockMinimo, cancellationToken));

        return Ok(ApiResponse<DashboardSummaryDto>.Ok(summary));
    }

    [HttpGet("ventas-mensuales")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<VentaMensualDto>>>> GetVentasMensuales(
        [FromQuery] int? anio,
        CancellationToken cancellationToken)
    {
        var query = db.Facturas.AsNoTracking();

        if (anio.HasValue)
        {
            query = query.Where(x => x.FechaEmision.Year == anio.Value);
        }

        var ventas = await query
            .GroupBy(x => new { x.FechaEmision.Year, x.FechaEmision.Month })
            .OrderBy(x => x.Key.Year)
            .ThenBy(x => x.Key.Month)
            .Select(x => new VentaMensualDto(
                x.Key.Year,
                x.Key.Month,
                x.Count(),
                x.Sum(f => f.Total),
                x.Sum(f => f.MontoPagado)))
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<VentaMensualDto>>.Ok(ventas));
    }
}
