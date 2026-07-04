using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("Invoice", Schema = "dbo")]
public sealed class Factura
{
    [Key]
    public int IdFactura { get; set; }
    public string NumeroFactura { get; set; } = string.Empty;
    public string? NCF { get; set; }
    public int? IdTipoNCF { get; set; }
    public int IdCliente { get; set; }
    public int IdOrdenServicio { get; set; }
    public int IdEstadoFactura { get; set; }
    public int IdMetodoPago { get; set; }
    public DateTime FechaEmision { get; set; } = DateTime.Now;
    public DateOnly? FechaVencimiento { get; set; }
    public decimal SubTotal { get; set; }
    public decimal MontoDescuento { get; set; }
    public decimal MontoImpuesto { get; set; }
    public decimal Total { get; set; }
    public decimal MontoPagado { get; set; }
    public decimal SaldoPendiente { get; set; }
    public string? Notas { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public int IdUsuarioCreacion { get; set; }
}
