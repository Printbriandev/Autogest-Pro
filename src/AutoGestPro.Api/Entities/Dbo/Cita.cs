using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("Appointment", Schema = "dbo")]
public sealed class Cita
{
    [Key]
    public int IdCita { get; set; }
    public int IdCliente { get; set; }
    public int? IdVehiculo { get; set; }
    public int IdEstadoCita { get; set; }
    public int IdTipoCita { get; set; }
    public int? IdUsuarioAsignado { get; set; }
    public DateTime FechaHoraCita { get; set; }
    public int? DuracionEstimadaMin { get; set; }
    public string MotivoConsulta { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime? FechaCancelacion { get; set; }
    public string? MotivoCancelacion { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaModificacion { get; set; }
    public int IdUsuarioCreacion { get; set; }
}
