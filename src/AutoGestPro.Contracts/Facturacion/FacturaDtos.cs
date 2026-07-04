namespace AutoGestPro.Contracts.Facturacion;

public sealed record FacturaListItemDto(
    int IdFactura,
    string NumeroFactura,
    string? Ncf,
    int IdCliente,
    string Cliente,
    string Estado,
    DateTime FechaEmision,
    decimal Total,
    decimal MontoPagado,
    decimal SaldoPendiente);

public sealed record CreateFacturaRequest(
    string NumeroFactura,
    string? Ncf,
    int? IdTipoNcf,
    int IdCliente,
    int IdOrdenServicio,
    int IdEstadoFactura,
    int IdMetodoPago,
    DateTime? FechaVencimiento,
    decimal SubTotal,
    decimal MontoDescuento,
    decimal MontoImpuesto,
    decimal Total,
    string? Notas,
    int IdUsuarioCreacion);

public sealed record RegistrarPagoRequest(
    int IdFactura,
    int IdMetodoPago,
    decimal MontoPagado,
    string? ReferenciaPago,
    int IdUsuario,
    string? Observaciones);
