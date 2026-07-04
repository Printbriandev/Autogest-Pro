namespace AutoGestPro.Contracts.Ordenes;

public sealed record OrdenServicioListItemDto(
    int IdOrdenServicio,
    string NumeroOrden,
    int IdCliente,
    int IdVehiculo,
    string Cliente,
    string Estado,
    DateTime FechaIngreso,
    DateTime? FechaPrometida,
    decimal Total);

public sealed record OrdenServicioDetailDto(
    int IdOrdenServicio,
    string NumeroOrden,
    int IdCliente,
    int IdVehiculo,
    int? IdCita,
    int IdEstadoOrden,
    int IdUsuarioAsesor,
    int? IdUsuarioMecanico,
    int KilometrajeEntrada,
    int? KilometrajeSalida,
    DateTime FechaIngreso,
    DateTime? FechaPrometida,
    DateTime? FechaEntrega,
    string SintomasReportados,
    string? DiagnosticoTecnico,
    string? TrabajoRealizado,
    decimal SubTotal,
    decimal MontoImpuesto,
    decimal Total);

public sealed record CreateOrdenServicioRequest(
    string NumeroOrden,
    int IdCliente,
    int IdVehiculo,
    int? IdCita,
    int IdEstadoOrden,
    int IdUsuarioAsesor,
    int? IdUsuarioMecanico,
    int KilometrajeEntrada,
    DateTime FechaIngreso,
    DateTime? FechaPrometida,
    string SintomasReportados,
    string? Observaciones,
    int IdUsuarioCreacion);

public sealed record UpdateOrdenServicioRequest(
    int IdEstadoOrden,
    int? IdUsuarioMecanico,
    int KilometrajeEntrada,
    int? KilometrajeSalida,
    DateTime FechaIngreso,
    DateTime? FechaPrometida,
    DateTime? FechaEntrega,
    string SintomasReportados,
    string? DiagnosticoTecnico,
    string? TrabajoRealizado,
    string? Observaciones,
    decimal SubTotal,
    decimal MontoDescuento,
    decimal MontoImpuesto,
    decimal Total);
