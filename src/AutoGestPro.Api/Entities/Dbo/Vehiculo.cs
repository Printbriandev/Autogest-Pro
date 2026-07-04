using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoGestPro.Api.Entities.Dbo;

[Table("Vehicle", Schema = "dbo")]
public sealed class Vehiculo
{
    [Key]
    public int IdVehiculo { get; set; }
    public int IdCliente { get; set; }
    public int IdMarca { get; set; }
    public int IdModelo { get; set; }
    public int IdColor { get; set; }
    public int IdTipoVehiculo { get; set; }
    public short Anio { get; set; }
    public string NumeroPlaca { get; set; } = string.Empty;
    public string? NumeroChasis { get; set; }
    public string? NumeroMotor { get; set; }
    public decimal? Cilindraje { get; set; }
    public string TipoCombustible { get; set; } = string.Empty;
    public string Transmision { get; set; } = string.Empty;
    public int KilometrajeActual { get; set; }
    public string? FotoUrl { get; set; }
    public string? Observaciones { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaModificacion { get; set; }
}
