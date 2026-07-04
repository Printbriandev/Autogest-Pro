namespace AutoGestPro.Contracts.Reportes;

public sealed record DashboardSummaryDto(
    int ClientesActivos,
    int VehiculosActivos,
    int CitasPendientes,
    int OrdenesAbiertas,
    decimal FacturasPendientes,
    int RepuestosBajoStock);

public sealed record VentaMensualDto(
    int Anio,
    int Mes,
    int TotalFacturas,
    decimal TotalFacturado,
    decimal TotalCobrado);
