using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("Payment", Schema = "dbo")]
public sealed class Pago
{
    [Key]
    public int IdPago { get; set; }
    public int IdFactura { get; set; }
    public int IdMetodoPago { get; set; }
    public decimal MontoPagado { get; set; }
    public string? ReferenciaPago { get; set; }
    public DateTime FechaPago { get; set; } = DateTime.Now;
    public int IdUsuario { get; set; }
    public string? Observaciones { get; set; }
}
