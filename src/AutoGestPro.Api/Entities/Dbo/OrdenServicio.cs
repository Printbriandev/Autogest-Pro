using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("ServiceOrder", Schema = "dbo")]
public sealed class OrdenServicio
{
    [Key]
    public int IdOrdenServicio { get; set; }
    public string NumeroOrden { get; set; } = string.Empty;
    public int IdCliente { get; set; }
    public int IdVehiculo { get; set; }
    public int? IdCita { get; set; }
    public int IdEstadoOrden { get; set; }
    public int IdUsuarioAsesor { get; set; }
    public int? IdUsuarioMecanico { get; set; }
    public int KilometrajeEntrada { get; set; }
    public int? KilometrajeSalida { get; set; }
    public DateTime FechaIngreso { get; set; }
    public DateTime? FechaPrometida { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string SintomasReportados { get; set; } = string.Empty;
    public string? DiagnosticoTecnico { get; set; }
    public string? TrabajoRealizado { get; set; }
    public string? Observaciones { get; set; }
    public decimal SubTotal { get; set; }
    public decimal PorcentajeDescuento { get; set; }
    public decimal MontoDescuento { get; set; }
    public decimal PorcentajeImpuesto { get; set; } = 18;
    public decimal MontoImpuesto { get; set; }
    public decimal Total { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaModificacion { get; set; }
    public int IdUsuarioCreacion { get; set; }
}
